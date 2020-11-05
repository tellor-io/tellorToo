/*****************Run Manual data push to centralized oracle***********************/

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

 	  let centralizedOracle
      
 	  centralizedOracle = await CentralizedOracle.at(centralizedOracleAddress)
 	  
 	 await centralizedOracle.newDataset( 1,  3600)
 	 console.log('new dat', 1)
 	 await centralizedOracle.newDataset( 2,  3600)
 	 console.log('new dat', 2)
 	 await centralizedOracle.newDataset( 31,  3600)
 	 console.log('new dat', 31)
 	 await centralizedOracle.newDataset( 50,  3600)
 	 console.log('new dat', 50)



 	  // await centralizedOracle.submitData(1,1604599000, 411350000)
 	  // console.log("eth gone")
 	  // await centralizedOracle.submitData(2,1604598506, 15099550000)
 	  // console.log("btc gone")
 	  // await centralizedOracle.submitData(31,1604602312, 12981)
 	  // console.log("matic gone")
 	  // await centralizedOracle.submitData(50,1604602466, 21310000)
 	  // console.log("trb gone")

      process.exit()

 }