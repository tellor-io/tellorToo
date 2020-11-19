// File: contracts\libraries\SafeMath.sol

pragma solidity 0.5.16;
//Slightly modified SafeMath library - includes a min and max function, removes useless div function
library SafeMath {
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    function add(int256 a, int256 b) internal pure returns (int256 c) {
        if (b > 0) {
            c = a + b;
            assert(c >= a);
        } else {
            c = a + b;
            assert(c <= a);
        }
    }

    function max(uint256 a, uint256 b) internal pure returns (uint256) {
        return a > b ? a : b;
    }

    function max(int256 a, int256 b) internal pure returns (uint256) {
        return a > b ? uint256(a) : uint256(b);
    }

    function min(uint256 a, uint256 b) internal pure returns (uint256) {
        return a < b ? a : b;
    }

    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a * b;
        assert(a == 0 || c / a == b);
        return c;
    }

    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        assert(b <= a);
        return a - b;
    }

    function sub(int256 a, int256 b) internal pure returns (int256 c) {
        if (b > 0) {
            c = a - b;
            assert(c <= a);
        } else {
            c = a - b;
            assert(c >= a);
        }

    }
}

// File: contracts\MockTellor.sol

pragma solidity 0.5.16;

contract MockTellor {

    using SafeMath for uint256;
    event Transfer(address indexed _from, address indexed _to, uint256 _value);//ERC20 Transfer Event

    mapping(uint256 => mapping(uint256 => uint256)) public values; //requestId -> timestamp -> value
    mapping(uint256 => mapping(uint256 => bool)) public isDisputed; //requestId -> timestamp -> value
    mapping(uint256 => uint256[]) public timestamps;
    mapping(address => uint) public balances;
    uint256 public totalSupply;

    constructor(address[] memory _initialBalances, uint256[] memory _intialAmounts) public {
        require(_initialBalances.length == _intialAmounts.length, "Arrays have different lengths");
        for(uint i = 0; i < _intialAmounts.length; i++){
            balances[_initialBalances[i]] = _intialAmounts[i];
            totalSupply = totalSupply.add(_intialAmounts[i]);
        }
    }

    function mint(address _holder, uint256 _value) public {
        balances[_holder] = balances[_holder].add(_value);
        totalSupply = totalSupply.add(_value);
    }

    function transfer(address _to, uint256 _amount) public returns(bool) {
        return transferFrom(msg.sender, _to, _amount);
    }

    function transferFrom(address _from, address _to, uint256 _amount) public returns(bool){
        require(_amount != 0, "Tried to send non-positive amount");
        require(_to != address(0), "Receiver is 0 address");
        balances[_from] = balances[_from].sub(_amount);
        balances[_to] = balances[_to].add(_amount);
        emit Transfer(_from, _to, _amount);
    }

    function submitValue(uint256 _requestId,uint256 _value) external {
        values[_requestId][block.timestamp] = _value;
        timestamps[_requestId].push(block.timestamp);
    }

    function disputeValue(uint256 _requestId, uint256 _timestamp) external {
        values[_requestId][_timestamp] = 0;
        isDisputed[_requestId][_timestamp] = true;
    }

    function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256){
        return values[_requestId][_timestamp];
    }

    function isInDispute(uint256 _requestId, uint256 _timestamp) public view returns(bool){
        return isDisputed[_requestId][_timestamp];
    }

    function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint) {
        return timestamps[_requestId].length;
    }

    function getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 index) public view returns(uint256) {
        uint len = timestamps[_requestId].length;
        if(len == 0 || len <= index) return 0;
        return timestamps[_requestId][index];
    }

    function getTime() public view returns(uint256){
        return now;
    }
}

// File: contracts\UsingTellor.sol

pragma solidity 0.5.16;


