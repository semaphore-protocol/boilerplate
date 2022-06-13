//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@semaphore-protocol/contracts/interfaces/IVerifier.sol";
import "@semaphore-protocol/contracts/base/SemaphoreCore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreGroups.sol";

contract Reviews is SemaphoreCore, SemaphoreGroups {
    event ReviewPosted(uint256 indexed groupId, bytes32 signal);

    uint8 public treeDepth;
    IVerifier public verifier;

    constructor(uint8 _treeDepth, IVerifier _verifier) {
        treeDepth = _treeDepth;
        verifier = _verifier;
    }

    function createGroup(uint256 groupId) public {
        _createGroup(groupId, treeDepth, 0);
    }

    function addMember(uint256 groupId, uint256 identityCommitment) public {
        _addMember(groupId, identityCommitment);
    }

    function postReview(
        bytes32 review,
        uint256 nullifierHash,
        uint256 groupId,
        uint256[8] calldata proof
    ) public {
        uint256 root = groups[groupId].root;

        _verifyProof(review, root, nullifierHash, groupId, proof, verifier);

        emit ReviewPosted(groupId, review);
    }
}
