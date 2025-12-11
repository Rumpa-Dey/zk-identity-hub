// src/AgeVerifier.ts
import {
  SmartContract,
  state,
  State,
  method,
  UInt32,
  Field,
  Bool
} from 'o1js';

/**
 * AgeVerifier zkApp
 * - private input: age (UInt32)
 * - public input: minAge (UInt32)
 *
 * Ensures age >= minAge. On success, sets lastVerified state to age (as Field).
 */
export class AgeVerifier extends SmartContract {
  @state(Field) lastVerified = State<Field>();

  @method async verifyAge(age: UInt32, minAge: UInt32) {
    // Compare age >= minAge (returns a Bool)
    const isGE: Bool = age.greaterThanOrEqual(minAge);

    // Assert the boolean is true in-circuit
    isGE.assertTrue();

    // Save the age into state as a Field (take first field)
    const fields = age.toFields();
    this.lastVerified.set(fields[0]);
  }
}
