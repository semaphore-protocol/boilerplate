import Greeter from "artifacts/contracts/Greeter.sol/Greeters.json"
import { Contract, providers } from "ethers"
import type { NextApiRequest, NextApiResponse } from "next"

// This API can represent a backend.
// The contract owner is the only account that can call the `greet` function,
// However they will not be aware of the identity of the users generating the proofs.

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { greeting, nullifierHash, solidityProof } = JSON.parse(req.body)

    const contract = new Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", Greeter.abi)
    const provider = new providers.JsonRpcProvider("http://localhost:8545")

    const contractOwner = contract.connect(provider.getSigner())

    await contractOwner.greet(greeting, nullifierHash, solidityProof)

    res.status(200).end()
}
