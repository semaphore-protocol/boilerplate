import { Box, Button, Divider, Heading, IconButton, Link, Text, useBoolean, VStack } from "@chakra-ui/react"
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
    onPrevClick: () => void
    onSelect: (e: any) => void
    onLog: (message: string) => void
}

export default function GroupStep({ signer, contract, identity, onPrevClick, onSelect, onLog }: GroupStepProps) {
    const [_loading, setLoading] = useBoolean()
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
        ;(async () => {
            const events = await getEvents()

            if (events.length > 0) {
                setEvents(events)

                onLog(
                    `${events.length} event${
                        events.length > 1 ? "s" : ""
                    } were retrieved from the contract 🤙🏽 Join one or create a new one!`
                )
            }
        })()
    }, [signer, contract])

    useEffect(() => {
        setIdentityCommitment(identity.generateCommitment().toString())
    }, [identity])

    const createEvent = useCallback(async () => {
        if (signer && contract) {
            const eventName = window.prompt("Please enter your event name:")

            if (eventName) {
                setLoading.on()
                onLog(`Creating the '${eventName}' event...`)

                try {
                    const transaction = await contract.createEvent(formatBytes32String(eventName))

                    await transaction.wait()

                    setEvents(await getEvents())

                    onLog(`The '${eventName}' event was just created 🎉`)
                } catch (error) {
                    console.error(error)

                    onLog("Some error occurred, please try again!")
                } finally {
                    setLoading.off()
                }
            }
        }
    }, [signer, contract])

    const joinEvent = useCallback(
        async (event: any) => {
            if (_identityCommitment) {
                const response = window.confirm(
                    `There are ${event.members.length} members in this event. Are you sure you want to join?`
                )

                if (response) {
                    setLoading.on()
                    onLog(`Joining the '${event.eventName}' event...`)

                    const { status } = await fetch("http://localhost:3000/add-member", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            groupId: event.groupId,
                            identityCommitment: _identityCommitment
                        })
                    })

                    if (status === 200) {
                        event.members.push(_identityCommitment)
                        onSelect(event)

                        onLog(`You joined the '${event.eventName}' event 🎉 Post your anonymous reviews!`)
                    } else {
                        onLog("Some error occurred, please try again!")
                    }

                    setLoading.off()
                }
            }
        },
        [_identityCommitment]
    )

    const selectEvent = useCallback((event: any) => {
        onSelect(event)

        onLog(`Post your anonymous reviews in the '${event.eventName}' event 👍🏽`)
    }, [])

    return (
        <>
            <Heading as="h2" size="xl" textAlign="center">
                Semaphore groups
            </Heading>

            <Text fontSize="md">
                Semaphore{" "}
                <Link href="https://semaphore.appliedzkp.org/docs/guides/groups" color="primary.500" isExternal>
                    groups
                </Link>{" "}
                are binary incremental Merkle trees in which each leaf contains an identity commitment for a user.
                Groups can be abstracted to represent events, polls, or organizations.
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
                            _events.map((event) => (
                                <Button
                                    key={event.groupId}
                                    onClick={() =>
                                        event.members.includes(_identityCommitment)
                                            ? selectEvent(event)
                                            : joinEvent(event)
                                    }
                                    isDisabled={_loading}
                                    justifyContent="left"
                                    colorScheme="primary"
                                    fontWeight={event.members.includes(_identityCommitment) ? "bold" : "normal"}
                                    variant="link"
                                >
                                    {event.eventName} ({event.members.length})
                                </Button>
                            ))
                        ) : (
                            <Text>Still no events. Try to refresh!</Text>
                        )}
                    </VStack>
                </Box>
            )}

            <Button colorScheme="primary" variant="outline" isDisabled={_loading} onClick={createEvent}>
                Create event
            </Button>

            <Divider pt="8" borderColor="gray" />

            <Stepper step={2} onPrevClick={onPrevClick} />
        </>
    )
}
