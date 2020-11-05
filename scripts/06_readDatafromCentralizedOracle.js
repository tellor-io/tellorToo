/*****************Read data from centralized oracle***********************/

//                tesst Enve Matic Network                                     //

/******************************************************************************************/
var fs = require('fs');
const fetch = require('node-fetch-polyfill');
const CentralizedOracle = artifacts.require('./CentralizedOracle')



const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");
var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", `https://rpc-mumbai.matic.today`));

var centralizedOracleAddress = '0xB99FFb1009504fbfcadC442930E2D652e3BB63c9'
var _UTCtime  = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');


 module.exports =async function(callback) {

// 	  let centralizedOracle
      
 	  centralizedOracle = await CentralizedOracle.at(centralizedOracleAddress)

 	  let eth = await centralizedOracle.retrieveData(1,1604599000)
 	  console.log("eth", eth)
 	  let btc = await centralizedOracle.retrieveData(2,1604598506)
 	  console.log("btc", btc)
 	  let matic = await centralizedOracle.retrieveData(31,1604602312)
 	  console.log("matic", matic)
 	  let trb = await centralizedOracle.retrieveData(50,1604602466)
 	  console.log("trb", trb)
 	  
      process.exit()

 }