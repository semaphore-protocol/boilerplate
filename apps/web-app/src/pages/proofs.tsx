import { Box, Button, Divider, Heading, HStack, Link, Text, useBoolean, VStack } from "@chakra-ui/react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { solidityKeccak256 } from "ethers/lib/utils"
import getNextConfig from "next/config"
import { useRouter } from "next/router"
import { useCallback, useContext, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import SubgraphContext from "../context/SubgraphContext"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"

const { publicRuntimeConfig: env } = getNextConfig()

export default function ProofsPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const { _users, _greetings, refreshGreetings, addGreeting } = useContext(SubgraphContext)
    const [_loading, setLoading] = useBoolean()
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const identityString = localStorage.getItem("identity")

        if (!identityString) {
            router.push("/")
            return
        }

        setIdentity(new Identity(identityString))
    }, [])

    useEffect(() => {
        if (_greetings.length > 0) {
            setLogs(
                `${_greetings.length} greeting${_greetings.length > 1 ? "s" : ""} retrieved from the Greeter group 🤙🏽`
            )
        }
    }, [_greetings])

    const greet = useCallback(async () => {
        if (!_identity) {
            return
        }

        const greeting = prompt("Please enter your greeting:")

        if (greeting) {
            setLoading.on()
            setLogs(`Posting your anonymous greeting...`)

            try {
                const group = new Group()
                const greetingHash = solidityKeccak256(["string"], [greeting])

                group.addMembers(_users.map(({ identityCommitment }) => identityCommitment))

                const { proof, publicSignals } = await generateProof(_identity, group, env.GROUP_ID, greetingHash)
                const solidityProof = packToSolidityProof(proof)

                const { status } = await fetch("api/greet", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        greeting,
                        merkleRoot: publicSignals.merkleRoot,
                        nullifierHash: publicSignals.nullifierHash,
                        solidityProof
                    })
                })

                if (status === 200) {
                    addGreeting(greeting)

                    setLogs(`Your greeting was posted 🎉`)
                } else {
                    setLogs("Some error occurred, please try again!")
                }
            } catch (error) {
                console.error(error)

                setLogs("Some error occurred, please try again!")
            } finally {
                setLoading.off()
            }
        }
    }, [_identity])

    return (
        <>
            <Heading as="h2" size="xl">
                Proofs
            </Heading>

            <Text pt="2" fontSize="md">
                Semaphore members can anonymously{" "}
                <Link href="https://semaphore.appliedzkp.org/docs/guides/proofs" color="primary.500" isExternal>
                    prove
                </Link>{" "}
                that they are part of a group and that they are generating their own signals. Signals could be anonymous
                votes, leaks, reviews, or greetings.
            </Text>

            <Divider pt="5" borderColor="gray.500" />

            <HStack py="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Greeter signals ({_greetings.length})
                </Text>
                <Button leftIcon={<IconRefreshLine />} variant="link" color="text.700" onClick={refreshGreetings}>
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
                    onClick={greet}
                    isDisabled={_loading}
                    leftIcon={<IconAddCircleFill />}
                >
                    Greet
                </Button>
            </Box>

            {_greetings.length > 0 && (
                <VStack spacing="3" align="left">
                    {_greetings.map((greeting, i) => (
                        <HStack key={i} p="3" borderWidth={1}>
                            <Text>{greeting}</Text>
                        </HStack>
                    ))}
                </VStack>
            )}

            <Divider pt="6" borderColor="gray" />

            <Stepper step={3} onPrevClick={() => router.push("/groups")} />
        </>
    )
}
