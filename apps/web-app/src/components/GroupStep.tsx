import { Box, Button, Divider, Heading, HStack, Link, Text, useBoolean, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { Contract, Signer } from "ethers"
import { parseBytes32String } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
import Stepper from "./Stepper"

export type GroupStepProps = {
    signer?: Signer
    contract?: Contract
    identity: Identity
    onPrevClick: () => void
    onNextClick: () => void
    onLog: (message: string) => void
}

export default function GroupStep({ signer, contract, identity, onPrevClick, onNextClick, onLog }: GroupStepProps) {
    const [_loading, setLoading] = useBoolean()
    const [_identityCommitment, setIdentityCommitment] = useState<string>()
    const [_users, setUsers] = useState<any[]>([])

    const getUsers = useCallback(async () => {
        if (!signer || !contract) {
            return []
        }

        const users = await contract.queryFilter(contract.filters.NewUser())

        return users.map((e) => ({
            identityCommitment: e.args![0].toString(),
            username: parseBytes32String(e.args![1])
        }))
    }, [signer, contract])

    useEffect(() => {
        ;(async () => {
            const users = await getUsers()

            if (users.length > 0) {
                setUsers(users)

                onLog(`${users.length} user${users.length > 1 ? "s were" : " was"} retrieved from the Greeter group 🤙🏽`)
            }
        })()
    }, [signer, contract])

    useEffect(() => {
        setIdentityCommitment(identity.generateCommitment().toString())
    }, [identity])

    const joinGroup = useCallback(async () => {
        if (_identityCommitment) {
            const username = window.prompt("Please enter your username:")

            if (username) {
                setLoading.on()
                onLog(`Joining the Greeter group...`)

                const { status } = await fetch(`${process.env.RELAY_URL}/join-group`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        identityCommitment: _identityCommitment,
                        username
                    })
                })

                if (status === 200) {
                    setUsers((users: any) => [...users, { identityCommitment: _identityCommitment, username }])

                    onLog(`You joined the Greeter group event 🎉 Greet anonymously!`)
                } else {
                    onLog("Some error occurred, please try again!")
                }

                setLoading.off()
            }
        }
    }, [_identityCommitment])

    const userHasJoined = useCallback(
        () => _users.find((user) => user.identityCommitment === _identityCommitment),
        [_users, _identityCommitment]
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

            {_users.length > 0 && (
                <VStack spacing="3" align="left">
                    {_users.map((user, i) => (
                        <HStack key={i} p="3" borderWidth={1}>
                            <Text>{user.username}</Text>
                        </HStack>
                    ))}
                </VStack>
            )}

            <Box py="5">
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

            <Divider pt="4" borderColor="gray" />

            <Stepper step={2} onPrevClick={onPrevClick} onNextClick={userHasJoined() && onNextClick} />
        </>
    )
}
