// CentralizedOracle2.sol

pragma solidity 0.5.16;
import "./libraries/SafeMath.sol";

contract IReceiverStorage {
  function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(bool, uint256, address);
  function retrieveLatestValue(uint256 _requestId) public view returns(uint256, uint256, address);
}


/**
Ensure the request Id exists in Tellor before using it as a dispute mechanism
*/
contract CentralizedOracle  {
  using SafeMath for uint256;

  IReceiverStorage public receiverStorage;

    
  address public owner;
  address public oracle;
  uint256 public datasetCount;
  uint256 public feeBalance;
  uint256 public challengeFee;

  mapping (uint256 => mapping(uint256 => uint256)) public values;
  mapping (uint256 => mapping(uint256 => bool)) public locked;
  mapping (uint256 => bool) public reqIdlocked;
  mapping (uint256 => mapping(uint256 => bool)) public isChallenged;
  mapping (uint256 => uint256[]) public timestamps;
  mapping (uint256 => Metadata) public metadata;


  struct Metadata {
    uint256 referenceRequestId;     // ID of corresponding mainnet data
    uint256 timestampWindow;        // Max distance from which a challenge datapoint applies to a centralized datapoint
  }

  /**
  @dev Sets the receiverStorage to save data from, owner and oracle
  @param _receiverStorage is the receiver address from Matic
  @param _owner is the centralized oracle owner
  @param _oracle is the oracle address(can be the same as the _owner)
  */
  constructor(address _receiverStorage, address _owner, address _oracle, uint _fee) public {
      receiverStorage = IReceiverStorage(_receiverStorage);
      owner = _owner;
      oracle = _oracle;
      datasetCount=0;
      challengeFee = _fee;
  }


  /**
  @dev Allows the owner to create add a requestId
  @param _referenceRequestId is the data type requestId that corresponds to Tellor's requestId on Ethereum
  @param _timestampWindow is the amount of time a value is allowed to be challenged/disputed
  */
  function newDataset(uint256 _referenceRequestId, uint256 _timestampWindow) public {
      require(msg.sender == owner);

      metadata[datasetCount] = Metadata({
          referenceRequestId: _referenceRequestId,
          timestampWindow: _timestampWindow
      });

      datasetCount++;
  }

  /**
  @dev Allows centralized oracle to submit data
  @param _requestId is requestId and should correspond to the requestId in tellor
  @param _timestamp for the entry
  @param _value is the current value for the requestId
  */
  function submitData(uint256 _requestId, uint256 _timestamp, uint256 _value) public {
      require(msg.sender == oracle, 'This address in not allowed to submitData');
      require (_timestamp <= now, "Timestamp cannot be in the future");
      require(!locked[_requestId][_timestamp], "Timestamp is locked due to a dispute");
      values[_requestId][_timestamp] = _value;
      timestamps[_requestId].push(_timestamp);
  }

  /**
  @dev Allows any party to challenged data provided by the centralized oracle
  @param _requestId is requestId to challenge
  @param _timestamp to challenge
  */
  function challengeData(uint256 _requestId, uint256 _timestamp) payable public {
      require(msg.value == challengeFee, "fee should be correct");
      require(values[_requestId][_timestamp] > 0, "The value for timestamp to be disputed does not exist");
      uint now1 = now;
      require(now1.sub(_timestamp) <= metadata[_requestId].timestampWindow,"The window to dispute has ended");
      locked[_requestId][_timestamp] = true;
      reqIdlocked[_requestId] = true;
      feeBalance += challengeFee;
  }

  /**
  @dev Allows any party to revise the data challenged with Tellor's data.
  @param _requestId is requestId currently under challenge
  @param _timestamp under challenge
  */
  function settleChallenge(uint256 _requestId, uint256 _timestamp) payable public {
    require(locked[_requestId][_timestamp]);
    require(reqIdlocked[_requestId]);
    uint now1 = now;
    require(now1 - _timestamp > 1 hours, "1 hour has to pass before settling challenge to ensure Tellor data is avialable an undisputed");   
    (uint256 tellorTimestamp, uint256 value, address dataProvider) = receiverStorage.retrieveLatestValue(_requestId);
    require(now1 - tellorTimestamp >= 3600, "No data has been received from Tellor in 1 hour"); 
    locked[_requestId][_timestamp] = false;
    reqIdlocked[_requestId] = false;
    values[_requestId][_timestamp] = value;
    timestamps[_requestId].push(_timestamp);
    dataProvider.call.value(challengeFee);
  }

  /**
  @dev Allows the user to retrieve the value of the _requestId and _timestamp specified.
  @param _requestId is the requestId to look up a value for
  @param _timestamp is the timestamp to look up a value for
  @return the value 
  */ 
  function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256){
      //if requestId is locked then retrieve only Tellor data
      if (reqIdlocked[_requestId] == false) {
        return values[_requestId][_timestamp];
      } else {
      return values[_requestId][_timestamp];
      }
  }


  /**
  @dev Allows the user to check if a value is being challenged
  @param _requestId is the requestId to look up 
  @param _timestamp is the timestamp to look up
  @return true if it is being challenged 
  */
  function isUnderChallenge(uint256 _requestId, uint256 _timestamp) public view returns(bool){
      return isChallenged[_requestId][_timestamp];
  }

  /**
  @dev Allows the user to retrieve the number of values saved for the specified requestId
  @param _requestId is the requestId to look up 
  @return the count of values saved for the specified requestId
  */
  function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint) {
      return timestamps[_requestId].length;
  }

  /**
  @dev Allows the user to retrieve the timestamp specified requestId and index
  @param _requestId is the requestId to look up 
  @param _index is the index to look up
  @return the timestamp
  */
  function getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 _index) public view returns(uint256) {
      uint len = timestamps[_requestId].length;
      if(len == 0 || len <= _index) return 0;
      return timestamps[_requestId][_index];
  }
}
