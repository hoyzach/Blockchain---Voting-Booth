const hre = require("hardhat");

async function main() {

  const VotingBoothUpdated = await hre.ethers.getContractFactory("VotingBoothUpdated");
  const votingboothupdated = await VotingBoothUpdated.deploy();
  console.log("Owner of updated contract: ", await votingboothupdated.owner()); 
  console.log("Address of updated contract: ", await votingboothupdated.address);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
