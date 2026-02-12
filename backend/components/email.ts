import {
  Mina,
  PrivateKey,
  PublicKey,
  Field,
  fetchAccount,
} from "o1js";
// @ts-ignore
import { EmailVerifierDevnet } from "../../../build/src/EmailVerifierDevnet.js";

import { studentDB } from "../studentdb";

const otpStore = new Map<string, string>();

const MINA_GRAPHQL =
  "https://api.minascan.io/node/devnet/v1/graphql";

export function registerEmailRoutes(app: any) {

  // ========== SEND EMAIL OTP ==========
  app.post("/send-email-otp", (req, res) => {
    const { wallet } = req.body;

    const student = studentDB[wallet];

    if (!student) {
      return res.json({ ok: false, error: "Student not found" });
    }

    const email = student.email;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    otpStore.set(wallet, otp);

    console.log(`📧 OTP for ${student.name} (${email}): ${otp}`);
    res.json({ ok: true });
  });

  // ========== VERIFY EMAIL ==========
  app.post("/verify-email", async (req, res) => {
    try {
      const { wallet, otp } = req.body;

      const student = studentDB[wallet];
      if (!student) throw new Error("Student not found");

      const email = student.email;

      if (otpStore.get(wallet) !== otp) {
        throw new Error("Invalid OTP");
      }

      otpStore.delete(wallet);

      const Network = Mina.Network({ mina: MINA_GRAPHQL });
      Mina.setActiveInstance(Network);

      const feePayerKey = PrivateKey.fromBase58(process.env.FEE_PAYER_KEY!);
      const zkAppAddress = PublicKey.fromBase58(
        process.env.EMAIL_ZKAPP_ADDRESS!
      );

      const zkApp = new EmailVerifierDevnet(zkAppAddress);

      await fetchAccount({ publicKey: zkAppAddress });
      await EmailVerifierDevnet.compile();

      const emailField = Field(
        BigInt(
          [...email].reduce((acc, c) => acc + c.charCodeAt(0), 0)
        )
      );

      const tx = await Mina.transaction(
        { sender: feePayerKey.toPublicKey(), fee: 200_000_000 },
        async () => {
          await zkApp.verifyEmail(
            emailField,
            PublicKey.fromBase58(wallet)
          );
        }
      );

      await tx.prove();
      const sent = await tx.sign([feePayerKey]).send();

      res.json({ ok: true, txHash: sent.hash });

    } catch (err: any) {
      res.json({ ok: false, error: err.message });
    }
  });
}
