import { run } from "hardhat"

async function main() {
    const { address: verifierAddress } = await run("deploy:verifier")

    await run("deploy:reviews", {
        verifierAddress
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
