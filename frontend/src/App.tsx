import { useState } from "react";
import AgeVerification from './components/AgeVerification.tsx';
import PhoneVerification from './components/PhoneVerification.tsx';
import EmailVerification from './components/EmailVerification.tsx';

function App() {
  const [wallet, setWallet] = useState("");

  const connectWallet = async () => {
    if ((window as any).mina) {
      const accounts = await (window as any).mina.requestAccounts();
      console.log(accounts);
	setWallet(accounts[0]);
    } else {
      alert("Auro wallet not found");
    }
  };

  return (
    <div style={{ padding: 30, fontFamily: "Segoe UI, Arial" }}>
      <h2>Mina zkApp – ZK Identity Hub</h2>

      <button onClick={connectWallet}>
        {wallet ? "Connected: " + wallet.slice(0, 8) + "..." : "Connect Wallet"}
      </button>

      <hr />

      <AgeVerification wallet={wallet} />
      <hr />
      <PhoneVerification wallet={wallet} />
     <hr />

          <EmailVerification wallet={wallet} /> 
    </div>
  );
}

export default App;
