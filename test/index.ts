import { Identity } from "@semaphore-protocol/identity"
import { createMerkleProof, generateNullifierHash, generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
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
        const zkeyFilePath = "./public/semaphore.zkey"

        it("Should greet", async () => {
            const message = await contractOwner.signMessage("Sign this message to create your identity!")

            const identity = new Identity(message)
            const identityCommitment = identity.generateCommitment()
            const greeting = "Hello world"
            const bytes32Greeting = ethers.utils.formatBytes32String(greeting)

            const merkleProof = createMerkleProof(20, BigInt(0), identityCommitments, identityCommitment)

            const fullProof = await generateProof(identity, merkleProof, merkleProof.root, greeting, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const nullifierHash = generateNullifierHash(merkleProof.root, identity.getNullifier())

            const transaction = contract.greet(bytes32Greeting, nullifierHash, solidityProof)

            await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)
        })
    })
})
