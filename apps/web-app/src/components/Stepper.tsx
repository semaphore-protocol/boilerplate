import { Box, Button, HStack, Text } from "@chakra-ui/react"
import { MdChevronLeft, MdChevronRight } from "react-icons/md"

export type StepperProps = {
    step: number
    onPrevClick?: () => void
    onNextClick?: () => void
}

export default function ProofStep({ step, onPrevClick, onNextClick }: StepperProps) {
    return (
        <HStack width="100%" justify="space-between" pt="6">
            {onPrevClick ? (
                <Button
                    flex="1"
                    leftIcon={<MdChevronLeft />}
                    justifyContent="left"
                    colorScheme="primary"
                    variant="link"
                    onClick={onPrevClick}
                >
                    Prev
                </Button>
            ) : (
                <Box flex="1" />
            )}

            <Text textAlign="center" flex="1" fontWeight="bold">
                {step.toString()}
            </Text>

            {onNextClick ? (
                <Button
                    flex="1"
                    rightIcon={<MdChevronRight />}
                    justifyContent="right"
                    colorScheme="primary"
                    variant="link"
                    onClick={onNextClick}
                >
                    Next
                </Button>
            ) : (
                <Box flex="1" />
            )}
        </HStack>
    )
}
