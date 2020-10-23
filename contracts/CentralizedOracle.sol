// CentralizedOracle2.sol

pragma solidity 0.5.16;
import "./libraries/SafeMath.sol";

// library SafeMath {

//     function max(uint256 a, uint256 b) internal pure returns (uint256) {
//         return a > b ? a : b;
//     }

//     function max(int256 a, int256 b) internal pure returns (uint256) {
//         return a > b ? uint256(a) : uint256(b);
//     }

//     function min(uint256 a, uint256 b) internal pure returns (uint256) {
//         return a < b ? a : b;
//     }


//     function sub(uint256 a, uint256 b) internal pure returns (uint256) {
//         assert(b <= a);
//         return a - b;
//     }

//     function sub(int256 a, int256 b) internal pure returns (int256 c) {
//         if (b > 0) {
//             c = a - b;
//             assert(c <= a);
//         } else {
//             c = a - b;
//             assert(c >= a);
//         }
//     }
// }


contract IReceiverStorage {
  function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(bool, uint256);
}


/**
Ensure the request Id exists in Tellor before using it as a dispute mechanism
*/
contract CentralizedOracle  {
  using SafeMath for uint256;

  IReceiverStorage public receiverStorage;

  mapping (uint256 => mapping(uint256 => uint256)) public values;
  mapping (uint256 => mapping(uint256 => bool)) public locked;
  mapping (uint256 => mapping(uint256 => bool)) public isChallenged;
  mapping (uint256 => uint256[]) public timestamps;
  mapping (uint256 => Metadata) public metadata;
  uint256 datasetCount;
  address owner;
  address oracle;

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
  constructor(address _receiverStorage, address _owner, address _oracle) public {
      receiverStorage = IReceiverStorage(_receiverStorage);
      owner = _owner;
      oracle = _oracle;
      datasetCount=0;
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
      require(!locked[_requestId][_timestamp]);

      values[_requestId][_timestamp] = _value;
      timestamps[_requestId].push(_timestamp);
  }


  /**
  @dev Allows any party to challenged data provided by the centralized oracle
  @param _requestId is requestId to challenge
  @param _timestamp to challenge
  */
  function challengeData(uint256 _requestId, uint256 _timestamp) public {
      require(values[_requestId][_timestamp] > 0, 'The timestamp to be disputed does not exist');
      uint now1 = now - (now % 1 hours);

      require(now1.sub(_timestamp) <= metadata[_requestId].timestampWindow,
        'The window to dispute has ended');

      (bool retrieved, uint256 retrievedValue) = receiverStorage.retrieveData(metadata[_requestId].referenceRequestId, _timestamp);
      require(retrieved, "Data cannot be challenged because it has not been received from Tellor's mainnet Ethereum");
      locked[_requestId][_timestamp] = true;
      values[_requestId][_timestamp] = retrievedValue;
  }

  /**
  @dev Allows any party to revise the data challenged with Tellor's data.
  @param _requestId is requestId currently under challenge
  @param _timestamp under challenge
  */
  function settleChallenge(uint256 _requestId, uint256 _timestamp) public {
    require(locked[_requestId][_timestamp]);
    uint now1 = now - (now % 1 hours);
    require(now1 - _timestamp > 2 hours, '1 hour has to pass before settling challenge to ensure Tellor data is avialable an undisputed');

    //Maybe loop through available timestamp values starting with _timestamp until one is found??? what are the odds that these will be the same?
    (bool retrieved, uint256 retrievedValue) = receiverStorage.retrieveData(metadata[_requestId].referenceRequestId, _timestamp);
    
    require(retrieved, "Challenge cannot be settled because data has not been received from Tellor's mainnet Ethereum");
    //require(_timestamp - tellorTimestamp < 3 hours, 'The available Tellor data is older than three hours from disputed timestamp');
    locked[_requestId][_timestamp] = false;
    values[_requestId][_timestamp] = retrievedValue;
  }

  /**
  @dev Allows the user to retreive the value of the _requestId and _timestamp specified.
  @param _requestId is the requestId to look up a value for
  @param _timestamp is the timestamp to look up a value for
  @return the value 
  */ 
  function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256){
      return values[_requestId][_timestamp];
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
  @dev Allows the user to retreive the number of values saved for the specified requestId
  @param _requestId is the requestId to look up 
  @return the count of values saved for the specified requestId
  */
  function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint) {
      return timestamps[_requestId].length;
  }

  /**
  @dev Allows the user to retreive the timestamp specified requestId and index
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
