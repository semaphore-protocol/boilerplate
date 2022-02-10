import detectEthereumProvider from "@metamask/detect-provider"
import { Strategy, ZkIdentity } from "@zk-kit/identity"
import { Semaphore } from "@zk-kit/protocols"
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

        console.log(identity.genIdentityCommitment())
        console.log(Semaphore)
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
