import { config as dotenvConfig } from "dotenv"
import { abi as contractAbi } from "../contracts/build/contracts/contracts/Reviews.sol/Reviews.json"
import { Contract, providers, utils, Wallet } from "ethers"
import express from "express"
import { resolve } from "path"

dotenvConfig({ path: resolve(__dirname, "./.env") })

if (typeof process.env.CONTRACT_ADDRESS !== "string") {
    throw new Error("Please, define CONTRACT_ADDRESS in your .env file")
}

if (typeof process.env.ETHEREUM_JSON_PROVIDER !== "string") {
    throw new Error("Please, define ETHEREUM_JSON_PROVIDER in your .env file")
}

if (typeof process.env.ETHEREUM_PRIVATE_KEY !== "string") {
    throw new Error("Please, define ETHEREUM_PRIVATE_KEY in your .env file")
}

const ethereumPrivateKey = process.env.ETHEREUM_PRIVATE_KEY
const ethereumJsonProvider = process.env.ETHEREUM_JSON_PROVIDER
const contractAddress = process.env.CONTRACT_ADDRESS
const port = Number(process.env.API_PORT) || 3000

const app = express()

app.get("/", async (req, res) => {
    const { review, nullifierHash, groupId, solidityProof } = JSON.parse(req.body)

    const provider = new providers.JsonRpcProvider(ethereumJsonProvider)
    const signer = new Wallet(ethereumPrivateKey, provider)
    const contract = new Contract(contractAddress, contractAbi, signer)

    try {
        await contract.postReview(utils.formatBytes32String(review), nullifierHash, groupId, solidityProof)

        res.status(200).end()
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }
})

app.listen(port, () => {
    console.info(`Started HTTP relay API at http://127.0.0.1:${port}/`)
})
