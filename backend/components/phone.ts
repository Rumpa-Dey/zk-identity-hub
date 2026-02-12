import {
  Mina,
  PrivateKey,
  PublicKey,
  Field,
  fetchAccount,
} from "o1js";
// @ts-ignore
import { PhoneVerifierDevnet } from "../../../build/src/PhoneVerifierDevnet.js";

import { studentDB } from "../studentdb";   // ✅ import DB

const otpStore = new Map<string, string>();

const MINA_GRAPHQL =
  "https://api.minascan.io/node/devnet/v1/graphql";

export function registerPhoneRoutes(app: any) {

  // ================= SEND OTP =================
  app.post("/send-otp", (req, res) => {
    const { wallet } = req.body;

    if (!wallet) {
      return res.json({ ok: false, error: "Wallet missing" });
    }

    const student = studentDB[wallet];

    if (!student) {
      return res.json({ ok: false, error: "Student not found" });
    }

    const phone = student.phone;   // ✅ fetch phone from DB

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(wallet, otp);     // ✅ store OTP by wallet

    console.log(`📩 OTP for ${student.name} (${phone}): ${otp}`);

    res.json({ ok: true });
  });


  // ================= VERIFY PHONE =================
  app.post("/verify-phone", async (req, res) => {
    try {
      const { wallet, otp } = req.body;

      if (!wallet || !otp) {
        throw new Error("Missing wallet or otp");
      }

      if (otpStore.get(wallet) !== otp) {
        throw new Error("Invalid OTP");
      }

      otpStore.delete(wallet);

      const student = studentDB[wallet];

      if (!student) {
        throw new Error("Student not found");
      }

      const phoneField = Field(BigInt(student.phone));
      const owner = PublicKey.fromBase58(wallet);

      const Network = Mina.Network({ mina: MINA_GRAPHQL });
      Mina.setActiveInstance(Network);

      const feePayerKey = PrivateKey.fromBase58(process.env.FEE_PAYER_KEY!);
      const zkAppAddress = PublicKey.fromBase58(
        process.env.PHONE_ZKAPP_ADDRESS!
      );

      const zkApp = new PhoneVerifierDevnet(zkAppAddress);

      await fetchAccount({ publicKey: zkAppAddress });
      await PhoneVerifierDevnet.compile();

      const tx = await Mina.transaction(
        { sender: feePayerKey.toPublicKey(), fee: 200_000_000 },
        async () => {
          await zkApp.verifyPhone(phoneField, owner);
        }
      );

      await tx.prove();
      const sent = await tx.sign([feePayerKey]).send();

      res.json({ ok: true, txHash: sent.hash });

    } catch (err: any) {
      console.error("❌ Phone verification failed:", err);
      res.json({ ok: false, error: err.message });
    }
  });
}
