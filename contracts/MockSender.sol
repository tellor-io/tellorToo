pragma solidity ^0.5.11;

/*This is a Mock Sender contract to mimic the Matic validator functions*/
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
