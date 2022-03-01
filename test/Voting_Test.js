const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingBooth", function () {
  let VotingBooth, votingbooth, owner, addr1, addr2, addr3;

  this.beforeEach( async () => {
    VotingBooth = await hre.ethers.getContractFactory("VotingBooth");
    votingbooth = await VotingBooth.deploy();
    [owner, addr1, addr2, addr3, _] = await ethers.getSigners();
  });

  describe('Register', () => {

    it("Should increase voterCount by 1 when voter is registered", async function () {
      await votingbooth.register();
      let votercount = await votingbooth._voterCount();
      expect(votercount).to.equal(1);
      await votingbooth.connect(addr1).register();
      votercount = await votingbooth._voterCount();
      expect(votercount).to.equal(2);
    });

    it("Should not allow a single address to register twice", async function () {
      await votingbooth.connect(addr1).register();
      await expect(votingbooth.connect(addr1).register()).to.be.revertedWith("This address is already registered");
    });

  });
  
});

//test onlyOwner