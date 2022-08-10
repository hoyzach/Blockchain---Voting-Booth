require('dotenv').config();
const { formatBytes32String , parseBytes32String } = require("ethers/lib/utils");

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

    //non-owners should not be able to close a category
    //await proxyAcct1.closeCategory(0);
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
//----------------------------------------------------------------------------------------------

    //non-owners should not be able to pause the contract
    //await proxyAcct1.pause();
    //await sleep(minetx);

    //owner should be able to pause the contract
    //await proxyOwner.pause();
    //await sleep(minetx);

    //voters should not be able to cast votes while contract is paused
    //await proxyOwner.castVote(1,1);
    //await sleep(minetx);

    //voters should not be able to register while the contract is paused
    //await proxyAcct2.register();
    //await sleep(minetx);

    //non-owners should not be able to un-pause the contract
    //await proxyAcct1.unpause();
    //await sleep(minetx);

    //contract pointer should not be updated when contract is unpaused
    //await proxyOwner.unpause();
    //await sleep(minetx);
    //await proxyOwner.upgrade("0x66c17554d8111920DBc0F8a5f83F11c61972684A");
    //await sleep(minetx);

    //non-owners should not be able to withdraw eth from the contract
    /*await acct1.sendTransaction({
      to: CONTRACT_ADDRESS,
      value: ethers.utils.parseEther("0.1"), // Sends exactly 0.1 ether
    });*/
    //await sleep(minetx);
    //await proxyAcct1.withdraw();
    //await sleep(minetx);

    //owner should be able to withdraw eth from the contract
    //await proxyOwner.withdraw();
    //await sleep(minetx);

    //owner should not be able to withdraw from an empty contract
    //await proxyOwner.withdraw();
    //await sleep(minetx);

    //voters should not be able to send more than 1 castVote transaction at a time
    //proxyAcct1.castVote(1,1);
    //proxyAcct1.castVote(1,1);
    //proxyAcct1.castVote(1,1); 
    //console.log(await proxyAcct1.getCategoryVotes(1));

    //non-owners should not be able to update the functionality address pointer
    //await proxyAcct1.upgrade("0x1F68c268149171935154d1d8188c8E38bC0e8a5b");
    //await sleep(minetx);

    //owner should be able to upgrade functionality contract address pointer
    //await proxyOwner.pause();
    //await sleep(minetx);
    //await proxyOwner.upgrade("0x66c17554d8111920DBc0F8a5f83F11c61972684A");
    //await sleep(minetx);
    //await proxyOwner.unpause();
    //await sleep(minetx)
    //console.log(await proxyOwner.sayHello()); //new function only in updated contract

    //check storage of proxy contract remains the same
    //console.log(await proxyAcct1.getCategoryVotes(1)); 
    //await proxyAcct1.register();
    //await proxyAcct1.castVote(1,1);

    //non-owners should not be able to transfer ownership
    //await proxyAcct1.transferOwnership("0xa10205bFAbCE9AbBb672874462C6Cd065f268cc8");

    //owner should be able to transfer ownership of contract
    //await proxyOwner.transferOwnership("0xa10205bFAbCE9AbBb672874462C6Cd065f268cc8");
    //await sleep(minetx);

    //previous owner should now not be able to call any ownable functions
    //await proxyOwner.setCategory(formatBytes32String("Colors"), [formatBytes32String("Black"), formatBytes32String("Yellow"), formatBytes32String("Pink")]);
    //await sleep(minetx);
    //await proxyOwner.pause();
    //await sleep(minetx);
    //await proxyOwner.transferOwnership("0xa10205bFAbCE9AbBb672874462C6Cd065f268cc8");
    //await sleep(minetx);

    //new owner should be able to call ownable functions
    //await proxyAcct1.pause();
    //await sleep(minetx);
    //await proxyAcct1.transferOwnership("0x9eA8B00029Cf9C1B57483ecadCaFC94638fe7B17"); //transfer ownership back
    //await sleep(minetx);

    //------------------------------------------------
    //console.log(await proxyOwner._catCounter());
    //console.log(await proxyOwner.getMaxCandidates());
    //console.log(parseBytes32String ( await proxyOwner.getCategoryWinner(0)) );
    //await proxyOwner.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
    //await proxyOwner.setCategory(formatBytes32String("Colors"), [formatBytes32String("Red"), formatBytes32String("Orange"), formatBytes32String("Blue")]);
    //await proxyOwner.setCategory(formatBytes32String("Crypto"), [formatBytes32String("Bitcoin"), formatBytes32String("Ethereum"), formatBytes32String("Polkadot")]);
    //await proxyOwner.setCategory(formatBytes32String("Social Media Platforms"), [formatBytes32String("Twitter"), formatBytes32String("Facebook"), formatBytes32String("Instagram")]);
    //await proxyOwner.setCategory(formatBytes32String("Sports"), [formatBytes32String("Soccer"), formatBytes32String("Tennis"), formatBytes32String("Basketball")]);
    //await proxyOwner.setCategory(formatBytes32String("Countries"), [formatBytes32String("Canada"), formatBytes32String("Mexico"), formatBytes32String("United States"),formatBytes32String("New Zealand")]);
    //await proxyOwner.setCategory(formatBytes32String("Car Brands"), [formatBytes32String("Audi"), formatBytes32String("BMW"), formatBytes32String("Jeep"),formatBytes32String("Mazda"),formatBytes32String("Ford"),formatBytes32String("Honda")]);
    //await proxyOwner.openCategory(4);
    //--------------------------------------
  }

  main();