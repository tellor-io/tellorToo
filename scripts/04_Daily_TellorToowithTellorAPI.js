/*****************Tellor Too and Tellor API*****************************************************/

//                Feed Data from Tellor's API to Tellor too                                     //
//******** work in progress**************//
/******************************************************************************************/
var fs = require('fs');
const fetch = require('node-fetch-polyfill');
const TellorToo = artifacts.require('./TellorToo')



const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");

const matic_accessToken = process.env.MATIC_ACCESS_TOKEN
const mumbai_pk = process.env.MUMBAI_MATIC_PK

var web3 = new Web3(new HDWalletProvider(mumbai_pk, "https://rpc-mumbai.maticvigil.com/v1/" + matic_accessToken));

var TellorTooAddress = '0xB99FFb1009504fbfcadC442930E2D652e3BB63c9'
var _UTCtime  = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');

var tellorAPIs = ['http://api.tellorscan.com/price/1', 
				'http://api.tellorscan.com/price/2', 
				'http://api.tellorscan.com/price/31',
        'http://api.tellorscan.com/price/50']
var num1 = tellorAPIs.length;
var test = `http://api.tellorscan.com/price/1`
//{"didGet":true,"value":"397380000","timestampRetrieved":"1604508720"}


var dataAPIs = ['json(https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd).bitcoin.usd',
			  'json(https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd).ethereum.usd',
			  'json(https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd).matic-network.usd',
			  'json(https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd).tellor.usd'
			  ]

var dat = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
var pars = 'bitcoin.usd'
console.log('dat', dat)
// https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd
// {"bitcoin":{"usd":14094.62}}
var num2 = dataAPIs.length;
console.log('num2', num2)

var apitest = 'http://api.tellorscan.com/price/1'

// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }

var  url1 = "http://api.tellorscan.com/price/1";
async function fetchPrice(URL) {
  
  //cosnt URL = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd`;
  console.log(1)
 // try {
  	
    const fetchResult =  fetch(URL);
    console.log(2)
    
    const response = await fetchResult;
    console.log(3, response)
    const jsonData = await response.json();
    console.log(4)
    console.log(jsonData);
    //const priceNow = await jsonData.bitcoin.usd*1;
     const priceNow = await jsonData.value*1;
    const priceNow2 = await priceNow *1000000;
    console.log(jsonData);
    console.log("gasPriceNow", gasPriceNow);
    console.log("gasPriceNow2", gasPriceNow2);
    return(priceNow2);
  // } catch(e){
  //   throw Error(e);
  // }
}





// //const API = `https://www.etherchain.org/api/gasPriceOracle`;
// async function fetchTellorPrice(URL) {
    
//   try {
//   	await URL
//     const fetchResult = fetch(URL);
//     const response = await fetchResult;
//     const jsonData = await response.json();
//     const tellorPriceNow = await jsonData.value*1;
//     console.log(jsonData);
//     //console.log("gasPriceNow", gasPriceNow);
//     return(tellorPriceNow);
//   } catch(e){
//     throw Error(e);
//   }
// }


// async function fetchTellorPrice2(URL) {
//    let fetchResult
//    let response
//    let jsonData
//    let tellorPriceNow
//   try {
//   	await URL
//     await fetchResult = fetch(URL);
//     await response = await fetchResult;
//     await jsonData = await response.json();
//     await tellorPriceNow = await jsonData.value*1;
//     console.log(jsonData);
//     //console.log("tellorPriceNow", tellorPriceNow);
//     return(tellorPriceNow);
//   } catch(e){
//     throw Error(e);
//   }
// }


// async function fetchPrice(URL) {
 
//   try {
//   	  await URL
//       const fetchResult = fetch(URL);
//       console.log('fetchResult', fetchResult)
//       const response = await fetchResult;
//       console.log('response',response)
//       const jsonData = await response.json();
//       console.log(jsonData);
//       const priceNow = await jsonData.pars*1;
//       const priceNow2 = await (priceNow)*1000000;
      
//       console.log("priceNow", priceNow);
//       console.log("priceNow2", priceNow2);
//       return(priceNow2);
//      } catch(e){
//      throw Error(e);
//      }
//   }  
//for (i; num2; i++) {

 module.exports =async function(callback) {

// 	  let centralizedOracle
      
// 	  centralizedOracle = await CentralizedOracle.at(centralizedOracleAddress)
// 	  await centralizedOracle.submitData(uint256 _requestId, uint256 _timestamp, uint256 _value)


//fetchPrice(dataAPIs)

//fetchPrice(dat)
//fetchTellorPrice2(tes2)
//fetchTellorPrice(test)
fetchPrice(url1)
      process.exit()

 }