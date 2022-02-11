import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { generateMerkleProof, Semaphore } from "@zk-kit/protocols"
import { expect } from "chai"
import { Contract, Signer } from "ethers"
import { run, ethers } from "hardhat"

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

            const identityCommitments = [
                BigInt("9426253249246138013650573474062059446203468399013007463704855436559640562175"),
                BigInt("6200634377081441056179822649025268043304989981899916286941956069781421654881"),
                BigInt("19706772421195815860043593475869058320994241404138740034486179990871964981523")
            ]

            const merkleProof = generateMerkleProof(20, BigInt(0), 5, identityCommitments, identityCommitment)
            const witness = Semaphore.genWitness(
                identity.getTrapdoor(),
                identity.getNullifier(),
                merkleProof,
                merkleProof.root,
                greeting
            )

            const fullProof = await Semaphore.genProof(witness, wasmFilePath, finalZkeyPath)
            const solidityProof = Semaphore.packToSolidityProof(fullProof)

            const nullifierHash = Semaphore.genNullifierHash(merkleProof.root, identity.getNullifier())

            const transaction = contract.greet(greeting, nullifierHash, solidityProof)

            await expect(transaction).to.emit(contract, "NewGreeting").withArgs(greeting)
        })
    })
})
