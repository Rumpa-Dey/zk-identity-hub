import {
  Mina,
  PrivateKey,
  AccountUpdate,
} from 'o1js';

import { AgeVerifierDevnet } from '../src/AgeVerifierDevnet.js';
import fs from 'fs';

async function main() {
  console.log('🚀 Deploying zkApp to MINA DEVNET');

  // ------------------------
  // 1. Load zkApp Key
  // ------------------------
  const zkAppKey = PrivateKey.fromBase58(
    JSON.parse(fs.readFileSync('./keys/zkapp-key.json', 'utf8')).privateKey
  );
  const zkAppAddress = zkAppKey.toPublicKey();

  // ------------------------
  // 2. Load Fee Payer
  // ------------------------
  const feePayerKey = PrivateKey.fromBase58(
    JSON.parse(fs.readFileSync('./keys/feepayer.json', 'utf8')).privateKey
  );
  const feePayerAddress = feePayerKey.toPublicKey();

  console.log('Fee payer:', feePayerAddress.toBase58());

  // ------------------------
  // 3. Connect to DEVNET
  // ------------------------
  const Devnet = Mina.Network(
    'https://api.minascan.io/node/devnet/v1/graphql'
  );
  Mina.setActiveInstance(Devnet);

  // ------------------------
  // 4. Compile zkApp
  // ------------------------
  console.log('⏳ Compiling contract...');
  await AgeVerifierDevnet.compile();

  const zkApp = new AgeVerifierDevnet(zkAppAddress);

  // ------------------------
  // 5. Create Deployment Tx
  // ------------------------
  console.log('🧾 Creating transaction...');
  const tx = await Mina.transaction(
    { sender: feePayerAddress, fee: 2 * 1e9 }, // 2 MINA
    async () => {
      AccountUpdate.fundNewAccount(feePayerAddress);
      await zkApp.deploy();
    }
  );

  // ------------------------
  // 6. Sign & Send
  // ------------------------
  tx.sign([feePayerKey, zkAppKey]);

  console.log('📤 Sending transaction...');
  const sentTx = await tx.send();

  console.log('----------------------------------');
  console.log('✅ DEPLOYED TO DEVNET');
  console.log('Tx hash:', sentTx.hash);
  console.log(
    'Explorer:',
    `https://minascan.io/devnet/tx/${sentTx.hash}`
  );
  console.log('----------------------------------');
}

main().catch((err) => {
  console.error('❌ Deployment failed:', err);
});
