import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { Contract } from "ethers"
import { task, types } from "hardhat/config"

task("deploy:greeters", "Deploy a Greeters contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const ContractFactory = await ethers.getContractFactory("Greeters")

        const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 5)
        const identityCommitments = [
            "9426253249246138013650573474062059446203468399013007463704855436559640562175",
            "6200634377081441056179822649025268043304989981899916286941956069781421654881",
            "19706772421195815860043593475869058320994241404138740034486179990871964981523"
        ]

        for (const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment)
        }

        const contract = await ContractFactory.deploy(tree.root)

        await contract.deployed()

        logs && console.log(`Greeters contract has been deployed to: ${contract.address}`)

        return contract
    })
