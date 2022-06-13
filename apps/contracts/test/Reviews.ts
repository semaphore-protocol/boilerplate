import { Identity } from "@semaphore-protocol/identity"
import { createMerkleTree, generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { ethers, run } from "hardhat"
import { Reviews as ReviewsContract } from "../build/typechain"
import { config } from "../package.json"

describe("Reviews", () => {
    let contract: ReviewsContract

    const treeDepth = Number(process.env.TREE_DEPTH)
    const groupId = BigInt(1)
    const identity = new Identity()
    const identityCommitment = identity.generateCommitment()
    const tree = createMerkleTree(treeDepth, BigInt(0), [identityCommitment])

    const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
    const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

    before(async () => {
        const { address: verifierAddress } = await run("deploy:verifier", {
            logs: false
        })

        contract = await run("deploy:reviews", {
            logs: false,
            verifierAddress
        })
    })

    describe("# createGroup", () => {
        it("Should create a group", async () => {
            const transaction = contract.createGroup(groupId)

            await expect(transaction).to.emit(contract, "GroupCreated").withArgs(groupId, treeDepth, BigInt(0))
        })
    })

    describe("# addMember", () => {
        it("Should add a member to a group", async () => {
            const transaction = contract.addMember(groupId, identityCommitment)

            await expect(transaction).to.emit(contract, "MemberAdded").withArgs(groupId, identityCommitment, tree.root)
        })
    })

    describe("# postReview", () => {
        it("Should post a review anonymously", async () => {
            const review = "Great!"
            const bytes32Review = ethers.utils.formatBytes32String(review)

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
