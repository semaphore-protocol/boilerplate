import { Box, Button, Divider, Heading, IconButton, Text, VStack } from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
import { Contract, Signer } from "ethers"
import { formatBytes32String, parseBytes32String } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { MdOutlineRefresh } from "react-icons/md"
import Stepper from "./Stepper"

export type GroupStepProps = {
    signer?: Signer
    contract?: Contract
    identity: Identity
    onPrevClick?: () => void
    onSelect: (e: any) => void
}

export default function GroupStep({ signer, contract, identity, onPrevClick, onSelect }: GroupStepProps) {
    const [_events, setEvents] = useState<any[]>([])
    const [_identityCommitment, setIdentityCommitment] = useState<string>()

    const getEvents = useCallback(async () => {
        if (!signer || !contract) {
            return []
        }

        const events = await contract.queryFilter(contract.filters.EventCreated())
        const members = await contract.queryFilter(contract.filters.MemberAdded())

        return events.map((e) => ({
            groupId: e.args![0],
            eventName: parseBytes32String(e.args![1]),
            members: members.filter((m) => m.args![0].eq(e.args![0])).map((m) => m.args![1].toString())
        }))
    }, [signer, contract])

    useEffect(() => {
        getEvents().then(setEvents)
    }, [signer, contract])

    useEffect(() => {
        setIdentityCommitment(identity.generateCommitment().toString())
    }, [identity])

    const createEvent = useCallback(async () => {
        if (signer && contract) {
            const eventName = prompt("Please enter your event name:")

            if (eventName) {
                const transaction = await contract.createEvent(formatBytes32String(eventName))

                await transaction.wait()

                getEvents().then(setEvents)
            }
        }
    }, [signer, contract])

    const joinEvent = useCallback(
        async (groupId: string) => {
            if (signer && contract && _identityCommitment) {
                const transaction = await contract.addMember(groupId, _identityCommitment)

                await transaction.wait()
            }
        },
        [signer, contract, _identityCommitment]
    )

    return (
        <>
            <Heading as="h2" size="xl" textAlign="center">
                Semaphore group
            </Heading>

            <Text fontSize="md">
                Semaphore groups are binary incremental Merkle trees that store the public identity commitment of each
                member.
            </Text>

            {_events && (
                <Box w="100%" py="6" position="relative">
                    <IconButton
                        colorScheme="primary"
                        variant="link"
                        onClick={() => getEvents().then(setEvents)}
                        position="absolute"
                        right="0"
                        top="35px"
                        aria-label="Refresh groups"
                        icon={<MdOutlineRefresh />}
                    />

                    <VStack spacing="3" alignItems="start" p="5" border="1px solid gray" borderRadius="4px">
                        {_events.length > 0 ? (
                            _events.map((e) => (
                                <Button
                                    key={e.groupId}
                                    onClick={() =>
                                        e.members.includes(_identityCommitment) ? onSelect(e) : joinEvent(e.groupId)
                                    }
                                    justifyContent="left"
                                    colorScheme="primary"
                                    fontWeight={e.members.includes(_identityCommitment) ? "bold" : "normal"}
                                    variant="link"
                                >
                                    {e.eventName} ({e.members.length})
                                </Button>
                            ))
                        ) : (
                            <Text>Still no groups. Try to refresh!</Text>
                        )}
                    </VStack>
                </Box>
            )}

            <Button colorScheme="primary" variant="outline" onClick={createEvent}>
                Create event
            </Button>

            <Divider pt="8" borderColor="gray" />

            <Stepper step={2} onPrevClick={onPrevClick} />
        </>
    )
}
