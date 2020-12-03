
/**************************Goerli TellorPlayground Auto data feed********************************************/

//                Goerli MockTellor Feed and send data to Matic                                  //

/******************************************************************************************/
//truffle exec scripts/07_EthMockOracleFeed.js --network goerli
 require("dotenv").config();
 const pk = process.env.PRIVATE_KEY;

const TellorPlayground = artifacts.require('./TellorPlayground')
const TellorSender = artifacts.require('./TellorSender')

var fs = require('fs');
const fetch = require('node-fetch-polyfill');
const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");
var web3 = new Web3(new HDWalletProvider(pk, "https://goerli.infura.io/v3/7f11ed6df93946658bf4c817620fbced"));

var tellorSenderAddress = '0x09c5c2673D74aAf34005da85Ee50cE5Ff6406921'
//tellorPlayground = 0x20374E579832859f180536A69093A126Db1c8aE9
var mockTellorAddress = '0x6DAdBde8Ad5F06334A7871e4da02698430c754FF'
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
    }

    var k = dataAPIs.length;
    for (i=0; i<k; i++){
      try{
        let dat
        let point
        let cur
        let req
        let apiPrice
        let mo
        let timestamp
        let rdat
        let rdat1
        let send
        let res

        dat = dataAPIs[i]
        point = pointers[i]
        cur = currency[i]
        req = requestIds[i]
        apiPrice = await fetchPrice(dat, point, cur)
        console.log("apiPrice", apiPrice)

        //send update to centralized oracle
        mo = await TellorPlayground.at(mockTellorAddress)
        await mo.submitValue(req, apiPrice)


        send = await TellorSender.at(tellorSenderAddress)
        value = await send.getCurrentValue(req)
        console.log(value[1]*1)
        value1 = value[1]*1


        await send.getCurrentValueAndSend(req);
        console.log("value sent")

        if (apiPrice == value1) {
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
            let filename = "./savedData/EthGoerlireqID" + i + ".json";
            fs.writeFile(filename, jsonName, function(err) {
                if (err) {
                    console.log(err);
                }
            });
        }
      } catch(error){
        console.error(error);
        console.log("no price fetched");
      }
    }

    process.exit()

}
