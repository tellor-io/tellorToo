/*****************Ethereum Deployment*****************************************************/

//                Deploy Receiver on Matic Network                                            //

/*****************************************************************************************/


const ReceiverStorage = artifacts.require('ReceiverStorage.sol');

/**
*These commands that need to be ran:
*truffle migrate --network maticTestnet -f 1 --to 2 --skip-dry-run
*/


module.exports = async function(deployer) {
    // deploy test tellor contract
    await deployer.deploy(ReciverStorage);
};