import { Button, ChakraProvider, Divider, HStack, Text, VStack } from "@chakra-ui/react"
import detectEthereumProvider from "@metamask/detect-provider"
import { Contract, providers, Signer } from "ethers"
import { useEffect, useState } from "react"
import { createRoot } from "react-dom/client"
import Events from "../../contracts/build/contracts/contracts/Events.sol/Events.json"
import theme from "../styles"
import GroupStep from "./components/GroupStep"
import IdentityStep from "./components/IdentityStep"

function App() {
    const [_signer, setSigner] = useState<Signer>()
    const [_contract, setContract] = useState<Contract>()
    const [_step, setStep] = useState<number>(1)

    useEffect(() => {
        ;(async () => {
            const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
            const ethereum = (await detectEthereumProvider()) as any
            const accounts = await ethereum.request({ method: "eth_requestAccounts" })

            const ethersProvider = new providers.Web3Provider(ethereum)

            if (accounts[0]) {
                setSigner(ethersProvider.getSigner())

                setContract(new Contract(contractAddress, Events.abi, ethersProvider.getSigner()))
            }

            ethereum.on("accountsChanged", (newAccounts: string[]) => {
                if (newAccounts.length !== 0) {
                    setSigner(ethersProvider.getSigner())

                    setContract(new Contract(contractAddress, Events.abi, ethersProvider.getSigner()))
                } else {
                    setSigner(undefined)
                }
            })
        })()
    }, [])

    useEffect(() => {
        const identity = localStorage.getItem("identity")

        if (!identity) {
            setStep(1)
        } else {
            setStep(2)
        }
    }, [])

    return (
        <>
            <VStack>
                <VStack pb="8" width="600px">
                    {_step === 1 ? <IdentityStep /> : <GroupStep signer={_signer} contract={_contract} />}
                </VStack>

                <Divider borderColor="gray" />

                <HStack width="100%" justify="space-between" pt="8">
                    <Button colorScheme="primary" variant="link" onClick={() => setStep((v) => v - 1)}>
                        Prev
                    </Button>

                    <Text fontWeight="bold">{_step}</Text>

                    <Button colorScheme="primary" variant="link" onClick={() => setStep((v) => v + 1)}>
                        Next
                    </Button>
                </HStack>
            </VStack>
        </>
    )
}

const root = createRoot(document.getElementById("app")!)

root.render(
    <ChakraProvider theme={theme}>
        <App />
    </ChakraProvider>
)
