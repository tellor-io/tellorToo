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
var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", `https://rpc-mumbai.matic.today`));
//can I switch networks ????

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
  let owner
  let oracle

    accts = ['0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3', 
         '0x353E6a85E6A74b7a1C287d11dA1aA091Fbdd7F34',
         '0x52ce8b3Cdf8719aC69DcE22B9Ee23e24EBE0A00c',
         '0x8bC54c696d9F912037689CE04109B007a9b15aD8',
         '0x84005BA16a117Ac1B94da7a7FdaF6882f82EA3F5']

    owner = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'
    oracle = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'
    //Matic 
    receiverStorage = await ReceiverStorage.new()
    console.log("receiverStorage: ", receiverStorage.address)

    //Ethereum
    mockTellor= await MockTellor.new(accts, [web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000")])
    console.log("mockTellor: ", mockTellor.address)

    mockSender = await MockSender.new() //replace with Matic Sender address
    console.log("mockSender: ", mockSender.address)
  	
    sender = await Sender.new(mockTellor.address, mockSender.address, receiverStorage.address) 
    console.log("sender: ", sender.address)

    //Matic
    centralizedOracle = await CentralizedOracle.new(receiverStorage.address, owner, oracle,web3.utils.toWei("10"))
    console.log("centralizedOracle: ", centralizedOracle.address)

    usingTellor = await UsingTellor.new(centralizedOracle.address)
    console.log("usingTellor: ", usingTellor.address)


}