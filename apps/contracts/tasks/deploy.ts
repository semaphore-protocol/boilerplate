import { task, types } from "hardhat/config"

task("deploy", "Deploy a Greeter contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addParam("group", "Group identifier", 42, types.int)
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
