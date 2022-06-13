import { run } from "hardhat"

async function main() {
    const { address: verifierAddress } = await run("deploy:verifier", { logs: false })

    await run("deploy:reviews", {
        logs: false,
        verifierAddress
    })
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
