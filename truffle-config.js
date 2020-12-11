/**
 * Use this file to configure your truffle project. It's seeded with some
 * common settings for different networks and features like migrations,
 * compilation and testing. Uncomment the ones you need or modify
 * them to suit your project as necessary.
 *
 * More information about configuration can be found at:
 *
 * trufflesuite.com/docs/advanced/configuration
 *
 * To deploy via Infura you'll need a wallet provider (like @truffle/hdwallet-provider)
 * to sign your transactions before they're sent to a remote public node. Infura accounts
 * are available for free at: infura.io/register.
 *
 * You'll also need a mnemonic - the twelve word phrase the wallet uses to generate
 * public/private key pairs. If you're publishing your code to GitHub make sure you load this
 * phrase from a file you've .gitignored so it doesn't accidentally become public.
 *
 */

 require("dotenv").config();
const HDWalletProvider = require("@truffle/hdwallet-provider");

//const mnemonic = process.env.ETH_MNEMONIC;
const accessToken = process.env.WEB3_INFURA_PROJECT_ID
const matic_accessToken = process.env.MATIC_ACCESS_TOKEN
const pk_rinkeby = process.env.RINKEBY_ETH_PK
const pk_mainnet = process.env.ETH_PK
const matic_pk = process.env.MATIC_PK
const mumbai_pk = process.env.MUMBAI_MATIC_PK
  "brenda tim nick jg krasi mike ryan charlie delta ocean produce wish"

// ganache-cli -m "brenda tim nick jg krasi mike ryan charlie delta ocean produce wish" -l 10000000 --allowUnlimitedContractSize


// const HDWalletProvider = require('@truffle/hdwallet-provider');
// const infuraKey = "fj4jll3k.....";
//
// const fs = require('fs');
// const mnemonic = fs.readFileSync(".secret").toString().trim();

module.exports = {
  /**
   * Networks define how you connect to your ethereum client and let you set the
   * defaults web3 uses to send transactions. If you don't specify one truffle
   * will spin up a development blockchain for you on port 9545 when you
   * run `develop` or `test`. You can ask a truffle command to use a specific
   * network from the command line, e.g
   *
   * $ truffle test --network <network-name>
   */

  networks: {
    // Useful for testing. The `development` name is special - truffle uses it by default
    // if it's defined here and no other network is specified at the command line.
    // You should run a client (like ganache-cli, geth or parity) in a separate terminal
    // tab if you use this network and you must also set the `host`, `port` and `network_id`
    // options below to some value.
    //
    // Another network with more advanced options...
    // advanced: {
    // port: 8777,             // Custom port
    // network_id: 1342,       // Custom network
    // gas: 8500000,           // Gas sent with each transaction (default: ~6700000)
    // gasPrice: 20000000000,  // 20 gwei (in wei) (default: 100 gwei)
    // from: <address>,        // Account to send txs from (default: accounts[0])
    // websockets: true        // Enable EventEmitter interface for web3 (default: false)
    // },
    // Useful for deploying to a public network.
    // NB: It's important to wrap the provider as a function.
    // ropsten: {
    // provider: () => new HDWalletProvider(mnemonic, `https://ropsten.infura.io/v3/YOUR-PROJECT-ID`),
    // network_id: 3,       // Ropsten's id
    // gas: 5500000,        // Ropsten has a lower block limit than mainnet
    // confirmations: 2,    // # of confs to wait between deployments. (default: 0)
    // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
    // skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    // },
    // Useful for private networks
    // private: {
    // provider: () => new HDWalletProvider(mnemonic, `https://network.io`),
    // network_id: 2111,   // This network is yours, in the cloud.
    // production: true    // Treats this network as if it was a public net. (default: false)
    // }
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*",
      gas: 6000000, // default ganache-cli value
    },

    ropsten: {
      provider: () =>
        new HDWalletProvider(
          pk_rinkeby,
          `https://ropsten.infura.io/v3/${accessToken}`
        ),
      network_id: 3,
      gas: 10000000,
      gasPrice: 10000000000,
    },
  
    rinkeby: {
      provider: () =>
        new HDWalletProvider(
          pk_rinkeby,
          `https://rinkeby.infura.io/v3/${accessToken}`
        ),
      network_id: 4,
      gas: 10000000,
      gasPrice: 80000000000,
    },

    goerli: {
      provider: () =>
        new HDWalletProvider(
          pk_rinkeby,
          `https://goerli.infura.io/v3/${accessToken}`
        ),
      network_id: 5,
      gas: 8000000,
      gasPrice: 80000000000,
      confirmations: 2,   
      timeoutBlocks: 200,  
      skipDryRun: true 
    },


    mainnet: {
      provider: () =>
        new HDWalletProvider(
          pk_mainnet,
          `https://mainnet.infura.io/v3/${accessToken}`
        ),
      network_id: 1,
      gas: 10000000,
      gasPrice: 85000000000,
    },
//https://rpc-mumbai.maticvigil.com/v1/a5e55a186479f268d9f0ce74541191c3082877b6
//https://rpc-mumbai.matic.today
    mumbai: {
    provider: () => new HDWalletProvider(
      mumbai_pk,
       `https://rpc-mumbai.maticvigil.com/v1/${matic_accessToken}`),
      network_id: "80001",       
      gas: 8000000,    
      gasPrice: 3000000000,
      confirmations: 2,   
      timeoutBlocks: 200,  
      skipDryRun: true     
    },  
  

    matic: {
    provider: () => new HDWalletProvider(
      matic_pk, 
      `https://rpc-mainnet.maticvigil.com/v1/${matic_accessToken}`),
      network_id: "137",       
      gas: 4000000,    
      gasPrice: 5000000000,
      confirmations: 2,   
      timeoutBlocks: 200,  
      skipDryRun: true     
    },  
  },



  // Set default mocha options here, use special reporters etc.
  mocha: {
    enableTimeouts: false,
    before_timeout: 210000, // Here is 2min but can be whatever timeout is suitable for you.
    //reporter: "eth-gas-reporter",
    reporterOptions: {
      currency: "USD",
    },
  },

  // Configure your compilers
  compilers: {
    solc: {
      // version: "0.5.1",    // Fetch exact version from solc-bin (default: truffle's version)
      // docker: true,        // Use "0.5.1" you've installed locally with docker (default: false)
      // settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: true,
          runs: 5000000
        },
      //  evmVersion: "byzantium"
      // }
    },
  },




};
