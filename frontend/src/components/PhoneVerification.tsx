import React, { useState } from "react";

interface Props {
  wallet: string;
}

export default function PhoneVerification({ wallet }: Props) {
  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState("Idle");

  const handleSendOtp = async () => {
    if (!wallet) {
      setStatus("⚠️ Please connect wallet first");
      return;
    }

    setStatus("📩 Sending OTP...");

    const res = await fetch("http://localhost:4000/send-otp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ wallet }),
    });

    const data = await res.json();

    if (data.ok) {
      setStatus("✅ OTP sent (check backend console)");
    } else {
      setStatus("❌ " + data.error);
    }
  };

  const handleVerifyPhone = async () => {
    if (!wallet || !otp) {
      setStatus("⚠️ Wallet or OTP missing");
      return;
    }

    setStatus("⏳ Verifying phone...");

    const res = await fetch("http://localhost:4000/verify-phone", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        wallet,
        otp,
      }),
    });

    const data = await res.json();

    if (data.ok) {
      setStatus("✅ Phone verified! TX: " + data.txHash);
    } else {
      setStatus("❌ Phone verification failed: " + data.error);
    }
  };

  return (
    <div>
      <h3>Phone Verification</h3>

      <button onClick={handleSendOtp} style={{ padding: "6px 14px" }}>
        Send OTP
      </button>

      <br /><br />

      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        style={{ padding: 6 }}
      />

      <br /><br />

      <button onClick={handleVerifyPhone} style={{ padding: "6px 14px" }}>
        Verify Phone
      </button>

      <p style={{ marginTop: 10 }}>
        <strong>Status:</strong> {status}
      </p>
    </div>
  );
}
