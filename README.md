# TellorToo

Tellor's Optimistic Oracle, TellorToo, allows for the use of a centralized oracle on an Ethereum side chain with the option to challenge the validity of any data point with proof from Tellor's decentralized oracle on mainnet.

TellorToo allows side chain users the ability to get pricing data faster from a centralized oracle but with the security of a decentralized oracle. The user can place trust on a centralized party since if the user disagrees with the price provided they can challenge the validity of it and use Tellor's data from Ethereum as their official value. The security of TellorToo is derived from mainnet Tellor's security.

## TellorToo is up on testnet

### Test Environment with Matic bridge
Mumbai

ReceiverStorage: [0xDc09952CB01c2da363F53fC8eC958895b6ab86F3](
https://mumbai-explorer.matic.today/address/0xDc09952CB01c2da363F53fC8eC958895b6ab86F3/contracts)

CentralizedOracle: [0xbac0B75F2F5f34bbFC89F3A820cFDf7bEB677F7a](
https://mumbai-explorer.matic.today/address/0xbac0B75F2F5f34bbFC89F3A820cFDf7bEB677F7a/contracts)

UsingTellor: [0x3cF36e31FF602E4368E0E656Cf40378bF8e0A38F](
https://mumbai-explorer.matic.today/address/0x3cF36e31FF602E4368E0E656Cf40378bF8e0A38F/contracts)

Goerli

MockTellor: [0x6DAdBde8Ad5F06334A7871e4da02698430c754FF](
https://goerli.etherscan.io/address/0x6DAdBde8Ad5F06334A7871e4da02698430c754FF#code)

Sender: [0x09c5c2673D74aAf34005da85Ee50cE5Ff6406921](
https://goerli.etherscan.io/address/0x09c5c2673D74aAf34005da85Ee50cE5Ff6406921#code)


## How to use TellorToo

* Verify that that data is currently available on Tellor 

Data currently available on Tellor's Ethereum network: 
[https://docs.tellor.io/dev-documentation/reference-page/data-request-ids-1](https://docs.tellor.io/dev-documentation/reference-page/data-request-ids-1)

If the data needed is not available, please submit a Tellor Improvement Plan[(TIP)](https://github.com/tellor-io/TIPs) to have your data supported. 

* Allow your contract to read from TellorToo

TellorToo is a centralized oracle and allows for faster data feeds. However, Tellor's data from Ethereum will supersede the centralized oracle's value if the user challenges the validity of the value provided. 

```solidity
import "./UsingTellor.sol";

contract YourContract is UsingTellor {
    UsingTellor Tellor;

    /*Constructor*/
    /**
    * @dev the constructor sets the storage address and owner
    * @param _tellor is the TellorMaster address
    */
    constructor(address payable _UsingTellor) public {
        tellor = UsingTellor(_UsingTellor);
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

* Challenge invalid data provided by the CentralizedOracle

Challenge invalid data and automatically fall back to Tellor's Ethereum's data. A fee to intiate a challenge is charged to incentivize getting Ethereum's data and to disincentivize spaming the network with irrelevant challenges. The challenge fee is paid out to the party that runs the Sender.retrieveDataAndSend or Sender.getCurrentValueAndSend functions on mainnet that send over data to settle the challenge on the side chain. 

```solidity
function challengeData(uint256 _requestId, uint256 _timestamp)
```

* Settle the challenge on the side chain

Once a challenge is initiated, there is a 1 hour wait time before it can be settled to Tellor's mainnet. The wait time allows for data to be requested on Tellor mainnet, in the event that it has not been mined in the allowed timeframe(data can be too old). To allow enough time for disputes on mainnet data, once the data is available on mainnet there is also a 1 hour wait time before the challenge can be settled.

```solidity
function settleChallenge(uint256 _requestId, uint256 _timestamp)
```



[//]: # (### Test Environment with no bridge)
[//]: # ( receiverStorage: 0x5Bb9d21C4d665bc82AE57D399d350Dc921687e01)
[//]: # (mockTellor: 0xd6a7B42C8548C4e5A1C6DDEDCd992A3Db98D57aa)
[//]: # (mockSender: 0xcEbec024c58C4Efa41DB118D8a8Cd30B7D02247b)
[//]: # (sender: 0xB750cc8647bEBA765B63259dB9Ac326EF0335dce)
[//]: # (centralizedOracle: 0xB99FFb1009504fbfcadC442930E2D652e3BB63c9)
[//]: # (usingTellor: 0x8b2313b41b759dC6Ec6BCb77749ED5DbF451476B)
