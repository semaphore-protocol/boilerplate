import { SemaphoreEthers } from "@semaphore-protocol/data"
import { BigNumber, utils } from "ethers"
import getNextConfig from "next/config"
import { useCallback, useState } from "react"
import { SubgraphContextType } from "../context/SubgraphContext"

const { publicRuntimeConfig: env } = getNextConfig()

export default function useSubgraph(): SubgraphContextType {
    const [_users, setUsers] = useState<any[]>([])
    const [_feedback, setFeedback] = useState<string[]>([])

    const refreshUsers = useCallback(async (): Promise<void> => {
        const semaphore = new SemaphoreEthers(env.ETHEREUM_URL, {
            address: env.SEMAPHORE_CONTRACT_ADDRESS
        })

        const members = await semaphore.getGroupMembers(env.GROUP_ID)

        setUsers(members)
    }, [])

    const addUser = useCallback(
        (user: any) => {
            setUsers([..._users, user])
        },
        [_users]
    )

    const refreshFeedback = useCallback(async (): Promise<void> => {
        const semaphore = new SemaphoreEthers(env.ETHEREUM_URL, {
            address: env.SEMAPHORE_CONTRACT_ADDRESS
        })

        const proofs = await semaphore.getGroupVerifiedProofs(env.GROUP_ID)

        setFeedback(proofs.map(({ signal }: any) => utils.toUtf8String(BigNumber.from(signal).toHexString())))
    }, [])

    const addFeedback = useCallback(
        (feedback: string) => {
            setFeedback([..._feedback, feedback])
        },
        [_feedback]
    )

    return {
        _users,
        _feedback,
        refreshUsers,
        addUser,
        refreshFeedback,
        addFeedback
    }
}
