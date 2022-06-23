<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore Boilerplate
    </h1>
    <p align="center">A simple Next.js/Hardhat privacy application with <a href="https://github.com/appliedzkp/semaphore">Semaphore</a>.</p>
</p>

<p align="center">
    <a href="https://github.com/cedoor/semaphore-boilerplate/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/cedoor/semaphore-boilerplate.svg?style=flat-square">
    </a>
    <a href="https://nextjs.org/">
        <img alt="Next.js" src="https://img.shields.io/badge/framework-nextjs-393a2a?style=flat-square">
    </a>
    <a href="https://hardhat.org/">
        <img alt="Hardhat" src="https://img.shields.io/badge/contracts-hardhat-afb719?style=flat-square">
    </a>
</p>

The code can be divided into contracts, frontend and backend.

-   [Greeters.sol](https://github.com/cedoor/semaphore-boilerplate/blob/main/contracts/Greeters.sol) contains the root of an offchain Merkle tree to represent the greeters (tree leaves), i.e. the identity commitments generated using the first 3 Ethereum accounts of the Hardhat testing wallet. It also contains a simple function to allow greeters to greet, only once and only if they create a valid Semaphore proof.
-   The [frontend code](https://github.com/cedoor/semaphore-boilerplate/blob/main/pages/index.tsx) allows greeters to create a Semaphore identity with a signed Metamask message (using one of the first 3 Hardhat accounts) and a valid zero-knowledge proof.
-   The [backend code](https://github.com/cedoor/semaphore-boilerplate/blob/main/pages/api/greet.ts) is an API that sends a `greet` transaction signed by the contract owner with the zero-knowledge proof of a greeter.

## 🛠 Install

Clone this repository and install the dependencies:

```bash
git clone https://github.com/cedoor/semaphore-boilerplate.git
cd semaphore-boilerplate
yarn
```

## 📜 Usage

#### 1. Compile & test the contract

```bash
yarn compile
yarn test
```

#### 2. Run Next.js server & Hardhat network

```bash
yarn dev
```

#### 3. Deploy the contract

```bash
yarn deploy --network localhost
```

#### 4. Open the app

You can open the web app on http://localhost:3000.

#### 5. Install Metamask and connect the Hardhat wallet

You can find the mnemonic phrase [here](https://hardhat.org/hardhat-network/reference/#accounts).

#### 6. Create your proof

You must use one of the first 3 Hardhat accounts.
