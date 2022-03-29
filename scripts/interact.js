require('dotenv').config();

const API_KEY = process.env.API_KEY;
const OWNER_KEY = process.env.OWNER_KEY;
const ACCT1_KEY = process.env.ACCT1_KEY;
const ACCT2_KEY = process.env.ACCT2_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/Voting_Proxy.sol/VotingProxy.json");

//provider
const nodeProvider = new ethers.providers.EtherscanProvider(network = "rinkeby", API_KEY);

//Signer
const owner = new ethers.Wallet(OWNER_KEY, nodeProvider);
const acct1 = new ethers.Wallet(ACCT1_KEY, nodeProvider);
const acct2 = new ethers.Wallet(ACCT2_KEY, nodeProvider);

//Contract
const proxyOwner = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, owner);
const proxyAcct1 = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, acct1);
const proxyAcct2 = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, acct2);

async function main() {
    const votercount = await proxyOwner._voterCount();
    console.log("The voter count is: " + votercount);
  }

  main();