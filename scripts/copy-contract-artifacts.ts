import * as fs from "fs"

const contractArtifactsPath = "apps/contracts/build/contracts/contracts/Feedback.sol"

const subgraphArtifactsPath = "apps/subgraph/contract-artifacts"

const webAppArtifactsPath = "apps/web-app/contract-artifacts"

async function copyArtifactsFiles() {
    try {
        await fs.promises.copyFile(`${contractArtifactsPath}/Feedback.json`, `${subgraphArtifactsPath}/Feedback.json`)
        await fs.promises.copyFile(`${contractArtifactsPath}/Feedback.json`, `${webAppArtifactsPath}/Feedback.json`)
    } catch (err) {
        throw new Error("Error occurred while copying the contract artifacts files")
    }
}

copyArtifactsFiles()