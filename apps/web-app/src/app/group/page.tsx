"use client"
import Stepper from "@/components/Stepper"
import LogsContext from "@/context/LogsContext"
import SemaphoreContext from "@/context/SemaphoreContext"
import IconRefreshLine from "@/icons/IconRefreshLine"
import { Box, Button, Divider, Heading, HStack, Link, Text, useBoolean, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/core"
import { useRouter } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import Feedback from "../../../contract-artifacts/Feedback.json"
import { ethers } from "ethers"

export default function GroupsPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _users, refreshUsers, addUser } = useContext(SemaphoreContext)
    const [_loading, setLoading] = useBoolean()
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const privateKey = localStorage.getItem("identity")

        if (!privateKey) {
            router.push("/")
            return
        }

        setIdentity(new Identity(privateKey))
    }, [])

    useEffect(() => {
        if (_users.length > 0) {
            setLogs(`${_users.length} user${_users.length > 1 ? "s" : ""} retrieved from the group 🤙🏽`)
        }
    }, [_users])

    const joinGroup = useCallback(async () => {
        if (!_identity) {
            return
        }

        setLoading.on()
        setLogs(`Joining the Feedback group...`)

        let joinedGroup: boolean = false

        if (process.env.NEXT_PUBLIC_OPENZEPPELIN_AUTOTASK_WEBHOOK) {
            const response = await fetch(process.env.NEXT_PUBLIC_OPENZEPPELIN_AUTOTASK_WEBHOOK, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    abi: Feedback.abi,
                    address: process.env.NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS as string,
                    functionName: "joinGroup",
                    functionParameters: [_identity.commitment.toString()]
                })
            })

            if (response.status === 200) {
                joinedGroup = true
            }
        } else if (
            process.env.NEXT_PUBLIC_GELATO_RELAYER_ENDPOINT &&
            process.env.NEXT_PUBLIC_GELATO_RELAYER_CHAIN_ID &&
            process.env.GELATO_RELAYER_API_KEY
        ) {
            const iface = new ethers.Interface(Feedback.abi)
            const request = {
                chainId: process.env.NEXT_PUBLIC_GELATO_RELAYER_CHAIN_ID,
                target: process.env.NEXT_PUBLIC_FEEDBACK_CONTRACT_ADDRESS,
                data: iface.encodeFunctionData("joinGroup", [_identity.commitment.toString()]),
                sponsorApiKey: process.env.GELATO_RELAYER_API_KEY
            }
            const response = await fetch(process.env.NEXT_PUBLIC_GELATO_RELAYER_ENDPOINT, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(request)
            })

            if (response.status === 201) {
                joinedGroup = true
            }
        } else {
            const response = await fetch("api/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identityCommitment: _identity.commitment.toString()
                })
            })

            if (response.status === 200) {
                joinedGroup = true
            }
        }

        if (joinedGroup) {
            addUser(_identity.commitment.toString())

            setLogs(`You have joined the Feedback group event 🎉 Share your feedback anonymously!`)
        } else {
            setLogs("Some error occurred, please try again!")
        }

        setLoading.off()
    }, [_identity])

    const userHasJoined = useCallback((identity: Identity) => _users.includes(identity.commitment.toString()), [_users])

    return (
        <>
            <Heading as="h2" size="xl">
                Groups
            </Heading>

            <Text pt="2" fontSize="md">
                <Link href="https://docs.semaphore.pse.dev/guides/groups" isExternal>
                    Semaphore groups
                </Link>{" "}
                are{" "}
                <Link href="https://zkkit.pse.dev/classes/_zk_kit_imt.LeanIMT.html" isExternal>
                    Lean incremental Merkle trees
                </Link>{" "}
                in which each leaf contains an identity commitment for a user. Groups can be abstracted to represent
                events, polls, or organizations.
            </Text>

            <Divider pt="5" borderColor="gray.500" />

            <HStack py="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Group users ({_users.length})
                </Text>
                <Button leftIcon={<IconRefreshLine />} variant="link" color="text.300" onClick={refreshUsers} size="lg">
                    Refresh
                </Button>
            </HStack>

            {_users.length > 0 && (
                <VStack spacing="3" pb="3" align="left" maxHeight="300px" overflowY="scroll">
                    {_users.map((user, i) => (
                        <HStack key={i} pb="3" borderBottomWidth={i < _users.length - 1 ? 1 : 0} whiteSpace="nowrap">
                            <Text textOverflow="ellipsis" overflow="hidden">
                                {_identity?.commitment === user ? <b>{user}</b> : user}
                            </Text>
                        </HStack>
                    ))}
                </VStack>
            )}

            <Box pb="5">
                <Button
                    w="full"
                    colorScheme="primary"
                    isDisabled={_loading || !_identity || userHasJoined(_identity)}
                    onClick={joinGroup}
                >
                    Join group
                </Button>
            </Box>

            <Divider pt="3" borderColor="gray.500" />

            <Stepper
                step={2}
                onPrevClick={() => router.push("/")}
                onNextClick={_identity && userHasJoined(_identity) ? () => router.push("/proofs") : undefined}
            />
        </>
    )
}
