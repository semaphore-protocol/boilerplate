import React from "react"

export type SubgraphContextType = {
    _users: any[]
    _feedback: string[]
    refreshUsers: () => Promise<void>
    addUser: (user: any) => void
    refreshFeedback: () => Promise<void>
    addFeedback: (feedback: string) => void
}

export default React.createContext<SubgraphContextType>({
    _users: [],
    _feedback: [],
    refreshUsers: () => Promise.resolve(),
    addUser: () => {},
    refreshFeedback: () => Promise.resolve(),
    addFeedback: () => {}
})
