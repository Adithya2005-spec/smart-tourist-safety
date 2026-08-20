// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title SafetyAudit
/// @notice Minimal EVM-compatible integrity contract for the prototype.
/// @dev Stores only hashes and verification metadata. Never submit private identity or location data.
contract SafetyAudit {
    address public immutable operator;

    struct IdentityCommitment {
        bytes32 identityHash;
        uint64 registeredAt;
        bool verified;
    }

    struct IncidentCommitment {
        bytes32 dataHash;
        uint64 recordedAt;
        bool verified;
    }

    mapping(string => IdentityCommitment) private identities;
    mapping(string => IncidentCommitment) private incidents;

    event IdentityRegistered(string indexed identityId, bytes32 indexed identityHash, uint64 timestamp);
    event IncidentRecorded(string indexed incidentId, bytes32 indexed dataHash, uint64 timestamp);

    modifier onlyOperator() {
        require(msg.sender == operator, "operator only");
        _;
    }

    constructor() {
        operator = msg.sender;
    }

    function registerIdentity(string calldata identityId, bytes32 identityHash) external onlyOperator {
        require(bytes(identityId).length > 0, "identity ID required");
        require(identityHash != bytes32(0), "identity hash required");
        identities[identityId] = IdentityCommitment(identityHash, uint64(block.timestamp), true);
        emit IdentityRegistered(identityId, identityHash, uint64(block.timestamp));
    }

    function verifyIdentity(string calldata identityId, bytes32 expectedHash) external view returns (bool) {
        IdentityCommitment memory commitment = identities[identityId];
        return commitment.verified && commitment.identityHash == expectedHash;
    }

    function recordIncident(string calldata incidentId, bytes32 dataHash) external onlyOperator {
        require(bytes(incidentId).length > 0, "incident ID required");
        require(dataHash != bytes32(0), "data hash required");
        incidents[incidentId] = IncidentCommitment(dataHash, uint64(block.timestamp), true);
        emit IncidentRecorded(incidentId, dataHash, uint64(block.timestamp));
    }

    function verifyIncident(string calldata incidentId, bytes32 expectedHash) external view returns (bool) {
        IncidentCommitment memory commitment = incidents[incidentId];
        return commitment.verified && commitment.dataHash == expectedHash;
    }
}
