// CentralizedOracle.sol

pragma solidity 0.5.16;

contract IReceiverStorage {
    function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(bool, uint256);
}

contract IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
}

contract CentralizedOracle {
  IReceiverStorage public receiverStorage;

  mapping (uint256 => mapping(uint256 => uint256)) public values;
  mapping (uint256 => mapping(uint256 => bool)) public set;
  mapping (uint256 => mapping(uint256 => bool)) public disputed;
  mapping (uint256 => Metadata) public metadata;
  Challenge[] public challenges;
  uint256 datasetCount;

  struct Metadata {
    uint256 requestId;
    uint256 timestampWindow;
    uint256 valueWindow;
    address token;
    uint256 minDeposit;
    uint256 slashAmount;
    address oracle;
    uint256 disputeDelay;
    uint256 oracleBalance;
  }

  struct Challenge {
      address challenger;
      uint256 requestId;
      uint256 timestamp;
      uint8 state; // 0 - No Challenge; 1 -
      uint256 challengeTimestamp;
  }

  constructor(address _receiverStorage) public {
      receiverStorage = IReceiverStorage(_receiverStorage);
      datasetCount=0;
  }

  function newDataset(
      uint256 _requestId,
      uint256 _timestampWindow,
      uint256 _valueWindow,
      address _token,
      uint256 _minDeposit,
      uint256 _slashAmount,
      address _oracle,
      uint256 _disputeDelay)
      public {

      metadata[datasetCount] = Metadata({
          requestId: _requestId,
          timestampWindow: _timestampWindow,
          valueWindow: _valueWindow,
          token: _token,
          minDeposit: _minDeposit,
          slashAmount: _slashAmount,
          oracle: _oracle,
          disputeDelay: _disputeDelay,
          oracleBalance: 0
      });

      datasetCount++;
  }

  function submitData(uint256 _requestId, uint256 _timestamp, uint256 _value) public {
      Metadata storage metaTemp = metadata[_requestId];
      require(msg.sender == metaTemp.oracle);
      require(metaTemp.oracleBalance >= metaTemp.minDeposit);

      values[_requestId][_timestamp] = _value;
      set[_requestId][_timestamp] = true;
  }

  function challengeData(uint256 _requestId, uint256 _timestamp) public {
      require(set[_requestId][_timestamp]);
      require(!disputed[_requestId][_timestamp]);

      Challenge memory challenge = Challenge({
          challenger: msg.sender,
          requestId: _requestId,
          timestamp: _timestamp,
          state: 1,
          challengeTimestamp: now
      });
      challenges.push(challenge);
      disputed[_requestId][_timestamp] = true;
  }

  function submitProof(uint256 _challengeId, uint256 _timestamp) public {
      Challenge storage challenge = challenges[_challengeId];
      Metadata storage metaTemp = metadata[challenge.requestId];
      require(msg.sender == challenge.challenger);
      require(challenge.state == 1);
      require(now <= challenge.timestamp + metaTemp.disputeDelay);              // Fix with SafeMath
      require(_timestamp - challenge.timestamp <= metaTemp.timestampWindow);    // Fix with SafeMath

      (bool retrieved, uint256 value) = receiverStorage.retrieveData(metaTemp.requestId, _timestamp);
      require(retrieved);
      require(value - values[challenge.requestId][challenge.timestamp] >= metaTemp.valueWindow);


  }

  function processChallenge(uint256 _challengeId) public {

  }
}
