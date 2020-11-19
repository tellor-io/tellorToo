/*****************Ethereum Deployment*****************************************************/

//                Deploy Test Using Tellor on Ethereum TestNet and Matic testnet                                            //

/*****************************************************************************************/

const MockTellor = artifacts.require('./MockTellor')
const UsingTellor = artifacts.require('./UsingTellor')
const MockSender = artifacts.require("./MockSender")
const Sender = artifacts.require('./Sender')
const ReceiverStorage = artifacts.require('./ReceiverStorage')
const CentralizedOracle = artifacts.require('./CentralizedOracle')



const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");
//var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", `https://rpc-mumbai.matic.today`));
//var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", "https://goerli.infura.io/v3/7f11ed6df93946658bf4c817620fbced"));//bc3e399903ae407fa477aa0854a00cdc
var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", "https://rinkeby.infura.io/v3/7f11ed6df93946658bf4c817620fbced"));//bc3e399903ae407fa477aa0854a00cdc

//4944b10f2cbd4e1d8c03e0e8ff2cd985
//7f11ed6df93946658bf4c817620fbced

//goerli
var maticStateSender = '0xEAa852323826C71cd7920C3b4c007184234c3945'
//StateSender": "0xEAa852323826C71cd7920C3b4c007184234c3945"


// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }

module.exports =async function(callback) {

  let mockTellor
  //let mockSender
  let usingTellor
  let sender
  let receiverStorage
  let centralizedOracle
  let accts
  let oracle
  let owner
  let maticReceiver

    accts = ['0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3', 
         '0x353E6a85E6A74b7a1C287d11dA1aA091Fbdd7F34',
         '0x52ce8b3Cdf8719aC69DcE22B9Ee23e24EBE0A00c',
         '0x8bC54c696d9F912037689CE04109B007a9b15aD8',
         '0x84005BA16a117Ac1B94da7a7FdaF6882f82EA3F5']

    owner = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'
    oracle = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'


    /***STEP 1: Deploy ReceiverStorage on Matic and take the address to update maticReceiver var below**/
    //  //Matic  or Mumbai
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network mumbai
    receiverStorage = await ReceiverStorage.new()
    console.log("receiverStorage: ", receiverStorage.address)

    centralizedOracle = await CentralizedOracle.new(receiverStorage.address, owner, oracle,web3.utils.toWei("10"))
  
     // receiverStorage = '0xDc09952CB01c2da363F53fC8eC958895b6ab86F3'
     // centralizedOracle = await CentralizedOracle.new(receiverStorage, owner, oracle,web3.utils.toWei("10"))
 
    console.log("centralizedOracle: ", centralizedOracle.address)

    usingTellor = await UsingTellor.new(centralizedOracle.address)
    console.log("usingTellor: ", usingTellor.address)

    /*******UPDATE with deployment*****************************/
    //receiverStorage = '0xDc09952CB01c2da363F53fC8eC958895b6ab86F3'
    /*******UPDATE maticReceiver var with deployment**************/

    /***STEP 2: Deploy MockTellor and sender contract on Ethereum or Ethereum testnet********/
    // //Ethereum-Goerli or ropsten (Matic's ropstend sender: 0x22E1f5aa1BA9e60527250FFeb35e30Aa2913727f)
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network goerli

    // mockTellor= await MockTellor.new(accts, [web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000")])
    // console.log("mockTellor: ", mockTellor.address)
  	
    // sender = await Sender.new(mockTellor.address, maticStateSender, receiverStorage) 
    // //sender = await Sender.new(mockTellor, maticSender, receiverStorage) 
    // console.log("Goerli sender: ", sender.address)
    // console.log("Goerli maticStateSender: ", maticStateSender)
    // console.log("mumbai receiverStorage: ", receiverStorage)


}