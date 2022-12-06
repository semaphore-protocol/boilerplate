import { task, types } from "hardhat/config"

task("deploy", "Deploy a Feedback contract")
    .addOptionalParam("semaphore", "Semaphore contract address", undefined, types.string)
    .addOptionalParam("group", "Group identifier", undefined, types.int)
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

        if (!groupId) {
            groupId = process.env.GROUP_ID
        }

        const FeedbackFactory = await ethers.getContractFactory("Feedback")

        const feedbackContract = await FeedbackFactory.deploy(semaphoreAddress, groupId)

        await feedbackContract.deployed()

        if (logs) {
            console.info(`Feedback contract has been deployed to: ${feedbackContract.address}`)
        }

        return feedbackContract
    })
