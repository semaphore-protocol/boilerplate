import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { Semaphore, generateMerkleProof } from "@zk-kit/protocols"
import { providers } from "ethers"
import Head from "next/head"
import styles from "../styles/Home.module.css"

export default function Home() {
    async function greet() {
        const provider = (await detectEthereumProvider()) as any

        await provider.request({ method: "eth_requestAccounts" })

        const ethersProvider = new providers.Web3Provider(provider)
        const signer = ethersProvider.getSigner()
        const message = await signer.signMessage("Sign this message to create your identity!")

        const identity = new ZkIdentity(Strategy.MESSAGE, message)
        const identityCommitment = identity.genIdentityCommitment()

        const greeting = "Hello world"

        const identityCommitments = [
            BigInt("9426253249246138013650573474062059446203468399013007463704855436559640562175"),
            BigInt("6200634377081441056179822649025268043304989981899916286941956069781421654881"),
            BigInt("19706772421195815860043593475869058320994241404138740034486179990871964981523")
        ]

        console.log(identityCommitment)

        const merkleProof = generateMerkleProof(20, BigInt(0), 5, identityCommitments, identityCommitment)
        const witness = Semaphore.genWitness(
            identity.getTrapdoor(),
            identity.getNullifier(),
            merkleProof,
            merkleProof.root,
            greeting
        )

        const fullProof = await Semaphore.genProof(witness, "./semaphore.wasm", "./semaphore_final.zkey")
        const solidityProof = Semaphore.packToSolidityProof(fullProof)

        const nullifierHash = Semaphore.genNullifierHash(merkleProof.root, identity.getNullifier())

        await fetch("/api/greet", {
            method: "POST",
            body: JSON.stringify({
                greeting,
                nullifierHash: nullifierHash.toString(),
                solidityProof: solidityProof.map((v) => v.toString())
            })
        })
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Greetings</title>
                <meta name="description" content="A simple Next.js/Hardhat privacy application with Semaphore." />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>Greetings</h1>

                <p className={styles.description}>
                    Connect your{" "}
                    <a
                        href="https://hardhat.org/hardhat-network/reference/#accounts"
                        className={styles.link}
                        target="_blank"
                        rel="noreferrer"
                    >
                        Hardhat wallet
                    </a>{" "}
                    and greet :)
                </p>

                <div onClick={() => greet()} className={styles.button}>
                    Greet
                </div>
            </main>
        </div>
    )
}
