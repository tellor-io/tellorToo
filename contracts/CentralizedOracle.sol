// CentralizedOracle.sol

pragma solidity 0.5.16;

contract IReceiverStorage {
    function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(bool, uint256);
}

contract IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract CentralizedOracle {
  IReceiverStorage public receiverStorage;

  mapping (uint256 => mapping(uint256 => uint256)) public values;
  mapping (uint256 => mapping(uint256 => bool)) public set;
  mapping (uint256 => mapping(uint256 => bool)) public disputed;
  mapping (uint256 => mapping(uint256 => bool)) public locked;
  mapping (uint256 => Metadata) public metadata;
  Challenge[] public challenges;
  uint256 datasetCount;

  struct Metadata {
    uint256 requestId;              // ID of corresponding mainnet data
    uint256 timestampWindow;        // Max distance from which a challenge datapoint applies to a centralized datapoint
    uint256 valueWindow;            // Min distance from which a decentralized value knocks out a centralized value
    address token;                  // Token used for deposits
    uint256 challengerDeposit;      // Deposit required to challenge data
    address oracle;                 // Centralized oracle's address
    uint256 disputeDelay;           // Delay window for submitting dispute proof
    uint256 latestTimestamp;        // Last time data was submitted
  }

  struct Challenge {
      address challenger;
      uint256 requestId;
      uint256 timestamp;
      uint256 bestTimestamp;
      uint256 bestValue;
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
      uint256 _challengerDeposit,
      address _oracle,
      uint256 _disputeDelay)
      public {

      metadata[datasetCount] = Metadata({
          requestId: _requestId,
          timestampWindow: _timestampWindow,
          valueWindow: _valueWindow,
          token: _token,
          challengerDeposit: _challengerDeposit,
          oracle: _oracle,
          disputeDelay: _disputeDelay,
          latestTimestamp: 0
      });

      datasetCount++;
  }

  function submitData(uint256 _requestId, uint256 _timestamp, uint256 _value) public {
      Metadata memory metaTemp = metadata[_requestId];
      require(msg.sender == metaTemp.oracle);

      values[_requestId][_timestamp] = _value;
      set[_requestId][_timestamp] = true;
      metadata[_requestId].latestTimestamp = now;
  }

  function challengeData(uint256 _requestId, uint256 _timestamp) public {
      require(set[_requestId][_timestamp]);
      require(!disputed[_requestId][_timestamp]);

      Challenge memory challenge = Challenge({
          challenger: msg.sender,
          requestId: _requestId,
          timestamp: _timestamp,
          bestTimestamp: _timestamp,
          bestValue: values[_requestId][_timestamp],
          state: 1,
          challengeTimestamp: now
      });
      challenges.push(challenge);
      disputed[_requestId][_timestamp] = true;

      IERC20 depositToken = IERC20(metadata[_requestId].token);
      require(depositToken.transferFrom(msg.sender, address(this), metadata[_requestId].challengerDeposit));
  }

  function submitProof(uint256 _challengeId, uint256 _timestamp) public {
      Challenge memory challenge = challenges[_challengeId];
      Metadata memory metaTemp = metadata[challenge.requestId];
      require(msg.sender == challenge.challenger);
      require(challenge.state == 1);
      require(now <= challenge.challengeTimestamp + metaTemp.disputeDelay);     // Fix with SafeMath
      require(_timestamp - challenge.timestamp <= metaTemp.timestampWindow);    // Fix with SafeMath

      (bool retrieved, uint256 value) = receiverStorage.retrieveData(metaTemp.requestId, _timestamp);
      require(retrieved);
      require(value - values[challenge.requestId][challenge.timestamp] >= metaTemp.valueWindow);

      challenge.bestValue = value;
      challenge.bestTimestamp = _timestamp;
      challenge.challengeTimestamp = now;
      challenge.state = 2;

      challenges[_challengeId] = challenge;
  }

  function processChallenge(uint256 _challengeId) public {
      Challenge memory challenge = challenges[_challengeId];
      Metadata memory metaTemp = metadata[challenge.requestId];
      IERC20 depositToken = IERC20(metaTemp.token);
      require(now >= challenge.challengeTimestamp + metaTemp.disputeDelay);
      require(challenge.state != 4);

      if (challenge.state == 2) {

      } else {
          disputed[challenge.requestId][challenge.timestamp] = false;
      }

      challenge.state = 4;

      challenges[_challengeId] = challenge;
      metadata[challenge.requestId] = metaTemp;
  }
}
