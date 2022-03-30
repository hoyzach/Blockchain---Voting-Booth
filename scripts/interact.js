require('dotenv').config();
const { formatBytes32String, parseBytes32String } = require("ethers/lib/utils");

const API_KEY = process.env.API_KEY;
const OWNER_KEY = process.env.OWNER_KEY;
const ACCT1_KEY = process.env.ACCT1_KEY;
const ACCT2_KEY = process.env.ACCT2_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

const contract = require("../artifacts/contracts/Voting_Proxy.sol/VotingProxy.json");

//provider
const nodeProvider = new ethers.providers.EtherscanProvider(network = "rinkeby", API_KEY);

//Signers
const owner = new ethers.Wallet(OWNER_KEY, nodeProvider);
const acct1 = new ethers.Wallet(ACCT1_KEY, nodeProvider);
const acct2 = new ethers.Wallet(ACCT2_KEY, nodeProvider);

//Contract
const proxyOwner = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, owner);
const proxyAcct1 = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, acct1);
const proxyAcct2 = new ethers.Contract(CONTRACT_ADDRESS, contract.abi, acct2);

//Sleep function
const minetx = 20000; 
const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
};

async function main() {
    //owner should be able to set new category and register
    //await proxyOwner.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
    //await sleep(minetx);
    //await proxyOwner.register();
    //await sleep(minetx);
    //const votercount = await proxyOwner._voterCount();
    //console.log("The voter count is: " + votercount);

    //an address should not be able to register more than once
    //await proxyOwner.register(); //should return error
    //await sleep(minetx);

    //non-owners should not be able to set a new category
    //await proxyAcct1.setCategory(formatBytes32String("Colors"), [formatBytes32String("Blue"), formatBytes32String("Green"), formatBytes32String("Yellow")]);
    //await sleep(minetx);

    //non-registered addresses should not be able to vote
    //await proxyAcct1.castVote(0,0);
    //await sleep(minetx);

    //voters should not be able to vote in close categories
    //await proxyAcct1.register();
    //await sleep(minetx);
    //await proxyAcct1.castVote(0,0);
    //await sleep(minetx);

    //open category and cast votes
    //await proxyOwner.openCategory(0);
    //await sleep(minetx);
    //await proxyAcct1.castVote(0,2);
    //await sleep(minetx);
    //await proxyOwner.castVote(0,2);
    //await sleep(minetx);

    //voters should not be able to vote more than once in the same category
    //await proxyOwner.castVote(0,2);
    //await sleep(minetx);

    //winner should be declared correctly after closing category
    //await proxyOwner.closeCategory(0); //check events for winner
    //await sleep(minetx);

    //owner should not be able to re-open an already closed category
    //await proxyOwner.openCategory(0);
    //await sleep(minetx);
    
    //voters should not be able to vote in a closed category
    //await proxyOwner.castVote(0,2);
    //await sleep(minetx);

    //voters should not be able to vote in a non-existent category
    //await proxyOwner.castVote(1,0);
    //await sleep(minetx);

    //owner should not be able to open a non-existent category
    //await proxyOwner.openCategory(1);
    //await sleep(minetx);

    //voters should not be able to vote for a non-existent candidate
    //await proxyOwner.setCategory(formatBytes32String("Colors"), [formatBytes32String("Red"), formatBytes32String("Orange"), formatBytes32String("Blue")]);
    //await sleep(minetx);
    //await proxyOwner.openCategory(1);
    //await sleep(minetx);
    //await proxyOwner.castVote(1,4);
    //await sleep(minetx);
  }

  main();