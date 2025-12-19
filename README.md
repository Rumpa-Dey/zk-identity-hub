# 🧾 Age Verification zkApp (Mina Devnet)

A privacy-preserving **zero-knowledge smart contract** built using **o1js** that verifies whether a user’s age is above a required threshold (e.g., 18) **without revealing the actual age**.

This zkApp is deployed and tested on **Mina Devnet**.

---

## 🚀 Features

- Zero-Knowledge age verification
- Private input: `age`
- Public rule: `age ≥ minAge`
- Stores last verified age on-chain (as a Field)


## 🧠 How It Works (High-Level)

1. The zkApp exposes a method `verifyAge(age, minAge)`

2. A zero-knowledge proof ensures:

        age ≥ minAge
3. If valid, zkApp stores the verified age on-chain

    The verifier checks the proof, without seeing the actual age.

4. Anyone can read the stored value from the blockchain

    This showcases how Mina zkApps can be used for privacy-preserving identity checks.

## 🔑 Key Roles

| Key        | Purpose                         |
|------------|----------------------------------|
| Fee Payer  | Pays transaction fees (MINA)     |
| zkApp Key  | Owns and authorizes the zkApp    |

## 🗂 Project Structure

project-root/
│

├── src/

│ ├── AgeVerifierDevnet.ts # zkApp smart contract

├── scripts/

│ ├── deployDevnet.ts

│ ├── callVerifyAgeDevnet.ts

│ └── readStateDevnet.ts

│

├── package.json

├── tsconfig.json

└── README.md



---

## 🌐 Network Configuration

- **Network:** Mina Devnet
- **GraphQL Endpoint:**

```txt
https://api.minascan.io/node/devnet/v1/graphql
```
## 🔍 View on Explorer
```bash
https://minascan.io/devnet/account/<ZKAPP_ADDRESS>

```

## 📦 Installation

Requires **Node.js 18.14.0 or higher**.

```bash
npm install
```


### 🔧 Build the project

```bash
npm run build
```
## 🚀 Deploy zkApp to Devnet

```bash
node build/scripts/deployDevnet.js
```

After deployment, note:

zkApp address

Transaction hash (from explorer)

##  Call vertifyAge

```bash
node build/scripts/callVerifyAgeDevnet.js
```
This

- Generates a zk proof

- Calls verifyAge(age, minAge)

- Updates on-chain state

## 📖 Read on-chain State


```bash
node build/scripts/readStateDevnet.js
```
This reads:

zkApp balance

lastVerified age

## 🛠 Tech Stack
Mina Protocol (Devnet)

o1js

TypeScript

Node.js

## 🎯Learning Outcomes

zkApp lifecycle (compile → deploy → call → read)

Fee payer vs zkApp key separation

Devnet transactions

On-chain state management

Zero-knowledge constraints
## 📜 License

Apache 2.0 License
