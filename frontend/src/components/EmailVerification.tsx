import React, { useState } from "react";

interface Props {
  wallet: string;
}

export default function EmailVerification({ wallet }: Props) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("Idle");

  const sendOtp = async () => {
    setStatus("📧 Sending OTP...");

    await fetch("http://localhost:4000/send-email-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet }),
    });

    setStatus("✅ OTP sent (check backend console)");
  };

  const verifyEmail = async () => {
    setStatus("⏳ Verifying email...");

    const res = await fetch("http://localhost:4000/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wallet, otp }),
    });

    const data = await res.json();

    setStatus(
      data.ok
        ? "✅ Email verified! TX: " + data.txHash
        : "❌ Failed: " + data.error
    );
  };

  return (
    <div>
      <h3>Email Verification</h3>

      <button onClick={sendOtp}>Send OTP</button>
      <br /><br />

      <input
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        placeholder="Enter OTP"
      />
      <br />

      <button onClick={verifyEmail}>Verify Email</button>

      <p><strong>Status:</strong> {status}</p>
    </div>
  );
}
