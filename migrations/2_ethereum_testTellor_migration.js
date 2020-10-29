/*****************Ethereum Deployment*****************************************************/

//                Deploy Test Using Tellor on Ethereum TestNet                                            //

/*****************************************************************************************/


const MockTellor = artifacts.require('MockTellor.sol');
const UsingTellor = artifacts.require('UsingTellor.sol');


/**
*These commands that need to be ran:
*truffle migrate --network rinkeby -f 1 --to 2 --skip-dry-run
*/

// function sleep_s(secs) {
//   secs = (+new Date) + secs * 1000;
//   while ((+new Date) < secs);
// }


module.exports = async function(deployer) {
    // deploy test tellor contract
    await deployer.deploy(MockTellor);

    await deployer.deploy(MockTellor).then(async function() {
       await deployer.deploy(UsingTellor, MockTellor.address);
    });

};