# TellorToo

TellorToo, allows users to access numerical data with the option to challenge the validity of any data point with proof from Tellor's decentralized oracle on Ethereum's mainnet.

## Getting data
Get data on your smart contract by reading from TellorToo by calling the function a single function:

* getCurrentValue

```Solidity
getCurrentValue(uint256 _requestId)
```

Here is the list with the definitions of each requestId:
[https://docs.tellor.io/dev-documentation/reference-page/data-request-ids-1](https://docs.tellor.io/dev-documentation/reference-page/data-request-ids-1)


If the data needed is not available, please submit a Tellor Improvement Plan[(TIP)](https://github.com/tellor-io/TIPs) to have your data supported. 


### Code example

Allow your contract to read from TellorToo


```solidity
import "./TellorToo.sol";

contract YourContract is TellorToo {
    TellorToo tellor;

    /*Constructor*/
    /**
    * @dev the constructor sets the storage address and owner
    * @param _tellor is the TellorToo address
    */
    constructor(address payable _TellorToo) public {
        tellor = TellorToo(_TellorToo);
    }
    
    /**
    * @dev Allows the user to get the latest value for the requestId specified
    * @param _requestId is the requestId to look up the value for
    * @return ifRetrieve bool true if it is able to retreive a value, the value, and the value's timestamp
    * @return value the value retrieved
    * @return _timestampRetrieved the value's timestamp
    */
    function getCurrentValue(uint256 _requestId) public view returns (bool ifRetrieve, uint256 value, uint256 _timestampRetrieved) {
        return tellor.getCurrentValue(_requestId);
    }

}
```

## Addresses

Mainnets:
* Matic TellorToo :  [0x77352E8f026cb5D880AcFe06F9Acc215E0711F85](
https://explorer-mainnet.maticvigil.com/address/0x77352E8f026cb5D880AcFe06F9Acc215E0711F85/contracts)

* Ethereum TellorSender:  [0xb9516057dc40c92f91b6ebb2e3d04288cd0446f1](
https://etherscan.io/address/0xb9516057dc40c92f91b6ebb2e3d04288cd0446f1#code)

Testnets:
* Mumbai (Matic's testnet) TellorToo :  [0xBf8a66DeC65A004B6D89950079B66013A4ac9f0D](
https://explorer-mumbai.maticvigil.com/address/0xBf8a66DeC65A004B6D89950079B66013A4ac9f0D/contracts)

* Goerli (Ethereum's testnet)TellorSender:  [0x050514e7d074F670758114AaCcE776943A95E105](
https://goerli.etherscan.io/address/0x050514e7d074f670758114aacce776943a95e105#code)


### Challenge Data

Challenge invalid data and automatically fall back to Tellor's Ethereum's data. A fee to intiate a challenge is charged to incentivize pushing Ethereum's data and to disincentivize spaming the network with irrelevant challenges. The challenge fee is paid out to the party that runs the Sender.retrieveDataAndSend or Sender.getCurrentValueAndSend functions on Ethereum's mainnet to send over data to settle the challenge on the side chain. 

```solidity
function challengeData(uint256 _requestId, uint256 _timestamp)
```

### Settle challenge

Once a challenge is initiated, there is a 1 hour wait time before it can be settled to Tellor's mainnet. The wait time allows for data to be requested on Tellor mainnet, in the event that it has not been mined in the allowed timeframe(data can be too old). To allow enough time for disputes on mainnet data, once the data is available on mainnet there is also a 1 hour wait time before the challenge can be settled.

```solidity
function settleChallenge(uint256 _requestId, uint256 _timestamp)
```






<!--- 
    Mumbai
[//]: # (ReceiverStorage: [0xDc09952CB01c2da363F53fC8eC958895b6ab86F3](
https://mumbai-explorer.matic.today/address/0xDc09952CB01c2da363F53fC8eC958895b6ab86F3/contracts))

CentralizedOracle: [0xbac0B75F2F5f34bbFC89F3A820cFDf7bEB677F7a](
https://mumbai-explorer.matic.today/address/0xbac0B75F2F5f34bbFC89F3A820cFDf7bEB677F7a/contracts)

UsingTellor: [0x3cF36e31FF602E4368E0E656Cf40378bF8e0A38F](
https://mumbai-explorer.matic.today/address/0x3cF36e31FF602E4368E0E656Cf40378bF8e0A38F/contracts)

Goerli

MockTellor: [0x6DAdBde8Ad5F06334A7871e4da02698430c754FF](
https://goerli.etherscan.io/address/0x6DAdBde8Ad5F06334A7871e4da02698430c754FF#code)

Sender: [0x09c5c2673D74aAf34005da85Ee50cE5Ff6406921](
https://goerli.etherscan.io/address/0x09c5c2673D74aAf34005da85Ee50cE5Ff6406921#code)
-->
