import {
    Button,
    Container,
    Divider,
    Heading,
    HStack,
    Image,
    List,
    ListItem,
    Text,
    Tooltip,
    useClipboard,
    VStack
} from "@chakra-ui/react"
import { Identity } from "@semaphore-protocol/identity"
//import { generateProof } from "@semaphore-protocol/proof"
import detectEthereumProvider from "@metamask/detect-provider"
import { BigNumber, Contract, providers, Signer, utils } from "ethers"
import { getAddress } from "ethers/lib/utils"
import { useCallback, useEffect, useState } from "react"
import Events from "../contracts/build/contracts/contracts/Events.sol/Events.json"

const SNARK_SCALAR_FIELD = BigNumber.from(
    "21888242871839275222246405745257275088548364400416034343698204186575808495617"
)

export default function App() {
    const [logs, setLogs] = useState<[string, string]>()
    const [account, setAccount] = useState<string>()
    const { hasCopied, onCopy } = useClipboard(account || "")
    const [signer, setSigner] = useState<Signer>()
    const [contract, setContract] = useState<Contract>()
    const [groups, setGroups] = useState<string[]>([])

    useEffect(() => {
        ;(async () => {
            const ethereumProvider = (await detectEthereumProvider()) as any
            const accounts = await ethereumProvider.request({ method: "eth_accounts" })
            const ethersProvider = new providers.Web3Provider(ethereumProvider)

            if (accounts[0]) {
                setAccount(getAddress(accounts[0]))
                setSigner(ethersProvider.getSigner())
            }

            ethereumProvider.on("accountsChanged", (newAccounts: string[]) => {
                if (newAccounts.length !== 0) {
                    setAccount(getAddress(newAccounts[0]))
                    setSigner(ethersProvider.getSigner())
                } else {
                    setAccount(undefined)
                    setSigner(undefined)
                }
            })
        })()
    }, [])

    useEffect(() => {
        ;(async () => {
            if (signer) {
                const contractAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
                const contract = new Contract(contractAddress, Events.abi, signer)

                setContract(contract)

                const filter = contract.filters["EventCreated"]()
                const events = await contract.queryFilter(filter)

                //const [name, proposals] = events[0].args as any

                console.log(events)

                //setBallotName(name)
                //setBallotProposals(proposals.map(parseBytes32String))
            }
        })()
    }, [signer])

    const connect = useCallback(async () => {
        const ethereumProvider = (await detectEthereumProvider()) as any

        // TODO: Update network automatically.
        await ethereumProvider.request({ method: "eth_requestAccounts" })

        const ethersProvider = new providers.Web3Provider(ethereumProvider)
        const signer = ethersProvider.getSigner()

        setSigner(signer)
        setAccount(await signer.getAddress())
    }, [])

    const createGroup = useCallback(async () => {
        if (signer && contract) {
            const groupName = prompt("Please enter your group name")

            if (groupName) {
                const groupId = utils.formatBytes32String(groupName)

                const a = BigNumber.from(groupId).mod(SNARK_SCALAR_FIELD)

                console.log(a)

                await contract.createGroup(a)
            }
        }
    }, [signer, contract])

    const postReview = useCallback(async () => {
        if (signer) {
            try {
                setLogs(["white", "Creating your Semaphore identity..."])

                const message = await signer.signMessage("Sign this message to generate your Semaphore identity")

                const identity = new Identity(message)

                setLogs(["white", "Creating your Semaphore proof..."])

                //const { publicSignals, solidityProof } = await generateProof(
                //identity,

                //BigInt(ballotName),
                //ballotProposal,
                //{ wasmFilePath: "./semaphore.wasm", zkeyFilePath: "./semaphore_final.zkey" }
                //)

                //// Backend API

                //const response = await fetch("/api/vote", {
                //method: "POST",
                //body: JSON.stringify({
                //ballotProposal,
                //nullifierHash: publicSignals.nullifierHash,
                //solidityProof: solidityProof
                //})
                //})

                //if (response.status === 500) {
                //const errorMessage = await response.text()

                //setLogs(["red", errorMessage])
                //} else {
                //setLogs(["green", "You just voted anonymously"])
                //}
            } catch (error: any) {
                setLogs(["red", error.message])
            }
        }
    }, [signer])

    function shortenAddress(address: string, chars = 4): string {
        address = utils.getAddress(address)

        return `${address.substring(0, chars + 2)}...${address.substring(42 - chars)}`
    }

    return (
        <>
            <Container maxW="container.lg">
                <HStack justify="space-between" mt="10">
                    <Image
                        src="https://raw.githubusercontent.com/semaphore-protocol/website/main/static/img/semaphore-icon.svg"
                        alt="Semaphore icon"
                        h={10}
                    />

                    {!account ? (
                        <Button colorScheme="primary" onClick={connect}>
                            Connect Wallet
                        </Button>
                    ) : (
                        <Tooltip label={hasCopied ? "Copied!" : "Copy"} closeOnClick={false} hasArrow>
                            <Button onClick={onCopy} onMouseDown={(e) => e.preventDefault()}>
                                {shortenAddress(account)}
                            </Button>
                        </Tooltip>
                    )}
                </HStack>
            </Container>

            <Container maxW="container.md">
                <VStack mt="150px" mb="8">
                    <Heading as="h2" size="xl" mb="2">
                        Events
                    </Heading>

                    <Text color="background.400" fontSize="md">
                        Create new events or post an anonymous review in an existing one.
                    </Text>
                </VStack>

                <Divider />

                {!account ? (
                    <Text textAlign="center" color="background.400" fontSize="lg" pt="100px">
                        You need to connect your wallet!
                    </Text>
                ) : (
                    <VStack spacing="6" align="left" mt="8" px="40">
                        <List spacing={3}>
                            {groups.map((group) => (
                                <ListItem key={group}>
                                    <Button colorScheme="secondary">{group}</Button>
                                </ListItem>
                            ))}
                        </List>

                        <Button colorScheme="primary" onClick={createGroup}>
                            Create group
                        </Button>
                    </VStack>
                )}
            </Container>

            {logs && (
                <Text mt="20" color={`${logs[0]}.400`} fontSize="xl">
                    {logs[1]}
                </Text>
            )}
        </>
    )
}
