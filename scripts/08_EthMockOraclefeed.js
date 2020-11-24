
/**************************Matic Auto data feed********************************************/

//                Centralized oracle price feed                                   //

/******************************************************************************************/
const MockTellor = artifacts.require('./MockTellor')
const Sender = artifacts.require('./Sender')

var fs = require('fs');
const fetch = require('node-fetch-polyfill');
const Web3 = require('web3')
var HDWalletProvider = require("@truffle/hdwallet-provider");
//var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", `https://rpc-mumbai.matic.today`));
var web3 = new Web3(new HDWalletProvider("12ae9e5a8755e9e1c06339e0de36ab4c913ec2b30838d2826c81a5f5b848adef", "https://goerli.infura.io/v3/7f11ed6df93946658bf4c817620fbced"));

var senderAddress = '0x09c5c2673D74aAf34005da85Ee50cE5Ff6406921'
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
    for (i=1; i<k; i++){
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

        dat = dataAPIs[i]
        point = pointers[i]
        cur = currency[i]
        req = requestIds[i]
        apiPrice = await fetchPrice(dat, point, cur)
        console.log("apiPrice", apiPrice)
        timestamp = (Date.now())/1000 | 0
        console.log(timestamp)
        //send update to centralized oracle
        mo = await MockTellor.at(mockTellorAddress)
        await mo.submitValue(req, apiPrice)
        rdat = await mo.retrieveData(req, timestamp);
        console.log(rdat*1)
        rdat1 = rdat*1

        send = await Sender.at(senderAddress)
        await send.getCurrentValueAndSend(req)



        if (dat == rdat1) {
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
            let filename = "./savedData/reqID" + i + ".json";
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
