const MockTellor = artifacts.require("./MockTellor.sol"); 
const UsingTellor = artifacts.require("./UsingTellor.sol"); 
const Sender = artifacts.require("./Sender.sol"); 
const MockSender = artifacts.require("./MockSender.sol")
const ReceiverStorage = artifacts.require("./ReceiverStorage.sol"); 
const CentralizedOracle = artifacts.require("./CentralizedOracle.sol"); 

 contract("CentralizedOracle Contract fx testing", function(accounts) {
  let mockTellor
  let mockSender
  let usingTellor
  let sender
  let receiverStorage
  let centralizedOracle

  beforeEach("Setup contract for each test", async function() {

    mockTellor= await MockTellor.new([accounts[0], accounts[1],accounts[2],accounts[3],accounts[4]], [5000,5000,5000,5000,5000])
    usingTellor = await UsingTellor.new(mockTellor.address)
    mockSender = await MockSender.new();
    await mockTellor.submitValue(1, 6000)
    value = await usingTellor.getCurrentValue(1) 
    receiverStorage = await ReceiverStorage.new()
  	sender = await Sender.new(mockTellor.address, mockSender.address, receiverStorage.address) 
    centralizedOracle = await CentralizedOracle.new(receiverStorage.address, accounts[0], accounts[0],web3.utils.toWei("10"))
  });

  // it("Add new dataset to centralizedOracle and submit data ", async function() {
  // 	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
  //   let _now1 = _now - 1800;
  //   await centralizedOracle.newDataset( 1,  3600)  //  can be disputed within one hour
  //   await centralizedOracle.submitData(1, _now1, 1000)
  //   let val1 = await centralizedOracle.retrieveData(1, _now1)
  //   await centralizedOracle.submitData(1, _now, 2000)
  //   let val2 = await centralizedOracle.retrieveData(1, _now)
  //   assert(val1==1000, "the value should be 1000")
  //   assert(val2==2000, "the value should be 2000")
  //  });

  // it("getNewValueCountbyRequestId ", async function() {
  // 	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
  //   let _now1 = _now - 84000;
  //   await centralizedOracle.newDataset( 1,  3600) 
  //   await centralizedOracle.submitData(1, _now1, 1000)
  //   await centralizedOracle.retrieveData(1, _now1)
  //   await centralizedOracle.submitData(1, _now, 2000)
  //   let count = await centralizedOracle.getNewValueCountbyRequestId(1)
  //   assert(count==2, "the count should be 2")
  //  });

  // it(" getTimestampbyRequestIDandIndex ", async function() {
  // 	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
  //   let _now1 = _now - 84000;
  //   await centralizedOracle.newDataset( 1,  3600) 
  //   await centralizedOracle.submitData(1, _now1, 1000)
  //   await centralizedOracle.retrieveData(1, _now1)
  //   await centralizedOracle.submitData(1, _now, 2000)
  //   let timestamp1 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,0)
  //   let timestamp2 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,1)
  //   assert(timestamp1==_now1, "the timesamtp should be now1")
  //   assert(timestamp2==_now, "the timesamtp should be _now")
  //  });

  // it(" getTimestampbyRequestIDandIndex ", async function() {
  // 	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
  //   let _now1 = _now - 84000;
  //   await centralizedOracle.newDataset( 1,  3600) 
  //   await centralizedOracle.submitData(1, _now1, 1000)
  //   await centralizedOracle.retrieveData(1, _now1)
  //   await centralizedOracle.submitData(1, _now, 2000)
  //   let timestamp1 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,0)
  //   let timestamp2 = await centralizedOracle.getTimestampbyRequestIDandIndex(1,1)
  //   assert(timestamp1==_now1, "the timesamtp should be now1")
  //   assert(timestamp2==_now, "the timesamtp should be _now")
   // });

  it(" Test challengeData and isUnderChallenge and settle challenge", async function() {
  	let _now  =  (Date.now() - (Date.now() % 84000))/1000;
    await centralizedOracle.newDataset( 1,  3600) 
    await centralizedOracle.submitData(1, _now, 1000)
    let val =await centralizedOracle.retrieveData(1, _now)
    assert(val == 1000)
    await centralizedOracle.challengeData(1, _now,{from:accounts[2],value:web3.utils.toWei("10")}) 
    let dispute = await centralizedOracle.isUnderChallenge(1, _now)
    assert(dispute == true, "Value is not under dispute")
    val = await centralizedOracle.retrieveData(1, _now)
    assert(val == 0," no value should be available")
    await mockTellor.submitValue(1,8000);
    let res = await sender.getCurrentValueAndSend(1);
    console.log(res.receipt.rawLogs[0].data)
    let logdata = res.receipt.rawLogs[0].data
    logdata= logdata.substring(131)
    logdata = '0x' + logdata
    await receiverStorage.testOnStateRecieve(1,logdata);
    //uint256 _timestamp, uint256 _challengeTimestamp
    await centralizedOracle.settleChallenge(1,_now);
    val = await centralizedOracle.retrieveData(1, _now)
    assert(val == 8000)
   });

  // it("test three data points", async function() {
  //   let _now  =  (Date.now() - (Date.now() % 84000))/1000;
  //   await centralizedOracle.newDataset( 1,  3600) 
  //   await centralizedOracle.newDataset( 2,  60) 
  //   await centralizedOracle.newDataset( 3,  360) 
  //   for(var i=1;i<=3;i++){
  //     await centralizedOracle.submitData(i, _now + 1000 * i, 1000* i);
  //   }
  //   for(var i=1;i<=3;i++){
  //     val = await centralizedOracle.retrieveData(i, _now + 1000 * i);
  //     assert(val == 1000*i,"value should be correct");
  //   }
  //  });

    it("test challenge then resumption of optimistic oracle and assert throw of locked period", async function() {
    let _now  =  (Date.now() - (Date.now() % 84000))/1000;
    await centralizedOracle.newDataset( 1,  3600) 
    await centralizedOracle.submitData(1, _now, 1000)
    let val =await centralizedOracle.retrieveData(1, _now)
    assert(val == 1000)
    await mockTellor.submitValue(1,8000);
    let res = await sender.getCurrentValueAndSend(1);
    console.log(res)
    console.log(res.receipt.rawLogs)
    let logdata = res.receipt.rawLogs[0].data
    await receiverStorage.testOnStateRecieve(1,logdata);
    await centralizedOracle.challengeData(1, _now) //uint256 _timestamp, uint256 _challengeTimestamp
    let dispute = await centralizedOracle.isUnderChallenge(1, _now)
    assert(dispute == true, "Value is not under dispute")
    val = await centralizedOracle.retrieveData(1, _now)
    assert(val1 == nil," no value should be available")
    await centralizedOracle.settleChallenge(1,_now1);
    val = await centralizedOracle.retrieveData(1, _now)
    assert(val == 8000)
    await expectThrow(centralizedOracle.submitData(1,_now+ 1000,2000))
    await helpers.advanceTime(3600)
        await centralizedOracle.submitData(1, _now+1000, 4000)
    val =await centralizedOracle.retrieveData(1, _now+1000)
    assert(val == 4000)

   });
   it("test worst case scenario (broken centralized oracle, all disputes)", async function() {
    assert(0==1)
   });
            it("test central oracle usingTellor functions", async function() {
    assert(0==1)
   });
      it("test worst case scenario using Tellor)", async function() {
    assert(0==1)
   });

  // // *********************Receiver/ Sender******************************************/
  it("Test onStateReceive", async function() {
    await mockTellor.submitValue(55,50001,{from:accounts[3]});
    let res = await sender.getCurrentValueAndSend(55);
    console.log(res.receipt.rawLogs[0].data)
    let logdata = res.receipt.rawLogs[0].data
    logdata= logdata.substring(131)
    logdata = '0x' + logdata
    await receiverStorage.testOnStateRecieve(1,logdata);
    let val = receiverStorage.retreiveLatestValue(55)
    console.log(val)
    assert(val[0] == 50001)
    assert(val[1] > 0)
    assert(val[2] == accounts[3])
    val = receiverStorage.retreiveData(55,val[1])
    assert(val[0] == true)
    assert(val[1] == 50001)
    assert(val[2] == accounts[3])
  });

  it("Test retrieveDataAndSend", async function() {
    let res = await mockTellor.submitValue(58,2001,{from:accounts[5]});
    console.log(res)
    res = await sender.retrieveDataAndSend(58, res.receipt[1]);
    console.log(res.receipt.rawLogs[0].data)
    let logdata = res.receipt.rawLogs[0].data
    logdata= logdata.substring(131)
    logdata = '0x' + logdata
    await receiverStorage.testOnStateRecieve(1,logdata);
    let val = receiverStorage.retreiveLatestValue(55)
    console.log(val)
    assert(val[0] == 50001)
    assert(val[1] > 0)
    assert(val[2] == accounts[3])
    val = receiverStorage.retreiveData(55,val[1])
    assert(val[0] == true)
    assert(val[1] == 50001)
    assert(val[2] == accounts[3])
  });
});