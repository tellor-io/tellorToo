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

    //add a value
    await mockTellor.submitValue(1, 6000)
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

  it("Add new dataset to centralizedOracle and submit data ", async function() {
  	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
    let _now1 = _now - 1800;
    await centralizedOracle.newDataset( 1,  3600)  //  can be disputed within one hour
    await centralizedOracle.submitData(1, _now1, 1000)
    let val1 = await centralizedOracle.retrieveData(1, _now1)
    await centralizedOracle.submitData(1, _now, 2000)
    let val2 = await centralizedOracle.retrieveData(1, _now)
    assert(val1==1000, "the value should be 1000")
    assert(val2==2000, "the value should be 2000")
   });

  it("getNewValueCountbyRequestId ", async function() {
  	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
    let _now1 = _now - 84000;
    await centralizedOracle.newDataset( 1,  3600) 
    await centralizedOracle.submitData(1, _now1, 1000)
    await centralizedOracle.retrieveData(1, _now1)
    await centralizedOracle.submitData(1, _now, 2000)
    let count = await centralizedOracle.getNewValueCountbyRequestId(1)
    assert(count==2, "the count should be 2")
   });

  it(" getTimestampbyRequestIDandIndex ", async function() {
  	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
    let _now1 = _now - 84000;
    await centralizedOracle.newDataset( 1,  3600) 
    await centralizedOracle.submitData(1, _now1, 1000)
    await centralizedOracle.retrieveData(1, _now1)
    await centralizedOracle.submitData(1, _now, 2000)
    let timestamp1 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,0)
    let timestamp2 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,1)
    assert(timestamp1==_now1, "the timesamtp should be now1")
    assert(timestamp2==_now, "the timesamtp should be _now")
   });

  it(" getTimestampbyRequestIDandIndex ", async function() {
  	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
    let _now1 = _now - 84000;
    await centralizedOracle.newDataset( 1,  3600) 
    await centralizedOracle.submitData(1, _now1, 1000)
    await centralizedOracle.retrieveData(1, _now1)
    await centralizedOracle.submitData(1, _now, 2000)
    let timestamp1 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,0)
    let timestamp2 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,1)
    assert(timestamp1==_now1, "the timesamtp should be now1")
    assert(timestamp2==_now, "the timesamtp should be _now")
   });

  // it(" Test challengeData and isIndDispute", async function() {
  // 	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
  //   let _now1 = _now - 84000;
  //   await centralizedOracle.newDataset( 1,  3600) 
  //   await centralizedOracle.submitData(1, _now1, 1000)
  //   await centralizedOracle.retrieveData(1, _now1)
  //   await centralizedOracle.submitData(1, _now, 2000) 
  //   let val2 = await centralizedOracle.retrieveData(1, _now1)
  //   console.log('value before challenge', val2*1)

  //   //fast forward time
  //   await centralizedOracle.challengeData(1, _now, _now1) //uint256 _timestamp, uint256 _challengeTimestamp
  //   let dispute = await centralizedOracle.isInDispute(1, _now)
  //   assert(dispute == true, "Value is not under dispute")
  //   let val1 = await centralizedOracle.retrieveData(1, _now)
  //   assert(val1 == 6000, "value replaced with MockTellor's value")
  //  });

  // *********************Receiver******************************************/
  it("Test onStateReceive", async function() {

  });

    it("Test retrieveData", async function() {

  });

//onStateReceive(uint256 stateId, bytes calldata data)//how do i create a mock validator....???

//receiverStorage.retrieveData(uint256 _requestId, uint256 _timestamp)

  // *********************Sender******************************************/
//sender.retrieveDataAndSend(uint256 _requestId, uint256 _timestamp)
//sender.getCurrentValueAndSend(uint256 _requestId)

  it("Test ", async function() {

  });

  it("Test ", async function() {

  });


});