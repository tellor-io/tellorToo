// Sender.sol

pragma solidity ^0.5.11;

import "./UsingTellor.sol";

contract IStateSender {
  function syncState(address receiver, bytes calldata data) external;
  function register(address sender, address receiver) public;
}

contract Sender is UsingTellor {
    IStateSender public stateSender; // Hardcoded
    address public receiver; // Hardcoded

    constructor(address payable _tellorAddress, address _stateSender) UsingTellor(_tellorAddress) public {
      stateSender = IStateSender(_stateSender);
    }

    function retrieveDataAndSend(uint256 _requestId, uint256 _timestamp) public {
        uint256 value = retrieveData(_requestId, _timestamp);
        require(value > 0);
        stateSender.syncState(receiver, abi.encode(_requestId, _timestamp, value));
    }

    function getCurrentValueAndSend(uint256 _requestId) public {
      (uint256 ifRetrieve, uint256 value, uint256 timestamp) = getCurrentValue(_requestId);
      require(ifRetrieve);
      stateSender.syncState(receiver, abi.encode(_requestId, timestamp, value));
    }
}
