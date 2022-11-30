import { useCallback, useState } from "react"
import { SubgraphContextType } from "../context/SubgraphContext"

const url = "https://api.thegraph.com/subgraphs/name/semaphore-protocol/boilerplate"

export default function useSubgraph(): SubgraphContextType {
    const [_users, setUsers] = useState<any[]>([])
    const [_greetings, setGreetings] = useState<string[]>([])

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

    const refreshGreetings = useCallback(async (): Promise<void> => {
        const response = await fetch(url, {
            method: "POST",
            body: JSON.stringify({
                query: `{ greetings { greeting } }`
            }),
            headers: {
                "content-type": "application/json"
            }
        })

        const { data } = await response.json()

        setGreetings(data.greetings.map(({ greeting }: any) => greeting))
    }, [])

    const addGreeting = useCallback(
        (greeting: string) => {
            setGreetings([..._greetings, greeting])
        },
        [_greetings]
    )

    return {
        _users,
        _greetings,
        refreshUsers,
        addUser,
        refreshGreetings,
        addGreeting
    }
}
