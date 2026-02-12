import { Mina, PrivateKey, PublicKey, Field, fetchAccount } from "o1js";
// @ts-ignore
import { AgeVerifierDevnet } from "../../../build/src/AgeVerifierDevnet.js";

/* ✅ NEW IMPORT */
import { studentDB, calculateAge } from "../studentdb";

const MINA_GRAPHQL =
  "https://api.minascan.io/node/devnet/v1/graphql";

export function registerAgeRoutes(app: any) {
  app.post("/verify-age", async (req, res) => {
    try {

      /* ============================
         ✅ MODIFIED: Receive studentId & wallet
      ============================ */
      const { studentId, minAge, wallet } = req.body;

      if (!studentId || !minAge || !wallet) {
        return res.json({
          ok: false,
          error: "studentId, minAge or wallet missing",
        });
      }

      /* ============================
         ✅ NEW: Fetch student from DB
      ============================ */
      //const student = studentDB[studentId];
      const student = studentDB[wallet];
      if (!student) {
        return res.json({
          ok: false,
          error: "Student not found",
        });
      }

      /* ============================
         ✅ NEW: Calculate age from DOB
      ============================ */
      const actualAge = calculateAge(student.dob);

      console.log("👤 Student:", student.name);
      console.log("📅 DOB:", student.dob);
      console.log("🎂 Calculated Age:", actualAge);

      /* ============================
         ✅ NEW: Validate wallet
      ============================ */
      const userPublicKey = PublicKey.fromBase58(wallet);

      const Network = Mina.Network({ mina: MINA_GRAPHQL });
      Mina.setActiveInstance(Network);

      const feePayerKey = PrivateKey.fromBase58(process.env.FEE_PAYER_KEY!);
      const zkAppAddress = PublicKey.fromBase58(process.env.AGE_ZKAPP_ADDRESS!);
      const zkApp = new AgeVerifierDevnet(zkAppAddress);

      await fetchAccount({ publicKey: zkAppAddress });
      await AgeVerifierDevnet.compile();

      /* ============================
         ✅ MODIFIED: Use actualAge
      ============================ */
      const tx = await Mina.transaction(
        { sender: feePayerKey.toPublicKey(), fee: 200_000_000 },
        async () => {
          await zkApp.verifyAge(
            Field(BigInt(actualAge)),
            Field(BigInt(minAge))
          );
        }
      );

      await tx.prove();
      const sent = await tx.sign([feePayerKey]).send();

      res.json({ ok: true, txHash: sent.hash });

    } catch (err: any) {
      console.error("❌ Age verification failed:", err);
      res.json({ ok: false, error: err.message });
    }
  });
}
