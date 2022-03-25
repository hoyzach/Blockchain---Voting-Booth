const hre = require("hardhat");

async function main() {

  const VotingStorage = await hre.ethers.getContractFactory("VotingStorage");
  const votingstorage = await VotingStorage.deploy();
  console.log("Owner of storage contract: ", await votingstorage.owner());
  console.log("Address of storage contract: ", await votingstorage.address);

  const VotingBooth = await hre.ethers.getContractFactory("VotingBooth");
  const votingbooth = await VotingBooth.deploy();
  console.log("Owner of booth contract: ", await votingbooth.owner());
  console.log("Address of booth contract: ", await votingbooth.address);

  const VotingProxy = await hre.ethers.getContractFactory("VotingProxy");
  const votingproxy = await VotingProxy.deploy(votingbooth.address);
  console.log("Owner of proxy contract: ", await votingproxy.owner()); 
  console.log("Address of proxy contract: ", await votingproxy.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
