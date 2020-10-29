/*****************Matic test deployment*****************************************************/

//                Deploy Test Tellor on Matic Network                                     //

/******************************************************************************************/

const MockTellor = artifacts.require('MockTellor.sol')
const UsingTellor = artifacts.require('UsingTellor.sol')

const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");
var web3 = new Web3(new HDWalletProvider("3a10b4bc1258e8bfefb95b498fb8c0f0cd6964a811eabca87df5630bcacd7216", `https://rpc-mumbai.matic.today`));


// const Web3 = require('web3')
// const Network = require("@maticnetwork/meta/network")

// const network = new Network ('testnet', 'v3')

// const main = new Web3(network.Main.RPC)
// const matic = new Web3 (network.Matic.RPC)

// let privateKey = `0x12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef`
// matic.eth.accounts.wallet.add(privateKey)
// main.eth.accounts.wallet.add(privateKey)


const MockSender = artifacts.require("./MockSender.sol")
const ReceiverStorage = artifacts.require("./ReceiverStorage.sol")
const CentralizedOracle = artifacts.require("./CentralizedOracle.sol") 


// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }

module.exports =async function(callback) {

  let mockTellor
  let mockSender
  let usingTellor
  let sender
  let receiverStorage
  let centralizedOracle

    mockTellor= await MockTellor.new([accounts[0], accounts[1],accounts[2],accounts[3],accounts[4]], [5000,5000,5000,5000,5000])
    console.log("mockTellor: ", mockTellor.address)

    mockSender = await MockSender.new();
    console.log("mockSender: ", mockSender.address)

    receiverStorage = await ReceiverStorage.new()
    console.log("receiverStorage: ", receiverStorage.address)
  	
    sender = await Sender.new(mockTellor.address, mockSender.address, receiverStorage.address) 
    console.log("sender: ", sender.address)

    centralizedOracle = await CentralizedOracle.new(receiverStorage.address, accounts[0], accounts[0],web3.utils.toWei("10"))
    console.log("centralizedOracle: ", centralizedOracle.address)

    usingTellor = await UsingTellor.new(centralizedOracle.address)
    console.log("usingTellor: ", usingTellor.address)


}