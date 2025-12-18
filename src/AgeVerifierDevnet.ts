import {
  SmartContract,
  state,
  State,
  method,
  UInt32,
  Field,
  Bool,
} from 'o1js';

/**
 * AgeVerifier zkApp for MINA DEVNET
 */
export class AgeVerifierDevnet extends SmartContract {
  @state(Field) lastVerified = State<Field>();

  @method async verifyAge(age: UInt32, minAge: UInt32) {
    // ZK constraint
    age.assertGreaterThanOrEqual(minAge);

    // Explicit & safe conversion
    this.lastVerified.set(age.toFields()[0]);
  }
}
