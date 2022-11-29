import { log } from "@graphprotocol/graph-ts"
import { NewGreeting, NewUser } from "../generated/Greeter/Greeter"
import { Greeting, User } from "../generated/schema"

/**
 * Creates a new user.
 * @param event Ethereum event emitted when a user is created.
 */
export function createUser(event: NewUser): void {
    log.debug(`NewUser event block: {}`, [event.block.number.toString()])

    const user = new User(event.transaction.from.toHex())

    log.info("Creating user '{}'", [user.id])

    user.identityCommitment = event.params.identityCommitment
    user.username = event.params.username.toString()

    user.save()

    log.info("User '{}' has been created", [user.id])
}

/**
 * Creates a new anonymous greeting.
 * @param event Ethereum event emitted when a user greets anonymously.
 */
export function createGreeting(event: NewGreeting): void {
    log.debug(`NewGreeting event block: {}`, [event.block.number.toString()])

    const greeting = new Greeting(event.transaction.from.toHex())

    log.info("Creating greeting '{}'", [greeting.id])

    greeting.greeting = event.params.greeting

    greeting.save()

    log.info("Greeting '{}' has been created", [greeting.id])
}
