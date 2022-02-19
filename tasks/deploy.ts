import { IncrementalMerkleTree } from "@zk-kit/incremental-merkle-tree"
import { poseidon } from "circomlibjs"
import { Contract } from "ethers"
import { task, types } from "hardhat/config"
import identityCommitments from "../public/identityCommitments.json"

task("deploy", "Deploy a Greeters contract")
    .addOptionalParam<boolean>("logs", "Print the logs", true, types.boolean)
    .setAction(async ({ logs }, { ethers }): Promise<Contract> => {
        const VerifierContract = await ethers.getContractFactory("Verifier")
        const verifier = await VerifierContract.deploy()

        await verifier.deployed()

        logs && console.log(`Verifier contract has been deployed to: ${verifier.address}`)

        const GreetersContract = await ethers.getContractFactory("Greeters")

        const tree = new IncrementalMerkleTree(poseidon, 20, BigInt(0), 2)

        for (const identityCommitment of identityCommitments) {
            tree.insert(identityCommitment)
        }

        const greeters = await GreetersContract.deploy(tree.root, verifier.address)

        await greeters.deployed()

        logs && console.log(`Greeters contract has been deployed to: ${greeters.address}`)

        return greeters
    })
