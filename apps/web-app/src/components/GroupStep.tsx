import { Box, Button, Divider, Heading, HStack, Link, Text, useBoolean, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useCallback, useEffect, useState } from "react"
import useSubgraph from "../hooks/useSubgraph"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
import Stepper from "./Stepper"

export type GroupStepProps = {
    identity: Identity
    onPrevClick: () => void
    onNextClick: () => void
    onLog: (message: string) => void
}

export default function GroupStep({ identity, onPrevClick, onNextClick, onLog }: GroupStepProps) {
    const [_loading, setLoading] = useBoolean()
    const [_users, setUsers] = useState<any[]>([])
    const { getUsers } = useSubgraph()

    useEffect(() => {
        ;(async () => {
            const users = await getUsers()

            if (users.length > 0) {
                setUsers(users)

                onLog(`${users.length} user${users.length > 1 ? "s" : ""} retrieved from the Greeter group 🤙🏽`)
            }
        })()
    }, [])

    const joinGroup = useCallback(async () => {
        const username = window.prompt("Please enter your username:")

        if (username) {
            setLoading.on()
            onLog(`Joining the Greeter group...`)

            const { status } = await fetch("api/join", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    identityCommitment: identity.commitment.toString(),
                    username
                })
            })

            if (status === 200) {
                setUsers((users: any) => [...users, { identityCommitment: identity.commitment.toString(), username }])

                onLog(`You joined the Greeter group event 🎉 Greet anonymously!`)
            } else {
                onLog("Some error occurred, please try again!")
            }

            setLoading.off()
        }
    }, [])

    const userHasJoined = useCallback(
        () => _users.find((user) => user.identityCommitment === identity.commitment.toString()),
        [_users, identity]
    )

    return (
        <>
            <Heading as="h2" size="xl">
                Groups
            </Heading>

            <Text pt="2" fontSize="md">
                Semaphore{" "}
                <Link href="https://semaphore.appliedzkp.org/docs/guides/groups" color="primary.500" isExternal>
                    groups
                </Link>{" "}
                are binary incremental Merkle trees in which each leaf contains an identity commitment for a user.
                Groups can be abstracted to represent events, polls, or organizations.
            </Text>

            <Divider pt="5" borderColor="gray.500" />

            <HStack py="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Greeter users ({_users.length})
                </Text>
                <Button
                    leftIcon={<IconRefreshLine />}
                    variant="link"
                    color="text.700"
                    onClick={() => getUsers().then(setUsers)}
                >
                    Refresh
                </Button>
            </HStack>

            <Box pb="5">
                <Button
                    w="100%"
                    fontWeight="bold"
                    justifyContent="left"
                    colorScheme="primary"
                    px="4"
                    onClick={joinGroup}
                    isDisabled={_loading || userHasJoined()}
                    leftIcon={<IconAddCircleFill />}
                >
                    Join group
                </Button>
            </Box>

            {_users.length > 0 && (
                <VStack spacing="3" px="3" align="left" maxHeight="300px" overflowY="scroll">
                    {_users.map((user, i) => (
                        <HStack key={i} p="3" borderWidth={1}>
                            <Text>{user.username}</Text>
                        </HStack>
                    ))}
                </VStack>
            )}

            <Divider pt="6" borderColor="gray" />

            <Stepper step={2} onPrevClick={onPrevClick} onNextClick={userHasJoined() && onNextClick} />
        </>
    )
}
