/*****************Ethereum Sender Deployment*****************************************************/

//                Deploy Sender on Ethereum                                            //

/*****************************************************************************************/
const Sender = artifacts.require('./Sender.sol')

//from migrations
//Ethereum contract address
tellorMaster = '';

//Matic contract address
receiverStorage = '';
maticStateSender = ''; 



module.exports =async function(callback) {
    let sender

    //On Ethereum-Mock tellor/tellorMaster and Sender
    sender = await Sender.new(tellorMaster, maticStateSender, receiverStorage )
    console.log("sender: ", sender.address)

}