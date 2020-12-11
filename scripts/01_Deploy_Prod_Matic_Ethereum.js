/*****************Ethereum Deployment*****************************************************/

//                Deploy on Ethereum and Matic testnet                                            //

/*****************************************************************************************/


const UsingTellor = artifacts.require('./UsingTellorToo')
const TellorSender = artifacts.require('./TellorSender')
const ReceiverStorage = artifacts.require('./ReceiverStorage')
const TellorToo = artifacts.require('./TellorToo')

//link to contracts for matic
//https://github.com/maticnetwork/static/blob/master/network/mainnet/v1/index.json

const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");

//mainnet Ethereum
var maticStateSender = '0x28e4F3a7f651294B9564800b2D01f35189A5bFbE'
var tellorMasterAddress = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5'

//const mnemonic = process.env.ETH_MNEMONIC;
const accessToken = process.env.WEB3_INFURA_PROJECT_ID
const matic_accessToken = process.env.MATIC_ACCESS_TOKEN
const pk_mainnet = process.env.ETH_PK
const matic_pk = process.env.MATIC_PK

//var web3 = new Web3(new HDWalletProvider(matic_pk, "https://rpc-mumbai.maticvigil.com/v1/" + matic_accessToken));
var web3 = new Web3(new HDWalletProvider(pk, "https://goerli.infura.io/v3/" + accessToken));

// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }

module.exports =async function(callback) {


  let usingTellorToo
  let tellorsender
  let receiverStorage
  let tellorToo
  let oracle
  let owner

    owner = '0xe7AfE96d50e44837134ce6DDA16d524ba5033d90'
    oracle = '0xe7AfE96d50e44837134ce6DDA16d524ba5033d90'


    /***STEP 1: Deploy ReceiverStorage on Matic and take the address to update maticReceiver var below**/
    //  //Matic  or Mumbai
    // //truffle exec scripts/03_3Prod_Matic_Ethereum.js --network matic
    receiverStorage = await ReceiverStorage.new()
    console.log("receiverStorage: ", receiverStorage.address)

    tellorToo = await TellorToo.new(receiverStorage.address, owner, oracle,web3.utils.toWei("1000"))
    console.log("TellorToo: ", tellorToo.address)

    //usingTellorToo = await UsingTellorToo.new(tellorToo.address)
    //console.log("usingTellorToo: ", usingTellor.address)

    /*******UPDATE with deployment*****************************/
    //receiverStorage = ''
    /*******UPDATE maticReceiver var with deployment**************/

    /***STEP 2: Deploy sender contract on Ethereum or Ethereum testnet********/
    // //Ethereum
    // //truffle exec scripts/03_3Prod_Matic_Ethereum.js --network mainnet

    // tellorSender = await TellorSender.new(tellorMasterAddress, maticStateSender, receiverStorage) 

    // console.log("Mainnet sender: ", tellorsender.address)
    // console.log("Mainnet maticStateSender: ", maticStateSender)
    // console.log("Matic receiverStorage: ", receiverStorage)


}