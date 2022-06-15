import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
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
            const greeting = "Hello world"
            const bytes32Greeting = ethers.utils.formatBytes32String(greeting)

            const group = new Group()

            group.addMembers(identityCommitments)

            const fullProof = await generateProof(identity, group, group.root, greeting, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = contract.greet(bytes32Greeting, fullProof.publicSignals.nullifierHash, solidityProof)

            await expect(transaction).to.emit(contract, "NewGreeting").withArgs(bytes32Greeting)
        })
    })
})
