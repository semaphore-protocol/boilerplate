<p align="center">
    <h1 align="center">
        <picture>
            <source media="(prefers-color-scheme: dark)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon-dark.svg">
            <source media="(prefers-color-scheme: light)" srcset="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
            <img width="40" alt="Semaphore icon." src="https://github.com/semaphore-protocol/website/blob/main/static/img/semaphore-icon.svg">
        </picture>
        Semaphore Boilerplate
    </h1>
</p>

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

| The repository is divided into three components: [web app](./apps/web-app), [contracts](./apps/contracts) and [subgraph](./apps/subgraph). The app allows users to create their own Semaphore identity, join a group with their usernames and then send their feedback anonymously (currently on Goerli). |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |

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

and add your environment variables.

> **Note**  
> You should at least set a valid Ethereum URL (e.g. Infura) and a private key with some ethers.

### Deploy the contract

1. Go to the `apps/contracts` directory and deploy your contract:

```bash
yarn deploy --semaphore <semaphore-address> --group <group-id> --network goerli
```

2. Update your `.env` file with your new contract address and group id.

3. Change the `address` (with the new contract address) and `startBlock` (with the block number of the transaction where the contract was created) in the `apps/subgraph/subgraph.yaml` file.

4. Copy your contract artifacts from `apps/contracts/build/contracts/contracts` folder to `apps/subgraph/contract-artifacts` and `apps/web-app/contract-artifacts` folders manually. Or run `yarn copy:contract-artifacts` in the project root to do it automatically.

5. Deploy the subgraph again.

> **Note**  
> Check the Semaphore contract addresses [here](https://semaphore.appliedzkp.org/docs/deployed-contracts).

> **Warning**  
> The group id is a number!

### Deploy the subgraph

1. Go to the `apps/subgraph` directory and update the `subgraph.yaml` file by setting your contract address.
2. Authenticate the account with your access token:

```bash
yarn auth <access-token>
```

3. Deploy your subgraph:

```bash
yarn deploy <account-name/subgraph-name>
```

### Start the app

You can start your app locally or you can easily deploy it to Vercel or AWS Amplify.

```bash
yarn start
```

### Code quality and formatting

Run [ESLint](https://eslint.org/) to analyze the code and catch bugs:

```bash
yarn lint
```

Run [Prettier](https://prettier.io/) to check formatting rules:

```bash
yarn prettier
```

or to automatically format the code:

```bash
yarn prettier:write
```
