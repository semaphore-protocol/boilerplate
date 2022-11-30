import { Box, Button, Divider, Heading, HStack, Link, Text, useBoolean, VStack } from "@chakra-ui/react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { solidityKeccak256 } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"
import useSubgraph from "../hooks/useSubgraph"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
import Stepper from "./Stepper"

export type ProofStepProps = {
    groupId: string
    identity: Identity
    onPrevClick: () => void
    onLog: (message: string) => void
}

export default function ProofStep({ groupId, identity, onPrevClick, onLog }: ProofStepProps) {
    const [_loading, setLoading] = useBoolean()
    const [_greetings, setGreetings] = useState<string[]>([])
    const { getGreetings, getUsers } = useSubgraph()

    useEffect(() => {
        getGreetings().then(setGreetings)
    }, [])

    const greet = useCallback(async () => {
        if (identity) {
            const greeting = prompt("Please enter your greeting:")

            if (greeting) {
                setLoading.on()
                onLog(`Posting your anonymous greeting...`)

                try {
                    const users = await getUsers()
                    const group = new Group()
                    const greetingHash = solidityKeccak256(["string"], [greeting])

                    group.addMembers(users.map(({ identityCommitment }) => identityCommitment))

                    const { proof, publicSignals } = await generateProof(identity, group, groupId, greetingHash)
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
                        setGreetings((v) => [...v, greeting])

                        onLog(`Your greeting was posted 🎉`)
                    } else {
                        onLog("Some error occurred, please try again!")
                    }
                } catch (error) {
                    console.error(error)

                    onLog("Some error occurred, please try again!")
                } finally {
                    setLoading.off()
                }
            }
        }
    }, [identity])

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
                votes, leaks, reviews, or just greetings.
            </Text>

            <Divider pt="5" borderColor="gray.500" />

            <HStack py="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Greeter signals ({_greetings.length})
                </Text>
                <Button
                    leftIcon={<IconRefreshLine />}
                    variant="link"
                    color="text.700"
                    onClick={() => getGreetings().then(setGreetings)}
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

            <Stepper step={3} onPrevClick={onPrevClick} />
        </>
    )
}
