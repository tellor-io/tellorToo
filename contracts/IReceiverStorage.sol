pragma solidity 0.5.16;

contract IReceiverStorage {
  function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(bool, uint256, address payable);
  function retrieveLatestValue(uint256 _requestId) public view returns(uint256, uint256, address payable);
}
