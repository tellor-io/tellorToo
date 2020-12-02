/*****************Ethereum Sender Deployment*****************************************************/

//                Deploy Mainnet Ethereum and Matic                                       //

/*****************************************************************************************/
const TellorPlayground = artifacts.require('./TellorPlayground')
const UsingTellor = artifacts.require('./UsingTellor')
const MockSender = artifacts.require("./MockSender")
const TellorSender = artifacts.require('./TellorSender')
const ReceiverStorage = artifacts.require('./ReceiverStorage')
const TellorToo = artifacts.require('./TellorToo')

//from migrations
//Ethereum contract address
tellorMaster = '0x0Ba45A8b5d5575935B8158a88C631E9F9C95a2e5';

//Matic contract address
//documentation may be outdated since their test net is goerli and not ropsten
//verify matic's stateSender before deploying to mainnet Ethereum
//https://docs.matic.network/docs/develop/advanced/transfer-data/
maticStateSender = '0xfB631F5A239A5B651120335239CC19aEbCb185e6'; 

//CentralizedOracle Owner and oracle
owner = ''
oracle = ''


module.exports =async function(callback) {
    let tellorSender
    let receiverStorage

    /***STEP 1: Deploy ReceiverStorage on Matic and take the address to update maticReceiver var below**/
    //  //Matic  or Mumbai
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network mumbai
    receiverStorage = await ReceiverStorage.new()
    console.log("receiverStorage: ", receiverStorage.address)

    tellorToo = await TellorToo.new(receiverStorage.address, owner, oracle,web3.utils.toWei("10"))
    console.log("TellorToo: ", tellorToo.address)

    //usingTellor = await UsingTellor.new(centralizedOracle.address)
    //console.log("usingTellor: ", usingTellor.address)

    /*******UPDATE with deployment*****************************/
    //receiverStorage = '???'
    /*******UPDATE maticReceiver var with deployment**************/

    /***STEP 2: Deploy sender contract on Ethereum or Ethereum testnet********/
    // //Ethereum-(Matic's  sender: ???)
    // //truffle exec scripts/03_Staging_Matic_Ethereum.js --network mainnet


    // tellorSender = await Sender.new(tellorMaster, maticStateSender, receiverStorage) 

    // console.log("Mainnet sender: ", tellorSender.address)
    // console.log("Mainnet maticStateSender: ", maticStateSender)
    // console.log("Matic receiverStorage: ", receiverStorage)

}