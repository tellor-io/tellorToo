/**************************Matic Auto data feed********************************************/

//                Centralized oracle price feed                                   //

/******************************************************************************************/
const CentralizedOracle = artifacts.require('./CentralizedOracle')

var fs = require('fs');
const fetch = require('node-fetch-polyfill');
const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");
//var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", `https://rpc-mumbai.matic.today`));
var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", "https://goerli.infura.io/v3/7f11ed6df93946658bf4c817620fbced"));

var centralizedOracleAddress = '0xB99FFb1009504fbfcadC442930E2D652e3BB63c9'
var _UTCtime  = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
console.log("_UTCtime: ", _UTCtime)


//Function to get gas price
async function fetchGasPrice() {
  const URL = `https://www.etherchain.org/api/gasPriceOracle`;
  try {
    const fetchResult = fetch(URL);
    const response = await fetchResult;
    const jsonData = await response.json();
    const gasPriceNow = await jsonData.standard*1;
    const gasPriceNow2 = await (gasPriceNow + 1)*1000000000;
    console.log(jsonData);
    //console.log("gasPriceNow", gasPriceNow);
    //console.log("gasPriceNow2", gasPriceNow2);
    return(gasPriceNow2);
  } catch(e){
    throw Error(e);
  }
}

//url and jsonData.${expression}
//function that pulls data from API
async function fetchPrice() {
  var URL = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`;
  var pointer = "ethereum";
  var test = "usd";
  //var test = `jsonData.${pointer}`;
  try {
    const fetchResult = fetch(URL);
    const response = await fetchResult;
    //console.log("response", response);
    const jsonData = await response.json();
    console.log(jsonData);
    const priceNow = await jsonData[pointer][test];
    console.log(priceNow);
    //const priceNow2 = await (priceNow/1000000);
    //console.log(jsonData);
    //console.log("gasPriceNow", gasPriceNow);
    //console.log("gasPriceNow2", gasPriceNow2);
    //return(gasPriceNow2);
    return(priceNow);
  } catch(e){
    throw Error(e);
  }
}



module.exports =async function(callback) {
    try{
    var gasP = await fetchGasPrice();
    console.log("gasP", gasP);
    } catch(error){
        console.error(error);
        console.log("no gas price fetched");
    }


    try{
    var apiPrice = await fetchPrice();
    console.log("apiPrice", apiPrice);
    } catch(error){
        console.error(error);
        console.log("no price fetched");
    }
    process.exit()

}
