import { Box, Button, Divider, Heading, HStack, Link, ListItem, OrderedList, Text, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { useCallback, useEffect, useState } from "react"
import IconAddCircleFill from "../icons/IconAddCircleFill"
import IconRefreshLine from "../icons/IconRefreshLine"
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
            <Heading as="h2" size="xl">
                Identities
            </Heading>

            <Text pt="2" fontSize="md">
                Users interact with the protocol using a Semaphore{" "}
                <Link href="https://semaphore.appliedzkp.org/docs/guides/identities" color="primary.500" isExternal>
                    identities
                </Link>{" "}
                (similar to Ethereum accounts). It contains three values:
            </Text>
            <OrderedList pl="20px" pt="5px" spacing="3">
                <ListItem>Trapdoor: private, known only by user</ListItem>
                <ListItem>Nullifier: private, known only by user</ListItem>
                <ListItem>Commitment: public</ListItem>
            </OrderedList>

            <Divider pt="5" borderColor="gray.500" />

            <HStack pt="5" justify="space-between">
                <Text fontWeight="bold" fontSize="lg">
                    Identity
                </Text>
                {_identity && (
                    <Button leftIcon={<IconRefreshLine />} variant="link" color="text.700" onClick={createIdentity}>
                        New
                    </Button>
                )}
            </HStack>

            {_identity ? (
                <Box w="100%" py="6">
                    <VStack alignItems="start" p="5" borderWidth={1} borderColor="gray.500" borderRadius="4px">
                        <Text>Trapdoor: {_identity.getTrapdoor().toString().substring(0, 30)}...</Text>
                        <Text>Nullifier: {_identity.getNullifier().toString().substring(0, 30)}...</Text>
                        <Text>Commitment: {_identity.generateCommitment().toString().substring(0, 30)}...</Text>
                    </VStack>
                </Box>
            ) : (
                <Box py="6">
                    <Button
                        w="100%"
                        fontWeight="bold"
                        justifyContent="left"
                        colorScheme="primary"
                        px="4"
                        onClick={createIdentity}
                        leftIcon={<IconAddCircleFill />}
                    >
                        Create identity
                    </Button>
                </Box>
            )}

            <Divider pt="3" borderColor="gray" />

            <Stepper step={1} onNextClick={!!_identity && onNextClick} />
        </>
    )
}
