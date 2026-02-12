import React, { useState } from "react";

interface Props {
  wallet: string;
}

export default function AgeVerification({ wallet }: Props) {
  const [studentId, setStudentId] = useState("");
  const [minAge, setMinAge] = useState("");
  const [status, setStatus] = useState("Idle");

  const handleVerifyAge = async () => {
    try {
      if (!wallet) {
        setStatus("⚠️ Please connect wallet first");
        return;
      }

      if (!studentId || !minAge) {
        setStatus("⚠️ Please enter Student ID and minimum age");
        return;
      }

      setStatus("⏳ Verifying age...");

      const res = await fetch("http://localhost:4000/verify-age", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          studentId,
          minAge,
          wallet,
        }),
      });

      const data = await res.json();

      if (data.ok) {
        setStatus("✅ Age verified! TX: " + data.txHash);
      } else {
        setStatus("❌ Age verification failed: " + data.error);
      }
    } catch (err: any) {
      setStatus("⚠️ Error: " + err.message);
    }
  };

  return (
    <div>
      <h3>Age Verification</h3>

      <input
        type="text"
        placeholder="Enter Student ID (e.g. STU001)"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
        style={{ padding: 6, marginBottom: 6 }}
      />
      <br />

      <input
        type="number"
        placeholder="Minimum required age"
        value={minAge}
        onChange={(e) => setMinAge(e.target.value)}
        style={{ padding: 6, marginBottom: 6 }}
      />
      <br />

      <button onClick={handleVerifyAge} style={{ padding: "6px 14px" }}>
        Verify Age
      </button>

      <p style={{ marginTop: 10 }}>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
}
