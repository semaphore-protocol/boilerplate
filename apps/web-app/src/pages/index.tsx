import { Container, HStack, Spinner, Stack, Text } from "@chakra-ui/react"
import "@fontsource/inter/400.css"
import { Identity } from "@semaphore-protocol/identity"
import getNextConfig from "next/config"
import Head from "next/head"
import { useState } from "react"
import GroupStep from "../components/GroupStep"
import IdentityStep from "../components/IdentityStep"
import ProofStep from "../components/ProofStep"

const { publicRuntimeConfig: env } = getNextConfig()

export default function Home() {
    const [_logs, setLogs] = useState<string>("")
    const [_step, setStep] = useState<number>(1)
    const [_identity, setIdentity] = useState<Identity>()

    return (
        <>
            <Head>
                <title>Greeter</title>
                <link rel="icon" href="/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#ebedff" />
            </Head>

            <Container maxW="lg" flex="1" display="flex" alignItems="center">
                <Stack py="8" display="flex" width="100%">
                    {_step === 1 ? (
                        <IdentityStep onChange={setIdentity} onLog={setLogs} onNextClick={() => setStep(2)} />
                    ) : _step === 2 ? (
                        <GroupStep
                            identity={_identity as Identity}
                            onPrevClick={() => setStep(1)}
                            onNextClick={() => setStep(3)}
                            onLog={setLogs}
                        />
                    ) : (
                        <ProofStep
                            groupId={env.GROUP_ID}
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
