/*****************Matic test deployment*****************************************************/

//                Deploy Test Tellor on Matic Network                                     //

/******************************************************************************************/

const TellorPlayground = artifacts.require('./TellorPlayground')
const UsingTellor = artifacts.require('./UsingTellor')
const TellorSender = artifacts.require('./TellorSender')
const ReceiverStorage = artifacts.require('./ReceiverStorage')
const TellorToo = artifacts.require('./TellorToo')

const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");

const matic_accessToken = process.env.MATIC_ACCESS_TOKEN
const mumbai_pk = process.env.MUMBAI_MATIC_PK
const mumbai_pub = process.env.MUMBAI_MATIC_PUB

var web3 = new Web3(new HDWalletProvider(mumbai_pk, "https://rpc-mumbai.maticvigil.com/v1/" + matic_accessToken));

// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }

module.exports =async function(callback) {

  let mockTellor
  let usingTellor
  let tellorSender
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

    owner = mumbai_pub
    oracle = mumbai_pub

    receiverStorage = await ReceiverStorage.new()
    console.log("receiverStorage: ", receiverStorage.address)

    mockTellor= await TellorPlayground.new(accts, [web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000")])
    console.log("mockTellor: ", mockTellor.address)

    mockSender = await MockSender.new();
    console.log("mockSender: ", mockSender.address)
  	
    tellorSender = await TellorSender.new(mockTellor.address, mockSender.address, receiverStorage.address) 
    console.log("tellorsender: ", tellorSender.address)

    tellorToo = await TellorToo.new(receiverStorage.address, owner, oracle,web3.utils.toWei("10"))
    console.log("centralizedOracle: ", TellorToo.address)

    //usingTellor = await UsingTellor.new(centralizedOracle.address)
    //console.log("usingTellor: ", usingTellor.address)

    process.exit()
}