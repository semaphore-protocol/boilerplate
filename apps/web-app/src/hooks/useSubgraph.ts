import { useCallback, useState } from "react"
import { SubgraphContextType } from "../context/SubgraphContext"

const url = "https://api.thegraph.com/subgraphs/name/semaphore-protocol/boilerplate"

export default function useSubgraph(): SubgraphContextType {
    const [_users, setUsers] = useState<any[]>([])
    const [_feedback, setFeedback] = useState<string[]>([])

    const refreshUsers = useCallback(async (): Promise<void> => {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                query: `{ users { username identityCommitment } }`
            }),
            headers: {
                "content-type": "application/json"
            }
        })

        const { data } = await response.json()

        setUsers(data.users)
    }, [])

    const addUser = useCallback(
        (user: any) => {
            setUsers([..._users, user])
        },
        [_users]
    )

    const refreshFeedback = useCallback(async (): Promise<void> => {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                query: `{ feedbacks { feedback } }`
            }),
            headers: {
                "content-type": "application/json"
            }
        })

        const { data } = await response.json()

        setFeedback(data.feedbacks.map(({ feedback }: any) => feedback))
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
