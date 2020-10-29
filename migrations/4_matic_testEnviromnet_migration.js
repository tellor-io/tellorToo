/*****************Matic test migrations deployment*****************************************************/

//                Deploy Test Tellor on Matic Network                                     //

/******************************************************************************************/

const MockTellor = artifacts.require('MockTellor.sol');
const UsingTellor = artifacts.require('UsingTellor.sol');


const MockSender = artifacts.require("./MockSender.sol")
const ReceiverStorage = artifacts.require("./ReceiverStorage.sol"); 
const CentralizedOracle = artifacts.require("./CentralizedOracle.sol"); 

/**
*These commands that need to be ran:
*truffle migrate --network mumbai -f 1 --to 2 --skip-dry-run
*/

module.exports = async function(deployer) {
    // deploy test tellor contract
    await deployer.deploy(MockTellor);

    await deployer.deploy(MockTellor).then(async function() {
       await deployer.deploy(UsingTellor, MockTellor.address);
    });

    await deployer.deploy(MockSender);
    await deployer.deploy(ReceiverStorage);

    await deployer.deploy(MockTellor, MockSender, ReceiverStorage).then(async function() {
       await deployer.deploy(Sender, MockTellor.address, MockSender.address, ReceiverStorage.address);
    });

    entralizedOracle = await CentralizedOracle.new(receiverStorage.address, accounts[0], accounts[0],web3.utils.toWei("10"))
    usingTellor = await UsingTellor.new(centralizedOracle.address)

};