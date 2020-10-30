/*****************Ethereum Deployment*****************************************************/

//                Deploy Test Using Tellor on Ethereum TestNet                                            //

/*****************************************************************************************/


const MockTellor = artifacts.require('MockTellor.sol');


/**
*These commands that need to be ran:
*truffle migrate --network rinkeby -f 1 --to 2 --skip-dry-run
*/

// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }
    accts = ['0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3', 
         '0x353E6a85E6A74b7a1C287d11dA1aA091Fbdd7F34',
         '0x52ce8b3Cdf8719aC69DcE22B9Ee23e24EBE0A00c',
         '0x8bC54c696d9F912037689CE04109B007a9b15aD8',
         '0x84005BA16a117Ac1B94da7a7FdaF6882f82EA3F5']

    owner = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'
    oracle = '0xFAE65F91c2FbD2cecB35351b77B5d28c13F8AEF3'

module.exports = async function(deployer) {
    // deploy test tellor contract
    await deployer.deploy(MockTellor,accts, [web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"),web3.utils.toWei("5000"));

};