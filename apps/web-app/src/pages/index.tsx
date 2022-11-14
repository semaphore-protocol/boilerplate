import { Container, HStack, Spinner, Stack, Text } from "@chakra-ui/react"
import "@fontsource/inter/400.css"
import detectEthereumProvider from "@metamask/detect-provider"
import { Identity } from "@semaphore-protocol/identity"
import { Contract, providers } from "ethers"
import { hexlify } from "ethers/lib/utils"
import getNextConfig from "next/config"
import Head from "next/head"
import { useEffect, useState } from "react"
import Greeter from "../../contract-artifacts/Greeter.json"
import GroupStep from "../components/GroupStep"
import IdentityStep from "../components/IdentityStep"
import ProofStep from "../components/ProofStep"

const { publicRuntimeConfig: env } = getNextConfig()

export default function Home() {
    const [_logs, setLogs] = useState<string>("")
    const [_step, setStep] = useState<number>(1)
    const [_identity, setIdentity] = useState<Identity>()
    const [_contract, setContract] = useState<Contract>()

    useEffect(() => {
        ;(async () => {
            const ethereum = (await detectEthereumProvider()) as any

            await ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [
                    {
                        chainId: hexlify(Number(env.ETHEREUM_CHAIN_ID!)).replace("0x0", "0x")
                    }
                ]
            })

            const ethersProvider = new providers.Web3Provider(ethereum)

            setContract(new Contract(env.CONTRACT_ADDRESS!, Greeter.abi, ethersProvider))
        })()
    }, [])

    return (
        <>
            <Head>
                <title>Greeter</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <Container maxW="lg" flex="1" display="flex" alignItems="center">
                <Stack>
                    {_step === 1 ? (
                        <IdentityStep onChange={setIdentity} onLog={setLogs} onNextClick={() => setStep(2)} />
                    ) : _step === 2 ? (
                        <GroupStep
                            contract={_contract}
                            identity={_identity as Identity}
                            onPrevClick={() => setStep(1)}
                            onNextClick={() => setStep(3)}
                            onLog={setLogs}
                        />
                    ) : (
                        <ProofStep
                            contract={_contract}
                            identity={_identity as Identity}
                            onPrevClick={() => setStep(2)}
                            onLog={setLogs}
                        />
                    )}
                </Stack>
            </Container>

            <HStack
                flexBasis="56px"
                borderTop="1px solid #8f9097"
                backgroundColor="#DAE0FF"
                align="center"
                justify="center"
                spacing="4"
                p="4"
            >
                {_logs.endsWith("...") && <Spinner color="primary.400" />}
                <Text fontWeight="bold">{_logs || `Current step: ${_step}`}</Text>
            </HStack>
        </>
    )
}
