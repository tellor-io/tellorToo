// Receiver.sol

pragma solidity 0.5.16;

// IStateReceiver represents interface to receive state
interface IStateReceiver {
  function onStateReceive(uint256 stateId, bytes calldata data) external;
}

contract ReceiverStorage {
  mapping(uint256 => mapping(uint256 => uint256)) public values;
  mapping(uint256 => mapping(uint256 => bool)) public set;

  function onStateReceive(uint256 stateId, bytes calldata data) external {
    // Check for valid caller
    // Decode bytes data
    // Save to values datastore
    // Change 'set' bool
  }

  function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(bool, uint256) {
    return(set[_requestId][_timestamp], values[_requestId][_timestamp]);
  }
}
