import { Box, Button, Divider, Heading, Text, VStack } from "@chakra-ui/react"
import { Contract, Signer } from "ethers"
import Stepper from "./Stepper"

export type ProofStepProps = {
    signer?: Signer
    contract?: Contract
    event: any
    onPrevClick?: () => void
}

export default function ProofStep({ event, onPrevClick }: ProofStepProps) {
    return (
        <>
            <Heading as="h2" size="xl" textAlign="center">
                Semaphore proof
            </Heading>

            <Text fontSize="md">
                Semaphore group members can anonymously prove that they are part of a group and that they are generating
                their own proofs and signals.
            </Text>

            <Box w="100%" py="6">
                <VStack spacing="3" alignItems="start" p="5" border="1px solid gray" borderRadius="4px">
                    <Text>Event name: {event.eventName}</Text>
                    <Text>Number of members: {event.members.length}</Text>
                </VStack>
            </Box>

            <Button colorScheme="primary" variant="outline">
                Generate proof
            </Button>

            <Divider pt="8" borderColor="gray" />

            <Stepper step={3} onPrevClick={onPrevClick} />
        </>
    )
}
