// src/client.ts
import {
  PrivateKey,
  Mina,
  UInt32,
  PublicKey
} from 'o1js';
import { AgeVerifier } from './AgeVerifier.js';

async function main() {
  const Local = await Mina.LocalBlockchain();
  Mina.setActiveInstance(Local);

  const deployerPK = Local.testAccounts[0] as unknown as PublicKey;
  const deployer = (Local.testAccounts[0] as any).key as PrivateKey;

  const zkAppPK = Local.testAccounts[1] as unknown as PublicKey;
  const zkAppPriv = (Local.testAccounts[1] as any).key as PrivateKey;

  const ageVerifier = new AgeVerifier(zkAppPK);

  console.log('Compiling contract...');
  await AgeVerifier.compile();

  console.log('Deploying zkApp...');
  const deployTxn = await Mina.transaction(deployerPK, async () => {
    ageVerifier.deploy();
  });
  await deployTxn.prove();
  await deployTxn.sign([deployer, zkAppPriv]).send();
  console.log('Deployed.');

  // Example: values from a form (numbers)
  const userBirthYear = 1980;      // replace with form input
  const currentYear = 2025;        // ideally from a trusted source
  const minAge = 18;

  // Client-side quick check (UX) — prevents unnecessary proving
  const ageJS = currentYear - userBirthYear;
  if (ageJS < minAge) {
    console.log(`⛔ You are ${ageJS}. Must be at least ${minAge}. Aborting proof.`);
    return;
  }

  // Convert to circuit types
  const ageUInt = UInt32.from(ageJS);        // private witness
  const minAgeUInt = UInt32.from(minAge);    // public input

  // Build transaction and prove/send with robust handling
  try {
    const tx = await Mina.transaction(deployerPK, async () => {
      // Pass private/public values as UInt32
      ageVerifier.verifyAge(ageUInt, minAgeUInt);
    });

    // Generate proof
    try {
      await tx.prove();
    } catch (proveErr) {
      console.log('❌ Proof generation failed (invalid witness):', String(proveErr));
      return;
    }

    // If prove() succeeded, sign & send safely
    try {
      await tx.sign([deployer, zkAppPriv]).send();
      console.log('✅ Proof accepted on-chain. Age verified.');
    } catch (sendErr) {
      console.error('❌ send() failed (on-chain verification or other issue):', String(sendErr));
    }
  } catch (err) {
    console.error('❌ Unexpected error during tx construction/proof:', String(err));
  }
}

main().catch((e) => {
  console.error('Fatal:', String(e));
  process.exit(1);
});
