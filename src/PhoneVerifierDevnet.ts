import {
  SmartContract,
  method,
  Field,
  Poseidon,
  PublicKey,
  State,
  state,
} from 'o1js';

export class PhoneVerifierDevnet extends SmartContract {
  @state(Field) phoneHash = State<Field>();

  init() {
    super.init();
    this.phoneHash.set(Field(0));
  }

  /**
   * Phone verification = attestation
   * OTP is already verified off-chain
   */
  @method async verifyPhone(phone: Field, owner: PublicKey) {
    const hash = Poseidon.hash([
      phone,
      ...owner.toFields(),
    ]);

    // Just store the attestation
    this.phoneHash.set(hash);
  }
}
