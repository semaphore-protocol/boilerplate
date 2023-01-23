import { ByteArray, log } from "@graphprotocol/graph-ts"
import { NewFeedback, NewUser } from "../generated/Feedback/Feedback"
import { Feedback, User } from "../generated/schema"
import { concat, hash } from "./utils"

/**
 * Creates a new user.
 * @param event Ethereum event emitted when a user is created.
 */
export function createUser(event: NewUser): void {
    log.debug(`NewUser event block: {}`, [event.block.number.toString()])

    const userId = hash(concat(ByteArray.fromBigInt(event.logIndex), event.transaction.hash))
    const user = new User(userId)

    log.info("Creating user '{}'", [user.id])

    user.identityCommitment = event.params.identityCommitment
    user.username = event.params.username.toString()

    user.save()

    log.info("User '{}' has been created", [user.id])
}

/**
 * Creates a new anonymous feedback.
 * @param event Ethereum event emitted when a user sends a feedback anonymously.
 */
export function createFeedback(event: NewFeedback): void {
    log.debug(`NewFeedback event block: {}`, [event.block.number.toString()])

    const feedbackId = hash(concat(ByteArray.fromBigInt(event.logIndex), event.transaction.hash))
    const feedback = new Feedback(feedbackId)

    log.info("Creating feedback '{}'", [feedback.id])

    feedback.feedback = event.params.feedback.toString()

    feedback.save()

    log.info("Feedback '{}' has been created", [feedback.id])
}
