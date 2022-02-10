//SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.4;

import "@appliedzkp/semaphore-contracts/base/SemaphoreCore.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Greeters is SemaphoreCore, Ownable {
    event NewGreeting(string greeting);

    uint256 public greeters;

    constructor(uint256 _greeters) {
        greeters = _greeters;
    }

    function greet(
        string calldata _greeting,
        uint256 _nullifierHash,
        uint256[8] calldata _proof
    ) external onlyOwner {
        require(
            _isValidProof(_greeting, greeters, _nullifierHash, greeters, _proof),
            "Greeters: the proof is not valid"
        );

        // Prevent double-greeting (nullifierHash = hash(root + identityNullifier)).
        _saveNullifierHash(_nullifierHash);

        emit NewGreeting(_greeting);
    }
}
