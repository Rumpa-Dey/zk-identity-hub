import {
  Mina,
  PrivateKey,
  PublicKey,
  UInt32,
} from 'o1js';
import fs from 'fs';
import { AgeVerifierDevnet } from '../src/AgeVerifierDevnet.js';

// ---------------- CONFIG ----------------
const ZKAPP_ADDRESS =
  'B62qor9EwMMyfEG7zciYCahgxjQ4NQ96aETEXZHzWZYw1vu4dEetabk';

const FEE_PAYER_KEY_PATH = 'keys/feepayer.json';
const ZKAPP_KEY_PATH = 'keys/zkapp-key.json';
const FEE = 2e9; // 2 MINA
// ----------------------------------------

async function main() {
  console.log('🌐 Connecting to MINA Devnet...');
  const network = Mina.Network(
    'https://api.minascan.io/node/devnet/v1/graphql'
  );
  Mina.setActiveInstance(network);

  // Fee payer
  const feePayerJson = JSON.parse(
    fs.readFileSync(FEE_PAYER_KEY_PATH, 'utf8')
  );
  const feePayerKey = PrivateKey.fromBase58(feePayerJson.privateKey);
  const feePayerPub = feePayerKey.toPublicKey();

  console.log('💰 Fee payer:', feePayerPub.toBase58());

  // zkApp key
  const zkAppJson = JSON.parse(
    fs.readFileSync(ZKAPP_KEY_PATH, 'utf8')
  );
  const zkAppKey = PrivateKey.fromBase58(zkAppJson.privateKey);
  const zkAppPubFromKey = zkAppKey.toPublicKey();

  console.log('🧩 zkApp pub (from key):', zkAppPubFromKey.toBase58());
  console.log('🧩 zkApp pub (expected):', ZKAPP_ADDRESS);

  // 🔒 Safety check
  if (zkAppPubFromKey.toBase58() !== ZKAPP_ADDRESS) {
    throw new Error('❌ zkApp key does NOT match deployed address');
  }

  const zkAppAddress = PublicKey.fromBase58(ZKAPP_ADDRESS);
  const zkApp = new AgeVerifierDevnet(zkAppAddress);
  
  console.log('🔧 Compiling zkApp...');
  await AgeVerifierDevnet.compile();  

  console.log('🧾 Creating verifyAge transaction...');
  const tx = await Mina.transaction(
    { sender: feePayerPub, fee: FEE },
    async () => {
      await zkApp.verifyAge(
        UInt32.from(21),
        UInt32.from(18)
      );
    }
  );

  console.log('⏳ Proving...');
  await tx.prove();

  console.log('✍️ Signing...');
  tx.sign([feePayerKey, zkAppKey]);

  console.log('📤 Sending...');
  const sent = await tx.send();

  console.log('✅ verifyAge() SUCCESSFULLY CALLED');
  console.log('Tx hash:', sent.hash);
}

main().catch(console.error);
