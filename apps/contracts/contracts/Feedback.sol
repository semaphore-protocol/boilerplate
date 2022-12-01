//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Feedback {
    error Feedback__UsernameAlreadyExists();

    event NewFeedback(string feedback);
    event NewUser(uint256 identityCommitment, bytes32 username);

    ISemaphore public semaphore;

    uint256 public groupId;
    mapping(uint256 => bytes32) public users;

    constructor(address semaphoreAddress, uint256 _groupId) {
        semaphore = ISemaphore(semaphoreAddress);
        groupId = _groupId;

        semaphore.createGroup(groupId, 20, 0, address(this));
    }

    function joinGroup(uint256 identityCommitment, bytes32 username) external {
        if (users[identityCommitment] != 0) {
            revert Feedback__UsernameAlreadyExists();
        }

        semaphore.addMember(groupId, identityCommitment);

        users[identityCommitment] = username;

        emit NewUser(identityCommitment, username);
    }

    function sendFeedback(
        string calldata feedback,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(
            groupId,
            merkleTreeRoot,
            keccak256(abi.encodePacked(feedback)),
            nullifierHash,
            groupId,
            proof
        );

        emit NewFeedback(feedback);
    }
}
