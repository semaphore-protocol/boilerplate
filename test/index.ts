import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { expect } from "chai"
import { Contract, Signer } from "ethers"
import { ethers, run } from "hardhat"
import identityCommitments from "../public/identityCommitments.json"

describe("Greeters", function () {
    let contract: Contract
    let contractOwner: Signer

    before(async () => {
        contract = await run("deploy", { logs: false })

        const signers = await ethers.getSigners()
        contractOwner = signers[0]
    })

    describe("# greet", () => {
        const wasmFilePath = "./public/semaphore.wasm"
        const finalZkeyPath = "./public/semaphore_final.zkey"

        it("Should greet", async () => {
            const message = await contractOwner.signMessage("Sign this message to create your identity!")

            const identity = new ZkIdentity(Strategy.MESSAGE, message)
            const identityCommitment = identity.genIdentityCommitment()
            const greeting = "Hello world"
            const bytes32Greeting = ethers.utils.formatBytes32String(greeting)

            const merkleProof = generateMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)
            const witness = Semaphore.genWitness(
                identity.getTrapdoor(),
                identity.getNullifier(),
                merkleProof,
                merkleProof.root,
                greeting
            )

            const fullProof = await Semaphore.genProof(witness, wasmFilePath, finalZkeyPath)
            const solidityProof = Semaphore.packToSolidityProof(fullProof.proof)

            const nullifierHash = Semaphore.genNullifierHash(merkleProof.root, identity.getNullifier())

            const transaction = contract.greet(bytes32Greeting, nullifierHash, solidityProof)

            await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)
        })
    })
})
