import { Identity } from "@semaphore-protocol/identity"
import { createMerkleTree, generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String, solidityKeccak256 } from "ethers/lib/utils"
import { run } from "hardhat"
import { Events as EventsContract } from "../build/typechain"
import { config } from "../package.json"

describe("Events", () => {
    let contract: EventsContract

    const treeDepth = Number(process.env.TREE_DEPTH)
    const eventName = formatBytes32String("Event")
    const groupId = BigInt(solidityKeccak256(["bytes32"], [eventName])) >> BigInt(8)
    const identity = new Identity()
    const identityCommitment = identity.generateCommitment()
    const tree = createMerkleTree(treeDepth, BigInt(0), [identityCommitment])

    const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    before(async () => {
        const { address: verifierAddress } = await run("deploy:verifier", {
            logs: false
        })

        contract = await run("deploy:events", {
            logs: false,
            verifierAddress
        })
    })

    describe("# createEvent", () => {
        it("Should create an event", async () => {
            const transaction = contract.createEvent(eventName)

            await expect(transaction).to.emit(contract, "EventCreated").withArgs(groupId, eventName)
        })
    })

    describe("# addMember", () => {
        it("Should add a member to an existing event", async () => {
            const transaction = contract.addMember(groupId, identityCommitment)

            await expect(transaction).to.emit(contract, "MemberAdded").withArgs(groupId, identityCommitment, tree.root)
        })
    })

    describe("# postReview", () => {
        it("Should post a review anonymously", async () => {
            const review = "Great!"
            const bytes32Review = formatBytes32String(review)

            const merkleProof = tree.createProof(0)

            const fullProof = await generateProof(identity, merkleProof, groupId, review, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = contract.postReview(
                bytes32Review,
                fullProof.publicSignals.nullifierHash,
                groupId,
                solidityProof
            )

            await expect(transaction).to.emit(contract, "ReviewPosted").withArgs(groupId, bytes32Review)
        })
    })
})
