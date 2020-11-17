# Optimistic Oracle

This optimistic oracle allows for the use of a centralized oracle on an Ethereum sidechain with the option to dispute any datapoint with proof from Tellor's decentralized oracle on mainnet.


User:

* Verify that that data is currently available on Tellor 
Data currently available on Tellor's Ethereum network: 
[https://docs.tellor.io/dev-documentation/reference-page/data-request-ids-1](https://docs.tellor.io/dev-documentation/reference-page/data-request-ids-1)

* 


### Test Environment with Matic bridge
Mumbai
receiverStorage: 0xDc09952CB01c2da363F53fC8eC958895b6ab86F3
centralizedOracle: 0xbac0B75F2F5f34bbFC89F3A820cFDf7bEB677F7a
usingTellor: 0x3cF36e31FF602E4368E0E656Cf40378bF8e0A38F

Goerli
mockTellor: 0x6DAdBde8Ad5F06334A7871e4da02698430c754FF
sender: 0x09c5c2673D74aAf34005da85Ee50cE5Ff6406921



### Test Environment with no bridge
receiverStorage: 0x5Bb9d21C4d665bc82AE57D399d350Dc921687e01
mockTellor: 0xd6a7B42C8548C4e5A1C6DDEDCd992A3Db98D57aa
mockSender: 0xcEbec024c58C4Efa41DB118D8a8Cd30B7D02247b
sender: 0xB750cc8647bEBA765B63259dB9Ac326EF0335dce
centralizedOracle: 0xB99FFb1009504fbfcadC442930E2D652e3BB63c9
usingTellor: 0x8b2313b41b759dC6Ec6BCb77749ED5DbF451476B
