import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { expect } from "chai"
import { formatBytes32String } from "ethers/lib/utils"
import { run } from "hardhat"
import { Greeter } from "../build/typechain"
import { config } from "../package.json"

describe("Greeter", () => {
    let greeter: Greeter

    const users: any = []
    const groupId = 42
    const group = new Group()

    before(async () => {
        greeter = await run("deploy", { logs: false, group: groupId })

        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon1")
        })

        users.push({
            identity: new Identity(),
            username: formatBytes32String("anon2")
        })

        group.addMember(users[0].identity.generateCommitment())
        group.addMember(users[1].identity.generateCommitment())
    })

    describe("# joinGroup", () => {
        it("Should allow users to join the group", async () => {
            for (let i = 0; i < group.members.length; i += 1) {
                const transaction = greeter.joinGroup(group.members[i], users[i].username)

                await expect(transaction).to.emit(greeter, "NewUser").withArgs(group.members[i], users[i].username)
            }
        })
    })

    describe("# greet", () => {
        const wasmFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.wasm`
        const zkeyFilePath = `${config.paths.build["snark-artifacts"]}/semaphore.zkey`

        it("Should allow users to greet", async () => {
            const greeting = formatBytes32String("Hello World")

            const fullProof = await generateProof(users[1].identity, group, BigInt(groupId), greeting, {
                wasmFilePath,
                zkeyFilePath
            })
            const solidityProof = packToSolidityProof(fullProof.proof)

            const transaction = greeter.greet(
                greeting,
                fullProof.publicSignals.merkleRoot,
                fullProof.publicSignals.nullifierHash,
                solidityProof
            )

            await expect(transaction).to.emit(greeter, "NewGreeting").withArgs(greeting)
        })
    })
})
