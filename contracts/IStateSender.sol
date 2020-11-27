pragma solidity ^0.5.11;
/** 
The sender address from Ethereum and receiver address deployed in Matic must
be registered in Matic's sender contact on Ethereum 
*/
contract IStateSender {
  function syncState(address receiver, bytes calldata data) external;
  function register(address sender, address receiver) public;
}
