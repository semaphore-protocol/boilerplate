import { task, types } from "hardhat/config"

task("deploy", "Deploy a Greeter contract")
    .addParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group identifier", process.env.GROUP_ID, types.int)
    .addOptionalParam("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs, semaphore: semaphoreAddress, group: groupId }, { ethers, run }) => {
        if (!semaphoreAddress) {
            const { address: verifierAddress } = await run("deploy:verifier", { logs, merkleTreeDepth: 20 })

            const { address } = await run("deploy:semaphore", {
                logs,
                verifiers: [
                    {
                        merkleTreeDepth: 20,
                        contractAddress: verifierAddress
                    }
                ]
            })

            semaphoreAddress = address
        }

        const Greeter = await ethers.getContractFactory("Greeter")

        const greeter = await Greeter.deploy(semaphoreAddress, groupId)

        await greeter.deployed()

        if (logs) {
            console.info(`Greeter contract has been deployed to: ${greeter.address}`)
        }

        return greeter
    })
