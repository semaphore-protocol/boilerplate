import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { Contract } from "ethers"
import { task, types } from "hardhat/config"
import identityCommitments from "../public/identityCommitments.json"

task("deploy", "Deploy a Greeters contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const ContractFactory = await ethers.getContractFactory("Greeters")

        const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 5)

        for (const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment)
        }

        const contract = await ContractFactory.deploy(tree.root)

        await contract.deployed()

        logs && console.log(`Greeters contract has been deployed to: ${contract.address}`)

        return contract
    })
