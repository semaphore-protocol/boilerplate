import { Box, Button, Heading, Text } from "@chakra-ui/react"
import { Contract, Signer } from "ethers"
import { formatBytes32String, parseBytes32String } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"

export type GroupStepProps = {
    onSuccess?: (message?: string) => void
    signer?: Signer
    contract?: Contract
}

export default function GroupStep({ onSuccess, signer, contract }: GroupStepProps) {
    const [_events, setEvents] = useState<any[]>([])

    useEffect(() => {
        ;(async () => {
            if (signer && contract) {
                const filter = contract.filters.EventCreated()
                const events = await contract.queryFilter(filter)

                if (events) {
                    setEvents(events.map((e) => e.args))
                }
            }
        })()
    }, [signer])

    const createGroup = useCallback(async () => {
        if (signer && contract) {
            const eventName = prompt("Please enter your event name:")

            if (eventName) {
                await contract.createEvent(formatBytes32String(eventName))

                if (onSuccess) {
                    onSuccess()
                }
            }
        }
    }, [signer, contract])

    return (
        <>
            <Heading as="h2" size="xl">
                Semaphore group
            </Heading>
            <Text fontSize="md">
                Semaphore groups are binary incremental Merkle trees that store the public identity commitment of each
                member.
            </Text>

            {_events && (
                <Box>
                    {_events.map((e, i) => (
                        <Button key={i} colorScheme="primary" variant="link">
                            {parseBytes32String(e[1])}
                        </Button>
                    ))}
                </Box>
            )}

            <Button colorScheme="primary" variant="outline" onClick={createGroup}>
                Create group
            </Button>
        </>
    )
}
