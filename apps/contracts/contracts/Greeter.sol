//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";

contract Greeter {
    event NewGreeting(bytes32 greeting);
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
        semaphore.addMember(groupId, identityCommitment);

        users[identityCommitment] = username;

        emit NewUser(identityCommitment, username);
    }

    function greet(
        bytes32 greeting,
        uint256 merkleTreeRoot,
        uint256 nullifierHash,
        uint256[8] calldata proof
    ) external {
        semaphore.verifyProof(groupId, merkleTreeRoot, greeting, nullifierHash, groupId, proof);

        emit NewGreeting(greeting);
    }
}
