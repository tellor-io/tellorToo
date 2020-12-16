/**************************Matic Auto data feed********************************************/

//                Centralized oracle price feed                                   //

/******************************************************************************************/
//truffle exec scripts/06_MaticMumbaiCentralizedOraclefeed.js --network mumbai
require("dotenv").config();

const TellorToo = artifacts.require('./TellorToo')

var fs = require('fs');
const fetch = require('node-fetch-polyfill');
const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");

//const matic_accessToken = process.env.MATIC_ACCESS_TOKEN
const mumbai_pk = process.env.MUMBAI_MATIC_PK

//var web3 = new Web3(new HDWalletProvider(mumbai_pk, "https://rpc-mumbai.maticvigil.com/v1/" + matic_accessToken));
var web3 = new Web3(new HDWalletProvider(mumbai_pk, `https://rpc-mumbai.matic.today`));

var tellorTooAddress = '0xbac0B75F2F5f34bbFC89F3A820cFDf7bEB677F7a'
var _UTCtime  = new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
console.log("_UTCtime: ", _UTCtime)

//const URL1 = `https://www.etherchain.org/api/gasPriceOracle`;
//const URL2 = 'https://gasstation-mainnet.matic.network'
//Function to get gas price
async function fetchGasPrice() {
  const URL = `https://www.etherchain.org/api/gasPriceOracle`;
  //const URL = 'https://gasstation-mainnet.matic.network';
  try {
    const fetchResult = fetch(URL);
    const response = await fetchResult;
    const jsonData = await response.json();
    const gasPriceNow = await jsonData.standard*1;
    const gasPriceNow2 = await (gasPriceNow + 1)*1000000000;
    //console.log(jsonData);
    //console.log("gasPriceNow", gasPriceNow);
    //console.log("gasPriceNow2", gasPriceNow2);
    return(gasPriceNow2);
  } catch(e){
    throw Error(e);
  }
}



//url and jsonData.${expression}
//function that pulls data from API
async function fetchPrice(URL, pointer, currency) {

  //var test = `jsonData.${pointer}`;
  try {
    const fetchResult = fetch(URL);
    const response = await fetchResult;
    //console.log("response", response);
    const jsonData = await response.json();
    console.log(jsonData);
    const priceNow = await jsonData[pointer][currency];
    console.log(priceNow);
    const priceNow2 = await (priceNow*1000000) | 0;
    return(priceNow2);
  } catch(e){
    throw Error(e);
  }
}

var dataAPIs = ['https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd',
           'https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd',
           'https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd',
           'https://api.coingecko.com/api/v3/simple/price?ids=tellor&vs_currencies=usd'
           ]
var pointers = ["bitcoin", "ethereum","matic-network", "tellor" ]
var currency = ["usd", "usd", "usd","usd"]
var requestIds = [1,2,31,50]


module.exports =async function(callback) {
    try{
    var gasP = await fetchGasPrice();
    console.log("gasP", gasP);
    } catch(error){
        console.error(error);
        console.log("no gas price fetched");
        process.exit(1)
    }

    var k = dataAPIs.length;
    for (i=0; i<k; i++){
    try{
        let dat
        let point
        let cur
        let req
        let apiPrice
        let co
        let timestamp
        let rdat
        let rdat1

        dat = dataAPIs[i]
        point = pointers[i]
        cur = currency[i]
        req = requestIds[i]
        apiPrice = await fetchPrice(dat, point, cur)
        console.log("apiPrice", apiPrice)
        timestamp = (Date.now())/1000 | 0
        console.log(timestamp)
        //send update to centralized oracle
        co = await TellorToo.at(tellorTooAddress)
        await co.submitData(req, timestamp, apiPrice)
        rdat = await co.retrieveData(req, timestamp);
        console.log(rdat*1)
        rdat1 = rdat*1
        if (apiPrice == rdat1) {
            console.log("Data is on chain, save a copy")
        //save entry on txt file/json
        let saving  = "requestId" + i;
            saving = {Id: i,
                    time: timestamp,
                    value: apiPrice,
                    desc: point & "/" & cur,
                    api: dat
                }
            let jsonName = JSON.stringify(saving);
            console.log("InitialReqID info", jsonName);
            let filename = "./savedData/MaticMumbaireqID" + i + ".json";
            fs.writeFile(filename, jsonName, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }

    } catch(error){
        console.error(error);
        console.log("no price fetched");
        process.exit(1)
    }
    }

    process.exit()

}
