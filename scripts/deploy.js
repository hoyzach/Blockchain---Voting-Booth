// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
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

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
