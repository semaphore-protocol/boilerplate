import { Box, Button, HStack, Text } from "@chakra-ui/react"
import IconChevronLeft from "../icons/IconChevronLeft"
import IconChevronRight from "../icons/IconChevronRight"

export type StepperProps = {
    step: number
    onPrevClick?: () => void
    onNextClick?: () => void
}

export default function Stepper({ step, onPrevClick, onNextClick }: StepperProps) {
    return (
        <HStack width="100%" justify="space-between" pt="6">
            {onPrevClick !== undefined ? (
                <Button
                    flex="1"
                    leftIcon={<IconChevronLeft />}
                    justifyContent="left"
                    colorScheme="primary"
                    variant="link"
                    disabled={!onPrevClick}
                    onClick={onPrevClick || undefined}
                >
                    Prev
                </Button>
            ) : (
                <Box flex="1" />
            )}

            <Text textAlign="center" flex="1" fontWeight="bold">
                {step.toString()}/3
            </Text>

            {onNextClick !== undefined ? (
                <Button
                    flex="1"
                    rightIcon={<IconChevronRight />}
                    justifyContent="right"
                    colorScheme="primary"
                    variant="link"
                    disabled={!onNextClick}
                    onClick={onNextClick || undefined}
                >
                    Next
                </Button>
            ) : (
                <Box flex="1" />
            )}
        </HStack>
    )
}