/**
* @title UserContract 
* This is a TEST contract. It creates for easy integration to the Tellor System
* by allowing smart contracts to read data off Tellor
* **************only for testing**************
*/
contract UsingTellor{
    MockTellor tellor;
    /*Constructor*/
    /**
    * @dev the constructor sets the storage address and owner
    * @param _tellor is the TellorMaster address
    */
    constructor(address payable _tellor) public {
        tellor = MockTellor(_tellor);
    }

     /**
    * @dev Retreive value from oracle based on requestId/timestamp
    * @param _requestId being requested
    * @param _timestamp to retreive data/value from
    * @return uint value for requestId/timestamp submitted
    */
    function retrieveData(uint256 _requestId, uint256 _timestamp) public view returns(uint256){
        return tellor.retrieveData(_requestId,_timestamp);
    }

    /**
    * @dev Gets the 5 miners who mined the value for the specified requestId/_timestamp
    * @param _requestId to looku p
    * @param _timestamp is the timestamp to look up miners for
    * @return bool true if requestId/timestamp is under dispute
    */
    function isInDispute(uint256 _requestId, uint256 _timestamp) public view returns(bool){
        return tellor.isInDispute(_requestId, _timestamp);
    }

    /**
    * @dev Counts the number of values that have been submited for the request
    * @param _requestId the requestId to look up
    * @return uint count of the number of values received for the requestId
    */
    function getNewValueCountbyRequestId(uint256 _requestId) public view returns(uint) {
        return tellor.getNewValueCountbyRequestId(_requestId);
    }

    /**
    * @dev Gets the timestamp for the value based on their index
    * @param _requestId is the requestId to look up
    * @param _index is the value index to look up
    * @return uint timestamp
    */
    function getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 _index) public view returns(uint256) {
        return tellor.getTimestampbyRequestIDandIndex( _requestId,_index);
    }

    /**
    * @dev Allows the user to get the latest value for the requestId specified
    * @param _requestId is the requestId to look up the value for
    * @return bool true if it is able to retreive a value, the value, and the value's timestamp
    */
    function getCurrentValue(uint256 _requestId) public view returns (bool ifRetrieve, uint256 value, uint256 _timestampRetrieved) {
        uint256 _count = tellor.getNewValueCountbyRequestId(_requestId);
        uint _time = tellor.getTimestampbyRequestIDandIndex(_requestId, _count - 1);
        uint _value = tellor.retrieveData(_requestId, _time);
        if(_value > 0) return (true, _value, _time);
        return (false, 0 , _time);
    }

    function getIndexForDataBefore(uint _requestId, uint256 _timestamp) public view returns (bool found, uint256 index){
        uint256 _count = tellor.getNewValueCountbyRequestId(_requestId);
        if (_count > 0) {
            uint middle;
            uint start = 0;
            uint end = _count - 1;
            uint _time;

            //Checking Boundaries to short-circuit the algorithm
            _time = tellor.getTimestampbyRequestIDandIndex(_requestId, start);
            if(_time >= _timestamp) return (false, 0);
            _time = tellor.getTimestampbyRequestIDandIndex(_requestId, end);
            if(_time < _timestamp) return (true, end);

            //Since the value is within our boundaries, do a binary search
            while(true) {
                middle = (end - start) / 2 + 1 + start;
                _time = tellor.getTimestampbyRequestIDandIndex(_requestId, middle);
                if(_time < _timestamp){
                    //get imeadiate next value
                    uint _nextTime = tellor.getTimestampbyRequestIDandIndex(_requestId, middle + 1);
                    if(_nextTime >= _timestamp){
                        //_time is correct
                        return (true, middle);
                    } else  {
                        //look from middle + 1(next value) to end
                        start = middle + 1;
                    }
                } else {
                    uint _prevTime = tellor.getTimestampbyRequestIDandIndex(_requestId, middle - 1);
                    if(_prevTime < _timestamp){
                        // _prevtime is correct
                        return(true, middle - 1);
                    } else {
                        //look from start to middle -1(prev value)
                        end = middle -1;
                    }
                }
                //We couldn't found a value
                //if(middle - 1 == start || middle == _count) return (false, 0);
            }
        }
        return (false, 0);
    }


    /**
    * @dev Allows the user to get the first value for the requestId before the specified timestamp
    * @param _requestId is the requestId to look up the value for
    * @param _timestamp before which to search for first verified value
    * @return bool true if it is able to retreive a value, the value, and the value's timestamp
    */
    function getDataBefore(uint256 _requestId, uint256 _timestamp)
        public
        returns (bool _ifRetrieve, uint256 _value, uint256 _timestampRetrieved)
    {

        (bool _found, uint _index) = getIndexForDataBefore(_requestId,_timestamp);
        if(!_found) return (false, 0, 0);
        uint256 _time = tellor.getTimestampbyRequestIDandIndex(_requestId, _index);
        _value = tellor.retrieveData(_requestId, _time);
        //If value is diputed it'll return zero
        if (_value > 0) return (true, _value, _time);
        return (false, 0, 0);
    }
}
