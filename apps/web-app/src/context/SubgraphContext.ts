import React from "react"

export type SubgraphContextType = {
    _users: any[]
    _greetings: string[]
    refreshUsers: () => Promise<void>
    addUser: (user: any) => void
    refreshGreetings: () => Promise<void>
    addGreeting: (greeting: string) => void
}

export default React.createContext<SubgraphContextType>({
    _users: [],
    _greetings: [],
    refreshUsers: () => Promise.resolve(),
    addUser: () => {},
    refreshGreetings: () => Promise.resolve(),
    addGreeting: () => {}
})
