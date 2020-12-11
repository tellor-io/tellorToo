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


//var web3 = new Web3(new HDWalletProvider(mumbai_pk, "https://rpc-mumbai.maticvigil.com/v1/" + matic_accessToken));
var web3 = new Web3(new HDWalletProvider(pk_test, "https://goerli.infura.io/v3/" + accessToken));

//goerli
var maticStateSender = '0xEAa852323826C71cd7920C3b4c007184234c3945'



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

    owner = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'
    oracle = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'


    /***STEP 1: Deploy ReceiverStorage on Matic and take the address to update maticReceiver var below**/
    //  //Matic  or Mumbai
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network mumbai
    // receiverStorage = await ReceiverStorage.new()
    // console.log("receiverStorage: ", receiverStorage.address)

    // tellorToo = await TellorToo.new(receiverStorage.address, owner, oracle,web3.utils.toWei("10"))
    // console.log("TellorToo: ", tellorToo.address)


    /*******UPDATE with deployment*****************************/
    receiverStorage = '0x5D23896dE4F692d71DEA4D67A580EDcAD18b8112'
    /*******UPDATE maticReceiver var with deployment**************/

    /***STEP 2: Deploy MockTellor and sender contract on Ethereum or Ethereum testnet********/
    // //Ethereum-Goerli or ropsten (Matic's ropstend sender: 0x22E1f5aa1BA9e60527250FFeb35e30Aa2913727f)
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network goerli

    mockTellor= await TellorPlayground.new(accts, [web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000")])
    console.log("mockTellor: ", mockTellor.address)
    console.log("Goerli maticStateSender1: ", maticStateSender)
    console.log("mumbai receiverStorage1: ", receiverStorage)
  	
    tellorSender = await TellorSender.new(mockTellor.address, maticStateSender, receiverStorage) 
/*    let mockTelloraddress = "0x7d75b5e148fD47B8BacA8eBAf2EC97554c31Eb04"
   tellorSender = await TellorSender.new(mockTelloraddress, maticStateSender, receiverStorage) 
   */
    console.log("Goerli TellorSender: ", tellorSender.address)
    console.log("Goerli maticStateSender: ", maticStateSender)
    console.log("mumbai receiverStorage: ", receiverStorage)


}