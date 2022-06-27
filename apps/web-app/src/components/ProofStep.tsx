import { Box, Button, Divider, Heading, IconButton, Text, VStack } from "@chakra-ui/react"
import { Group } from "@semaphore-protocol/group"
import { Identity } from "@semaphore-protocol/identity"
import { generateProof, packToSolidityProof } from "@semaphore-protocol/proof"
import { Contract, Signer } from "ethers"
import { parseBytes32String } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"
import { MdOutlineRefresh } from "react-icons/md"
import Stepper from "./Stepper"

export type ProofStepProps = {
    signer?: Signer
    contract?: Contract
    identity: Identity
    event: any
    onPrevClick?: () => void
}

export default function ProofStep({ signer, contract, event, identity, onPrevClick }: ProofStepProps) {
    const [_reviews, setReviews] = useState<any[]>([])

    const getReviews = useCallback(async () => {
        if (!signer || !contract) {
            return []
        }

        const reviews = await contract.queryFilter(contract.filters.ReviewPosted(event.groupId))

        return reviews.map((r) => parseBytes32String(r.args![1]))
    }, [signer, contract, event])

    useEffect(() => {
        getReviews().then(setReviews)
    }, [signer, contract, event])

    const postReview = useCallback(async () => {
        if (contract && identity) {
            const review = prompt("Please enter your review name:")

            if (review) {
                const members = await contract.queryFilter(contract.filters.MemberAdded(event.groupId))
                const group = new Group()

                group.addMembers(members.map((m) => m.args![1].toString()))

                const { proof, publicSignals } = await generateProof(
                    identity,
                    group,
                    event.groupId.toString(),
                    review,
                    {
                        wasmFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.wasm",
                        zkeyFilePath: "https://www.trusted-setup-pse.org/semaphore/20/semaphore.zkey"
                    }
                )
                const solidityProof = packToSolidityProof(proof)

                const response = await fetch("http://localhost:3000/post-review", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        review,
                        nullifierHash: publicSignals.nullifierHash,
                        groupId: event.groupId.toString(),
                        solidityProof
                    })
                })

                if (response.status === 200) {
                    setReviews((v) => [...v, review])
                }
            }
        }
    }, [contract, identity])

    return (
        <>
            <Heading as="h2" size="xl" textAlign="center">
                Semaphore proof
            </Heading>

            <Text fontSize="md">
                Semaphore group members can anonymously prove that they are part of a group and that they are generating
                their own proofs and signals.
            </Text>

            <Box w="100%" py="6" position="relative">
                <IconButton
                    colorScheme="primary"
                    variant="link"
                    onClick={() => getReviews().then(setReviews)}
                    position="absolute"
                    right="0"
                    top="35px"
                    aria-label="Refresh reviews"
                    icon={<MdOutlineRefresh />}
                />

                <VStack spacing="3" alignItems="start" p="5" border="1px solid gray" borderRadius="4px">
                    <Text>Event name: {event.eventName}</Text>
                    <Text>Number of members: {event.members.length}</Text>

                    <Text>Signals:</Text>
                    {_reviews.length > 0 ? (
                        _reviews.map((r, i) => (
                            <Text key={i} pl="10px" fontWeight="bold">
                                &#8226; {r}
                            </Text>
                        ))
                    ) : (
                        <Text>Still no reviews. Try to refresh!</Text>
                    )}
                </VStack>
            </Box>

            <Button colorScheme="primary" variant="outline" onClick={postReview}>
                Post review
            </Button>

            <Divider pt="8" borderColor="gray" />

            <Stepper step={3} onPrevClick={onPrevClick} />
        </>
    )
}
