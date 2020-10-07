// Sender.sol

pragma solidity ^0.5.11;

import "./UsingTellor.sol";

contract IStateSender {
  function syncState(address receiver, bytes calldata data) external;
  function register(address sender, address receiver) public;
}

contract Sender is UsingTellor {
    address public stateSenderContract; // Hardcoded
    address public receiver; // Hardcoded

    constructor(address payable _tellorAddress) UsingTellor(_tellorAddress) public {}

    function retrieveDataAndSend(uint256 _requestId, uint256 _timestamp) public {
        uint256 value = retrieveData(_requestId, _timestamp);
        // Check that valid value exists?
        syncState(receiver, abi.encodePacked(_requestId, _timestamp, value));
    }
}
