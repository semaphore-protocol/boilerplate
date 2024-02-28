"use client"

import { Box, Button, Divider, Heading, HStack, Link, Text } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/core"
import { useRouter } from "next/navigation"
import { useCallback, useContext, useEffect, useState } from "react"
import Stepper from "../components/Stepper"
import LogsContext from "../context/LogsContext"
import shortenString from "../utils/shortenString"

export default function IdentitiesPage() {
    const router = useRouter()
    const { setLogs } = useContext(LogsContext)
    const [_identity, setIdentity] = useState<Identity>()

    useEffect(() => {
        const privateKey = localStorage.getItem("identity")

        if (privateKey) {
            const identity = new Identity(privateKey)

            setIdentity(identity)

            setLogs("Your Semaphore identity has been retrieved from the browser cache 👌🏽")
        } else {
            setLogs("Create your Semaphore identity 👆🏽")
        }
    }, [])

    const createIdentity = useCallback(async () => {
        const identity = new Identity()

        setIdentity(identity)

        localStorage.setItem("identity", identity.privateKey.toString())

        setLogs("Your new Semaphore identity has just been created 🎉")
    }, [])

    return (
        <>
            <Heading as="h2" size="xl">
                Identities
            </Heading>

            <Text pt="2" fontSize="md">
                The identity of a user in the Semaphore protocol. A{" "}
                <Link href="https://docs.semaphore.pse.dev/guides/identities" isExternal>
                    Semaphore identity
                </Link>{" "}
                consists of an{" "}
                <Link
                    href="https://github.com/privacy-scaling-explorations/zk-kit/tree/main/packages/eddsa-poseidon"
                    isExternal
                >
                    EdDSA
                </Link>{" "}
                public/private key pair and a commitment, used as the public identifier of the identity.
            </Text>

            <Divider pt="5" borderColor="gray.500" />

            <HStack py="5">
                <Text fontWeight="bold" fontSize="lg">
                    Identity
                </Text>
            </HStack>

            {_identity && (
                <Box pb="6" whiteSpace="nowrap">
                    <Text textOverflow="ellipsis" overflow="hidden">
                        Private Key: {_identity.privateKey.toString()}
                    </Text>
                    <Text textOverflow="ellipsis" overflow="hidden">
                        Public Key: [{shortenString(_identity.publicKey[0], [8, 8])},{" "}
                        {shortenString(_identity.publicKey[1], [8, 8])}]
                    </Text>
                    <Text textOverflow="ellipsis" overflow="hidden">
                        Commitment: <b>{_identity.commitment}</b>
                    </Text>
                </Box>
            )}

            <Box pb="5">
                <Button w="full" colorScheme="primary" onClick={createIdentity}>
                    Create identity
                </Button>
            </Box>

            <Divider pt="3" borderColor="gray.500" />

            <Stepper step={1} onNextClick={_identity && (() => router.push("/group"))} />
        </>
    )
}
