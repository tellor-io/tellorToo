/*****************Ethereum Deployment*****************************************************/

//                Deploy on Ethereum and Matic testnet                                            //

/*****************************************************************************************/

const MockTellor = artifacts.require('./MockTellor')
const UsingTellor = artifacts.require('./UsingTellor')
const MockSender = artifacts.require("./MockSender")
const Sender = artifacts.require('./Sender')
const ReceiverStorage = artifacts.require('./ReceiverStorage')
const CentralizedOracle = artifacts.require('./CentralizedOracle')

//link to contracts for matic
//https://github.com/maticnetwork/static/blob/master/network/mainnet/v1/index.json

const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");

//mainnet Ethereum
var maticStateSender = '0x28e4F3a7f651294B9564800b2D01f35189A5bFbE'
var tellorMasterAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5'

var web3 = new Web3(new HDWalletProvider("", `https://rpc-mainnet.maticvigil.com/v1/a5e55a186479f268d9f0ce74541191c3082877b6`));
//var web3 = new Web3(new HDWalletProvider("", "https://mainnet.infura.io/v3/7f11ed6df93946658bf4c817620fbced"));


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

    owner = '0xe7AfE96d50e44837134ce6DDA16d524ba5033d90'
    oracle = '0xe7AfE96d50e44837134ce6DDA16d524ba5033d90'


    /***STEP 1: Deploy ReceiverStorage on Matic and take the address to update maticReceiver var below**/
    //  //Matic  or Mumbai
    // //truffle exec scripts/03_3Prod_Matic_Ethereum.js --network matic
    receiverStorage = await ReceiverStorage.new()
    console.log("receiverStorage: ", receiverStorage.address)

    centralizedOracle = await CentralizedOracle.new(receiverStorage.address, owner, oracle,web3.utils.toWei("1000"))
    console.log("centralizedOracle: ", centralizedOracle.address)

    usingTellor = await UsingTellor.new(centralizedOracle.address)
    console.log("usingTellor: ", usingTellor.address)

    /*******UPDATE with deployment*****************************/
    //receiverStorage = ''
    /*******UPDATE maticReceiver var with deployment**************/

    /***STEP 2: Deploy MockTellor and sender contract on Ethereum or Ethereum testnet********/
    // //Ethereum
    // //truffle exec scripts/03_3Prod_Matic_Ethereum.js --network mainnet

    // sender = await Sender.new(tellorMasterAddress, maticStateSender, receiverStorage) 

    // console.log("Mainnet sender: ", sender.address)
    // console.log("Mainnet maticStateSender: ", maticStateSender)
    // console.log("Matic receiverStorage: ", receiverStorage)


}