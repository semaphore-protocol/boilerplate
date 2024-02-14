"use client"

import LogsContext from "@/context/LogsContext"
import SemaphoreContext from "@/context/SemaphoreContext"
import useSemaphore from "@/hooks/useSemaphore"
import shortenString from "@/utils/shortenString"
import { Container, HStack, Icon, IconButton, Link, Spinner, Stack, Text } from "@chakra-ui/react"
import { SupportedNetwork } from "@semaphore-protocol/data"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { FaGithub } from "react-icons/fa"

export default function PageContainer({
    children
}: Readonly<{
    children: React.ReactNode
}>) {
    const pathname = usePathname()
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
            <HStack align="center" justify="right" p="2">
                <Link
                    href={getExplorerLink(
                        process.env.NEXT_PUBLIC_DEFAULT_NETWORK as SupportedNetwork,
                        process.env.NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS as string
                    )}
                    isExternal
                >
                    <Text>{shortenString(process.env.NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS as string, [6, 4])}</Text>
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
                            {children}
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
                <Text>{_logs || `Current step: ${pathname}`}</Text>
            </HStack>
        </>
    )
}
