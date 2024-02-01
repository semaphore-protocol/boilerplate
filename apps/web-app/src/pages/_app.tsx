import { ChakraProvider, Container, HStack, Icon, IconButton, Link, Spinner, Stack, Text } from "@chakra-ui/react"
import { SupportedNetwork } from "@semaphore-protocol/data"
import type { AppProps } from "next/app"
import getNextConfig from "next/config"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa"
import LogsContext from "../context/LogsContext"
import SemaphoreContext from "../context/SemaphoreContext"
import useSemaphore from "../hooks/useSemaphore"
import theme from "../styles/index"
import shortenString from "../utils/shortenString"

const { publicRuntimeConfig: env } = getNextConfig()

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()
    const semaphore = useSemaphore()
    const [_logs, setLogs] = useState<string>("")

    useEffect(() => {
        semaphore.refreshUsers()
        semaphore.refreshFeedback()
    }, [])

    function getExplorerLink(network: SupportedNetwork, address: string) {
        switch (network) {
            case "sepolia":
                return `https://sepolia.etherscan.io/address/${address}`
            case "arbitrum-sepolia":
                return `https://sepolia.arbiscan.io/address/${address}`
            default:
                return ""
        }
    }

    return (
        <>
            <Head>
                <title>Semaphore boilerplate</title>
                <link rel="icon" href="/images/icons/favicon.ico" />
                <link rel="apple-touch-icon" sizes="180x180" href="/images/icons/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/images/icons/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/images/icons/favicon-16x16.png" />
                <link rel="manifest" href="/manifest.json" />
                <meta name="theme-color" content="#4771ea" />
            </Head>

            <ChakraProvider theme={theme}>
                <HStack align="center" justify="right" p="2">
                    <Link href={getExplorerLink(env.DEFAULT_NETWORK, env.FEEDBACK_CONTRACT_ADDRESS)} isExternal>
                        <Text>{shortenString(env.FEEDBACK_CONTRACT_ADDRESS, [6, 4])}</Text>
                    </Link>
                    <Link href="https://github.com/semaphore-protocol/boilerplate" isExternal>
                        <IconButton
                            aria-label="Github repository"
                            variant="link"
                            py="3"
                            color="text.100"
                            icon={<Icon boxSize={6} as={FaGithub} />}
                        />
                    </Link>
                </HStack>

                <Container maxW="xl" flex="1" display="flex" alignItems="center">
                    <Stack pt="8" pb="24" display="flex" width="100%">
                        <SemaphoreContext.Provider value={semaphore}>
                            <LogsContext.Provider
                                value={{
                                    _logs,
                                    setLogs
                                }}
                            >
                                <Component {...pageProps} />
                            </LogsContext.Provider>
                        </SemaphoreContext.Provider>
                    </Stack>
                </Container>

                <HStack
                    flexBasis="56px"
                    borderTopWidth="1px"
                    borderTopColor="text.600"
                    backgroundColor="darkBlueBg"
                    align="center"
                    justify="center"
                    spacing="4"
                    p="4"
                >
                    {_logs.endsWith("...") && <Spinner color="primary.400" />}
                    <Text>{_logs || `Current step: ${router.route}`}</Text>
                </HStack>
            </ChakraProvider>
        </>
    )
}
