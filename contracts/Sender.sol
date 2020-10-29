// Sender.sol

pragma solidity ^0.5.11;

import "./UsingTellor.sol";

/** 
The sender address from Ethereum and receiver address deployed in Matic must
be registered in Matic's sender contact on Ethereum for 
*/
contract IStateSender {
  function syncState(address receiver, bytes calldata data) external;
  function register(address sender, address receiver) public;
}

contract MockSender {
  event StateSynced(bytes data);

  struct Data{
    address receiver;
    bytes data;
  }
  mapping (uint => Data) idToData;
  uint256 public ids;
  

  function  syncState(address _receiver, bytes calldata _data) external returns(uint){
    emit StateSynced(_data);
    ids++;
    idToData[ids] = Data({
      receiver:_receiver,
      data:_data
    });
    return ids;
  }

  function getDataFromId(uint _id) external view returns(address, bytes memory){
    return (idToData[_id].receiver,idToData[_id].data);
  }

}

/**
@title Sender
This contract helps send Tellor's data on Ethereum to Matic's Network
*/
contract Sender is UsingTellor {
    IStateSender public stateSender;
    event DataSent(uint _requestId, uint _timestamp, uint _value, address _sender);    
    address public receiver;

    /**
    @dev
    @param _tellorAddress is the tellor master address
    @param _stateSender is the Matic's state sender address --- they need to add the sender and receiver address
    @param _receiver is the contract receiver address in Matic ??? 
    */
    constructor(address payable _tellorAddress, address _stateSender, address _receiver) UsingTellor(_tellorAddress) public {
      stateSender = IStateSender(_stateSender);
      receiver = _receiver;
    }

    /**
    @dev This function gets the value for the specified request Id and timestamp from UsingTellor
    @param _requestId is Tellor's requestId to retreive
    @param _timestamp is Tellor's requestId timestamp to retreive
    */
    function retrieveDataAndSend(uint256 _requestId, uint256 _timestamp) public {
        uint256 value = retrieveData(_requestId, _timestamp);
        require(value > 0);
        stateSender.syncState(receiver, abi.encode(_requestId, _timestamp, value, msg.sender));
        emit DataSent(_requestId, _timestamp, value, msg.sender);
    }

    /**
    @dev This function gets the current value for the specified request Id from UsingTellor
    @param _requestId is Tellor's requestId to retreive the latest curent value for it
    */
    function getCurrentValueAndSend(uint256 _requestId) public {
      (bool ifRetrieve, uint256 value, uint256 timestamp) = getCurrentValue(_requestId);
      require(ifRetrieve);
      stateSender.syncState(receiver, abi.encode(_requestId, timestamp, value, msg.sender));
      emit DataSent(_requestId, timestamp, value, msg.sender);
    }
}
