const MockTellor = artifacts.require("./MockTellor.sol"); 
const UsingTellor = artifacts.require("./UsingTellor.sol"); 
const Sender = artifacts.require("./Sender.sol"); 

const ReceiverStorage = artifacts.require("./ReceiverStorage.sol"); 
const CentralizedOracle = artifacts.require("./CentralizedOracle.sol"); 

 contract("CentralizedOracle Contract fx testing", function(accounts) {
  let mockTellor
  let usingTellor
  let sender
  let receiverStorage
  let centralizedOracle

  beforeEach("Setup contract for each test", async function() {

  	//deploy test tellor on Ethereum
    mockTellor= await MockTellor.new([accounts[0], accounts[1],accounts[2],accounts[3],accounts[4]], [5000,5000,5000,5000,5000])
    	console.log('mockTellor', mockTellor.address)
    usingTellor = await UsingTellor.new(mockTellor.address)

    //mine a value
    await mockTellor.submitValue(1, 1000)
    value = await usingTellor.getCurrentValue(1) 
    console.log("value", value[1]*1, value[2]*1)

   //how do I send a value to ReceiverStorage....
    //deploy receiver on Matic
    receiverStorage = await ReceiverStorage.new()
    console.log(receiverStorage.address)
    //deploy sender contract on Ethereum
  	sender = await Sender.new(mockTellor.address, accounts[2], receiverStorage.address) 
    

    //optimistic oracle on Matic
    centralizedOracle = await CentralizedOracle.new(receiverStorage.address, accounts[0], accounts[0])
   
  });


 //centralizedOracle.newDataset(    uint256 _referenceRequestId,      uint256 _timestampWindow)
 //centralizedOracle.submitData(uint256 _requestId, uint256 _timestamp, uint256 _value)
 //centralizedOracle.challengeData(uint256 _requestId, uint256 _timestamp, uint256 _challengeTimestamp)
 //centralizedOracle.retrieveData(uint256 _requestId, uint256 _timestamp)
 //centralizedOracle.isInDispute(uint256 _requestId, uint256 _timestamp)
 //centralizedOracle.getNewValueCountbyRequestId(uint256 _requestId)
 //centralizedOracle.getTimestampbyRequestIDandIndex(uint256 _requestId, uint256 index)

//onStateReceive(uint256 stateId, bytes calldata data)//how do i create a mock validator....???
//parse96BytesToThreeUint256(bytes memory data)//why is this not internal?
//receiverStorage.retrieveData(uint256 _requestId, uint256 _timestamp)


//sender.retrieveDataAndSend(uint256 _requestId, uint256 _timestamp)
//sender.getCurrentValueAndSend(uint256 _requestId)

  it("Test ", async function() {

  });

});