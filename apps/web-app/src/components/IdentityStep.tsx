import { Box, Button, Divider, Heading, Text, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useCallback, useEffect, useState } from "react"
import Stepper from "./Stepper"

export type IdentityStepProps = {
    onChange?: (identity: Identity) => void
    onNextClick?: () => void
}

export default function IdentityStep({ onChange, onNextClick }: IdentityStepProps) {
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const identityString = localStorage.getItem("identity")

        if (identityString) {
            setIdentity(new Identity(identityString))
        }
    }, [])

    const createIdentity = useCallback(async () => {
        const identity = new Identity()

        setIdentity(identity)

        localStorage.setItem("identity", identity.toString())

        if (onChange) {
            onChange(identity)
        }
    }, [])

    return (
        <>
            <Heading as="h2" size="xl" textAlign="center">
                Semaphore identity
            </Heading>

            <Text fontSize="md">Users interact with the protocol with identities similar to Ethereum accounts.</Text>

            {_identity && (
                <Box w="100%" py="6">
                    <VStack alignItems="start" p="5" border="1px solid gray" borderRadius="4px">
                        <Text>Trapdoor: {_identity.getTrapdoor().toString().substring(0, 25)}...</Text>
                        <Text>Nullifier: {_identity.getNullifier().toString().substring(0, 25)}...</Text>
                        <Text>Commitment: {_identity.generateCommitment().toString().substring(0, 25)}...</Text>
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
