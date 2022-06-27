import cors from "cors"
import { Contract, providers, utils, Wallet } from "ethers"
import express from "express"
import { abi as contractAbi } from "../contracts/build/contracts/contracts/Events.sol/Events.json"

const ethereumPrivateKey = "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"
const ethereumJsonProvider = "http://localhost:8545"
const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
const port = 3000

const app = express()

app.use(cors())
app.use(express.json())

const provider = new providers.JsonRpcProvider(ethereumJsonProvider)
const signer = new Wallet(ethereumPrivateKey, provider)
const contract = new Contract(contractAddress, contractAbi, signer)

app.post("/post-review", async (req, res) => {
    const { review, nullifierHash, groupId, solidityProof } = req.body

    try {
        const transaction = await contract.postReview(
            utils.formatBytes32String(review),
            nullifierHash,
            groupId,
            solidityProof
        )

        await transaction.wait()

        res.status(200).end()
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }
})

app.post("/add-member", async (req, res) => {
    const { groupId, identityCommitment } = req.body

    try {
        const transaction = await contract.addMember(groupId, identityCommitment)

        await transaction.wait()

        res.status(200).end()
    } catch (error: any) {
        console.error(error)

        res.status(500).end()
    }
})

app.listen(port, () => {
    console.info(`Started HTTP relay API at http://127.0.0.1:${port}/`)
})
