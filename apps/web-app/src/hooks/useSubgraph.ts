import { useCallback } from "react"

type ReturnParameters = {
    getUsers: () => Promise<any[]>
    getGreetings: () => Promise<string[]>
}

const url = "https://api.thegraph.com/subgraphs/name/semaphore-protocol/boilerplate"

export default function useSubgraph(): ReturnParameters {
    const getUsers = useCallback(async (): Promise<string[]> => {
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

        return data.users
    }, [])

    const getGreetings = useCallback(async (): Promise<string[]> => {
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

        return data.greetings.map(({ greeting }: any) => greeting)
    }, [])

    return {
        getUsers,
        getGreetings
    }
}
