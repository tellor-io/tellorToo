/*****************Ethereum Deployment*****************************************************/

//                Deploy Test Using Tellor on Ethereum TestNet and Matic testnet                                            //

/*****************************************************************************************/

const TellorPlayground = artifacts.require('./TellorPlayground')
const UsingTellor = artifacts.require('./UsingTellor')
const TellorSender = artifacts.require('./TellorSender')
const ReceiverStorage = artifacts.require('./ReceiverStorage')
const TellorToo = artifacts.require('./TellorToo')


require("dotenv").config();
const Web3 = require('web3')
const HDWalletProvider = require("@truffle/hdwallet-provider");

//const mnemonic = process.env.ETH_MNEMONIC;
const accessToken = process.env.WEB3_INFURA_PROJECT_ID
const matic_accessToken = process.env.MATIC_ACCESS_TOKEN
const pk_test = process.env.RINKEBY_ETH_PK
const mumbai_pk = process.env.MUMBAI_MATIC_PK
const rinkeby_pub = process.env.RINKEBY_ETH_PUB

//https://rpc-mumbai.matic.today
//var web3 = new Web3(new HDWalletProvider(mumbai_pk, "https://rpc-mumbai.maticvigil.com/v1/" + matic_accessToken));
//var web3 = new Web3(new HDWalletProvider(mumbai_pk, "https://rpc-mumbai.matic.today"));
var web3 = new Web3(new HDWalletProvider(pk_test, "https://goerli.infura.io/v3/" + accessToken));

//goerli
var maticStateSender = '0xEAa852323826C71cd7920C3b4c007184234c3945'
var tellorPlaygroundAddress = '0x20374E579832859f180536A69093A126Db1c8aE9'



// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }

module.exports =async function(callback) {

  let mockTellor
  let usingTellor
  let tellorSender
  let receiverStorage
  let tellorToo
  let accts
  let oracle
  let owner
  let maticReceiver

    accts = ['0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3', 
         '0x353E6a85E6A74b7a1C287d11dA1aA091Fbdd7F34',
         '0x52ce8b3Cdf8719aC69DcE22B9Ee23e24EBE0A00c',
         '0x8bC54c696d9F912037689CE04109B007a9b15aD8',
         '0x84005BA16a117Ac1B94da7a7FdaF6882f82EA3F5']

    owner = rinkeby_pub
    oracle = rinkeby_pub


    /***STEP 1: Deploy ReceiverStorage on Matic and take the address to update maticReceiver var below**/
    //  //Matic  or Mumbai
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network mumbai
    // receiverStorage = await ReceiverStorage.new()
    // console.log("receiverStorage: ", receiverStorage.address)

    // tellorToo = await TellorToo.new(receiverStorage.address, owner, oracle,web3.utils.toWei("10"))
    // console.log("TellorToo: ", tellorToo.address)


    /*******UPDATE with deployment*****************************/
    receiverStorage = '0x73C04c3a8680bE6d680C39F7B3210b1246AeA1D5'
    /*******UPDATE maticReceiver var with deployment**************/

    /***STEP 2: Deploy MockTellor and sender contract on Ethereum or Ethereum testnet********/
    // //Ethereum-Goerli or ropsten (Matic's ropstend sender: 0x22E1f5aa1BA9e60527250FFeb35e30Aa2913727f)
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network goerli
    tellorSender = await TellorSender.new(tellorPlaygroundAddress, maticStateSender, receiverStorage) 
    console.log("Goerli TellorSender: ", tellorSender.address)


    // try {
    // mockTellor= await TellorPlayground.at(tellorPlaygroundAddress)
    // // for(var i=0;i<=4;i++){
    // // await mockTellor.mint(accts[i],web3.utils.toWei("5000"))
    // // consle.log("acct", i, accts[i])
    // // }
    // console.log("mockTellor: ", mockTellor.address)
    // await mockTellor.faucet(accts[0])
    // } catch {
    //   console.log("TellorPlayground not instantiated")
    //   process.exit(1)
    // }
    console.log("tellorPlaygroundAddress", tellorPlaygroundAddress)
    console.log("Goerli maticStateSender: ", maticStateSender)
    console.log("mumbai receiverStorage: ", receiverStorage)
  	




process.exit()
}