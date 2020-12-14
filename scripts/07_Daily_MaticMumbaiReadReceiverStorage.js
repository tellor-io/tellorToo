/**************************Matic Auto data feed********************************************/

//                Receiver contract price getter                                   //

/******************************************************************************************/
//truffle exec scripts/08_MaticMumbaiReadReceiverStorage.js --network mumbai
require("dotenv").config();

const ReceiverStorage = artifacts.require('./ReceiverStorage')

var fs = require('fs');
const fetch = require('node-fetch-polyfill');
const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");

const matic_accessToken = process.env.MATIC_ACCESS_TOKEN
const mumbai_pk = process.env.MUMBAI_MATIC_PK

var web3 = new Web3(new HDWalletProvider(mumbai_pk, "https://rpc-mumbai.maticvigil.com/v1/" + matic_accessToken));


var receiverStorageAddress = '0xDc09952CB01c2da363F53fC8eC958895b6ab86F3'
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
        let rs
        let timestamp
        let rdat
        let rdat1

        dat = dataAPIs[i]
        point = pointers[i]
        cur = currency[i]
        req = requestIds[i]
        apiPrice = await fetchPrice(dat, point, cur)
        console.log("apiPrice", apiPrice)

        //send update to centralized oracle
        rs = await ReceiverStorage.at(receiverStorageAddress)
        rdat = await rs.retrieveLatestValue(req);
        console.log("data on receiver storage: ",  rdat[1]*1)
        //rdat1 = rdat*1
        // if (apiPrice == rdat1) {
        //     console.log("Data is on chain, save a copy")
        // //save entry on txt file/json
        // let saving  = "requestId" + i;
        //     saving = {Id: i,
        //             time: timestamp,
        //             value: apiPrice,
        //             desc: point & "/" & cur,
        //             api: dat
        //         }
        //     let jsonName = JSON.stringify(saving);
        //     console.log("InitialReqID info", jsonName);
        //     let filename = "./savedData/MaticMumbaireqID" + i + ".json";
        //     fs.writeFile(filename, jsonName, function(err) {
        //         if (err) {
        //             console.log(err);
        //         }
        //     });
        // }

    } catch(error){
        console.error(error);
        console.log("no price fetched");
        process.exit(1)
    }
    }

    process.exit()

}
