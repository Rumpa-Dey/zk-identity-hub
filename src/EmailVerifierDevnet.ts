import {
  SmartContract,
  method,
  Field,
  Poseidon,
  PublicKey,
  State,
  state,
} from "o1js";

export class EmailVerifierDevnet extends SmartContract {
  @state(Field) emailHash = State<Field>();

  init() {
    super.init();
    this.emailHash.set(Field(0));
  }

  @method async verifyEmail(email: Field, owner: PublicKey) {
    const hash = Poseidon.hash([
      email,
      ...owner.toFields(),
    ]);

    this.emailHash.set(hash);
  }
}
