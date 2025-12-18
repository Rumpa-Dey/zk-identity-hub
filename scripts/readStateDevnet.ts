import { Mina, PublicKey, fetchAccount } from 'o1js';
import { AgeVerifierDevnet } from '../src/AgeVerifierDevnet.js';

const zkAppAddress = PublicKey.fromBase58(
  'B62qor9EwMMyfEG7zciYCahgxjQ4NQ96aETEXZHzWZYw1vu4dEetabk'
);

async function main() {
  console.log('🌐 Connecting to MINA Devnet...');

  const Network = Mina.Network(
    'https://api.minascan.io/node/devnet/v1/graphql'
  );
  Mina.setActiveInstance(Network);

  console.log('⏳ Fetching zkApp account...');
  await fetchAccount({ publicKey: zkAppAddress }); // ✅ REQUIRED

  const zkApp = new AgeVerifierDevnet(zkAppAddress);

  // 🔐 Read on-chain state
  const lastVerified = zkApp.lastVerified.get();

  // 💰 Read balance
  const account = Mina.getAccount(zkAppAddress);

  console.log('✅ zkApp balance (MINA):', account.balance.toBigInt() / 1_000_000_000n);
  console.log('✅ lastVerified state:', lastVerified.toString());
}

main();
