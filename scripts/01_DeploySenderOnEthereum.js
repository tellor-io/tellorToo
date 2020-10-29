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

    //constructor(address payable _tellorAddress, address _stateSender, address _receiver)
    sender = await Sender.new(tellorMaster, maticStateSender, reciverStorage )
    console.log("sender: ", sender.address)

}