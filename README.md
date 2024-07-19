<h1 align="center">
    Semaphore Boilerplate
</h1>

<p align="center">
    <a href="https://github.com/semaphore-protocol" target="_blank">
        <img src="https://img.shields.io/badge/project-Semaphore-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/boilerplate/blob/main/LICENSE">
        <img alt="Github license" src="https://img.shields.io/github/license/semaphore-protocol/boilerplate.svg?style=flat-square">
    </a>
    <a href="https://github.com/semaphore-protocol/boilerplate/actions?query=workflow%3Astyle">
        <img alt="GitHub Workflow style" src="https://img.shields.io/github/actions/workflow/status/semaphore-protocol/boilerplate/style.yml?branch=main&label=style&style=flat-square&logo=github">
    </a>
    <a href="https://eslint.org/">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
    <a href="https://www.gitpoap.io/gh/semaphore-protocol/boilerplate" target="_blank">
        <img src="https://public-api.gitpoap.io/v1/repo/semaphore-protocol/boilerplate/badge">
    </a>
</p>

| The repository is divided into two components: [web app](./apps/web-app) and [contracts](./apps/contracts). The app allows users to create their own Semaphore identity, join a group and then send their feedback anonymously (currently on Sepolia). |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## 🛠 Install

Use this repository as a Github [template](https://github.com/semaphore-protocol/boilerplate/generate).

Clone your repository:

```bash
git clone https://github.com/<your-username>/<your-repo>.git
```

and install the dependencies:

```bash
cd <your-repo> && yarn
```

## 📜 Usage

Copy the `.env.example` file as `.env`:

```bash
cp .env.example .env
```

and add your environment variables or run the app in a local network.

### Local server

You can start your app locally with:

```bash
yarn dev
```

### Deploy the contract

1. Go to the `apps/contracts` directory and deploy your contract:

```bash
yarn deploy --semaphore <semaphore-address> --network sepolia
```

2. Update the `apps/web-app/.env.production` file with your new contract address and the group id.

3. Copy your contract artifacts from `apps/contracts/artifacts/contracts` folder to `apps/web-app/contract-artifacts` folder.

> [!NOTE]
> Check the Semaphore contract addresses [here](https://docs.semaphore.pse.dev/deployed-contracts).

### Verify the contract

Verify your contract on Etherscan:

```bash
yarn verify <your-contract-address> <semaphore-address> --network sepolia
```

> **Note**  
> Remember to set the Etherscan API Key in your .env file.

### Code formatting

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

or to automatically format the code:

```bash
yarn prettier:write
```
