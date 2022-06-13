import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:verifier", "Deploy a Verifier contract")
    .addOptionalParam<number>("treeDepth", "Merkle tree depth", Number(process.env.TREE_DEPTH) || 20, types.int)
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ treeDepth, logs }, { ethers }): Promise<Contract> => {
        const ContractFactory = await ethers.getContractFactory(`Verifier${treeDepth}`)

        const contract = await ContractFactory.deploy()

        await contract.deployed()

        if (logs) {
            console.info(`Verifier${treeDepth} contract has been deployed to: ${contract.address}`)
        }

        return contract
    })
