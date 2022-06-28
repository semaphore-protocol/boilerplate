import { Box, Button, Divider, Heading, Link, ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useCallback, useEffect, useState } from "react"
import Stepper from "./Stepper"

export type IdentityStepProps = {
    onNextClick: () => void
    onChange: (identity: Identity) => void
    onLog: (message: string) => void
}

export default function IdentityStep({ onChange, onNextClick, onLog }: IdentityStepProps) {
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const identityString = localStorage.getItem("identity")

        if (identityString) {
            const identity = new Identity(identityString)

            setIdentity(identity)

            onChange(identity)
            onLog("Your Semaphore identity was retrieved from the browser cache 👌🏽")
        } else {
            onLog("Create your Semaphore identity 👆🏽")
        }
    }, [])

    const createIdentity = useCallback(async () => {
        const identity = new Identity()

        setIdentity(identity)

        localStorage.setItem("identity", identity.toString())

        onChange(identity)
        onLog("Your new Semaphore identity was just created 🎉")
    }, [])

    return (
        <>
            <Heading as="h2" size="xl" textAlign="center">
                Semaphore identities
            </Heading>

            <Text fontSize="md">
                Users interact with the protocol with{" "}
                <Link href="https://semaphore.appliedzkp.org/docs/guides/identities" color="primary.500" isExternal>
                    identities
                </Link>{" "}
                similar to Ethereum accounts. An identity contains three values:
            </Text>
            <UnorderedList pl="20px">
                <ListItem>trapdoor and nullifier: secret values known only by the user,</ListItem>
                <ListItem>commitment: the public value.</ListItem>
            </UnorderedList>

            {_identity && (
                <Box w="100%" py="6">
                    <VStack alignItems="start" p="5" border="1px solid gray" borderRadius="4px">
                        <Text>
                            <b>Trapdoor</b>: {_identity.getTrapdoor().toString().substring(0, 35)}...
                        </Text>
                        <Text>
                            <b>Nullifier</b>: {_identity.getNullifier().toString().substring(0, 35)}...
                        </Text>
                        <Text>
                            <b>Commitment</b>: {_identity.generateCommitment().toString().substring(0, 35)}...
                        </Text>
                    </VStack>
                </Box>
            )}

            <Button colorScheme="primary" variant="outline" onClick={createIdentity}>
                Create identity
            </Button>

            <Divider pt="8" borderColor="gray" />

            <Stepper step={1} onNextClick={_identity ? onNextClick : undefined} />
        </>
    )
}
