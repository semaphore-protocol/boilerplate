import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
// @ts-ignore: typechain folder will be generated after contracts compilation
import { Feedback } from "../build/typechain"
import { config } from "../package.json"

describe("Feedback", () => {
    let feedbackContract: Feedback

    const users: any = []
    const groupId = "42"
    const group = new Group(groupId)

    before(async () => {
        feedbackContract = await run("deploy", { logs: false, group: groupId })

        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon1")
        })

        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon2")
        })

        group.addMember(users[0].identity.commitment)
        group.addMember(users[1].identity.commitment)
    })

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            for (let i = 0; i < group.members.length; i += 1) {
                const transaction = feedbackContract.joinGroup(group.members[i], users[i].username)

                await expect(transaction)
                    .to.emit(feedbackContract, "NewUser")
                    .withArgs(group.members[i], users[i].username)
            }
        })

        it("Should not allow users to join the group with the same username", async () => {
            const transaction = feedbackContract.joinGroup(group.members[0], users[0].username)

            await expect(transaction).to.be.revertedWithCustomError(feedbackContract, "Feedback__UsernameAlreadyExists")
        })
    })

    describe("# sendFeedback", () => {
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

        it("Should allow users to send feedback anonymously", async () => {
            const feedback = formatBytes32String("Hello World")

            const fullProof = await generateProof(users[1].identity, group, groupId, feedback, {
                wasmFilePath,
                zkeyFilePath
            })

            const transaction = feedbackContract.sendFeedback(
                feedback,
                fullProof.merkleTreeRoot,
                fullProof.nullifierHash,
                fullProof.proof
            )

            await expect(transaction).to.emit(feedbackContract, "NewFeedback").withArgs(feedback)
        })
    })
})
