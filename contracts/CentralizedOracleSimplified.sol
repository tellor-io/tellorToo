// CentralizedOracle2.sol

pragma solidity 0.5.16;

contract IReceiverStorage {
  function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(bool, uint256);
}

contract CentralizedOracle {
  IReceiverStorage public receiverStorage;

  mapping (uint256 => mapping(uint256 => uint256)) public values;
  mapping (uint256 => mapping(uint256 => bool)) public set;
  mapping (uint256 => mapping(uint256 => bool)) public locked;
  mapping (uint256 => Metadata) public metadata;
  uint256 datasetCount;
  address owner;
  address oracle;

  struct Metadata {
    uint256 referenceRequestId;     // ID of corresponding mainnet data
    uint256 timestampWindow;        // Max distance from which a challenge datapoint applies to a centralized datapoint
    uint256 valueWindow;            // Min distance from which a decentralized value knocks out a centralized value
  }


  constructor(address _receiverStorage, address _owner, address _oracle) public {
      receiverStorage = IReceiverStorage(_receiverStorage);
      owner = _owner;
      oracle = _oracle;
      datasetCount=0;
  }

  function newDataset(
      uint256 _referenceRequestId,
      uint256 _timestampWindow,
      uint256 _valueWindow)
      public {
      require(msg.sender == owner);

      metadata[datasetCount] = Metadata({
          referenceRequestId: _referenceRequestId,
          timestampWindow: _timestampWindow,
          valueWindow: _valueWindow
      });

      datasetCount++;
  }

  function submitData(uint256 _requestId, uint256 _timestamp, uint256 _value) public {
      require(msg.sender == oracle);
      require(!locked[_requestId][_timestamp]);

      values[_requestId][_timestamp] = _value;
      set[_requestId][_timestamp] = true;
  }

  function challengeData(uint256 _requestId, uint256 _timestamp, uint256 _challengeTimestamp) public {
      require(set[_requestId][_timestamp]);
      require(_challengeTimestamp - _timestamp <= metadata[_requestId].timestampWindow);

      (bool retrieved, uint256 retrievedValue) = receiverStorage.retrieveData(metadata[_requestId].referenceRequestId, _challengeTimestamp);

  }

}
