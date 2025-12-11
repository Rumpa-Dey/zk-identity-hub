# 🧾 Age Verification zkApp (Mina Protocol)

A privacy-preserving **Zero-Knowledge Age Verification** zkApp built using the **Mina Protocol** and **o1js**.  
This zkApp allows a user to **prove their age is above a required threshold (e.g., 18)** **without revealing their actual age**.  
This is the initial prototype intended for future enhancement and Mina Grant submissions.

---

## 🚀 Features

- ✔ Zero-Knowledge verification of age  
- ✔ Actual age is never revealed  
- ✔ Written using **o1js**  
- ✔ Fully local execution example  
- ✔ Simple client script demonstrating proof generation + verification  

---

## 🗂 Project Structure

project-root/
│

├── src/

│ ├── AgeVerifier.ts # zkApp smart contract

│ ├── client.ts # Script to generate and verify the ZK proof

│

├── package.json

├── tsconfig.json

└── README.md

---

## 📦 Installation

Requires **Node.js 18.14.0 or higher**.

```bash
npm install
```
## ▶️ Usage

### 🔧 Build the project

```bash
npm run build
```
## ▶️ Run the age verification script

If your package.json includes:

```bash
"dev": "ts-node src/client.ts"
```
Then run:
```bash
npm run dev
```
Otherwise:
```bash
npx ts-node src/client.ts
```

This will:

Compile the smart contract

Generate a Zero-Knowledge proof

Verify whether a sample age meets the threshold

## 🧠 How It Works (High-Level)

The user inputs their age privately (not shared or stored).

The zkApp checks the condition:

age >= requiredAge


A zkSNARK is generated proving the condition is true.

The verifier checks the proof, without seeing the actual age.

This showcases how Mina zkApps can be used for privacy-preserving identity checks.

## 🛠 Tech Stack

Mina Protocol

o1js

TypeScript

Node.js

## 🌱 Future Enhancements

Store verification results on-chain

Add UI + wallet integration

Build reusable ZK identity components

Deploy on Berkeley Testnet / Mainnet

Add more attributes (DOB, KYC fields) with selective disclosure

These upgrades will be part of the next milestones and grant submissions.

## 🤝 Contributing

Feedback and contributions are welcome!

## 📜 License

Apache 2.0 License
