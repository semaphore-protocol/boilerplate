import { Box, Button, Heading, Text } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useCallback, useEffect, useState } from "react"

export type IdentityStepProps = {
    onSuccess?: (message?: string) => void
}

export default function IdentityStep({ onSuccess }: IdentityStepProps) {
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

        if (onSuccess) {
            onSuccess()
        }
    }, [])

    return (
        <>
            <Heading as="h2" size="xl">
                Semaphore identity
            </Heading>
            <Text fontSize="md">Users interact with the protocol with identities similar to Ethereum accounts.</Text>

            {_identity && (
                <Box>
                    <Text>Trapdoor: {_identity.getTrapdoor().toString().substring(0, 10)}...</Text>
                    <Text>Nullifier: {_identity.getNullifier().toString().substring(0, 10)}...</Text>
                    <Text>Commitment: {_identity.generateCommitment().toString().substring(0, 10)}...</Text>
                </Box>
            )}

            <Button colorScheme="primary" variant="outline" onClick={createIdentity}>
                Create identity
            </Button>
        </>
    )
}
