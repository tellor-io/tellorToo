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
    mockTellor= await MockTellor.new((address[] memory _initialBalances, uint256[] memory _intialAmounts)
    usingTellor = await UsingTellor.new(address payable _tellor)

    //mine a value


    //deploy receiver on Matic
    // how do I send data to onStateReceive
    receiverStorage = await ReceiverStorage.new()
    //deploy sender contract on Ethereum
  	sender = await Sender.new(address payable _tellorAddress, address _stateSender, receiverStorage.address) 
    


//These would be deployed on Matic but ....Matic is EVM compatible so it can be tested on local implementation

    //optimistic oracle on Matic
    centralizedOracle = await CentralizedOracle.new(address _receiverStorage, address _owner, address _oracle)
   



  });

  it("Test ", async function() {

  });

});