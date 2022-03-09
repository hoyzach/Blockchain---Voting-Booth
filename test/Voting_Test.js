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

    it("Should increase voterCount by 1 when voter is registered", async () => {

      await votingbooth.register();
      let votercount = await votingbooth._voterCount();
      expect(votercount).to.equal(1);

      await votingbooth.connect(addr1).register();
      votercount = await votingbooth._voterCount();
      expect(votercount).to.equal(2);

    });

    it("Should not allow a single address to register twice", async () => {

      await votingbooth.connect(addr1).register();
      await expect(votingbooth.connect(addr1).register()).to.be.revertedWith("This address is already registered");

    });

  });
  
  describe('Set Category', () => {

    it("Should properly populate category struct", async () => {

      const catid = await votingbooth.callStatic.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      expect(ethers.BigNumber.from(catid)).to.equal(0); //functions successful and returns the index
      
      await votingbooth.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);

      const categoryname = await votingbooth.getCategoryName(catid);
      expect(categoryname).to.equal("Animals");
      const categoryopen = await votingbooth.getCategoryOpen(catid);
      expect(categoryopen).to.equal(false);
      const candidate1 = await votingbooth.getCandidate(catid, 1);
      expect(candidate1).to.equal("Dogs");

    });

    it("Should not allow non-owners to set a category", async () => {

      await expect(votingbooth.connect(addr1).setCategory("Animals", ["Cats", "Dogs", "Elephants"])).to.be.revertedWith("Ownable: caller is not the owner");

    });

  });

  describe('Pause and Unpause', () => {

    it("Should properly apply pause function", async () => {

      await votingbooth.connect(addr1).register();

      await votingbooth.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      await votingbooth.pause();

      await expect(votingbooth.connect(addr2).register()).to.be.revertedWith("Pausable: paused");
      await expect(votingbooth.connect(addr1).castVote(1,1)).to.be.revertedWith("Pausable: paused");

    });

    it("Should not allow non-owners to pause", async () => {

      await expect(votingbooth.connect(addr1).pause()).to.be.revertedWith("Ownable: caller is not the owner");

    });

  });

  describe('Cast Vote', () => {

  });

  describe('Transfer Ownership', () => {

  });

  describe('Withdraw', () => {

  });
  
});