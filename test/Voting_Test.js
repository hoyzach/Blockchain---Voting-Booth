const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("VotingProxy", function () {

  let VotingStorage, votingstorage, VotingBooth, votingbooth, VotingProxy, votingproxy, owner, addr1, addr2, addr3;

  this.beforeEach( async () => {

    VotingStorage = await hre.ethers.getContractFactory("VotingStorage");
    votingstorage = await VotingStorage.deploy();
    VotingBooth = await hre.ethers.getContractFactory("VotingBooth");
    votingbooth = await VotingBooth.deploy();
    VotingProxy = await hre.ethers.getContractFactory("VotingProxy");
    votingproxy = await VotingProxy.deploy(votingbooth.address);
    [owner, addr1, addr2, addr3, _] = await ethers.getSigners();

  });

  describe('Register', () => {

    it("Should increase voterCount by 1 when voter is registered", async () => {

      await votingproxy.register();
      let votercount = await votingproxy._voterCount();
      expect(votercount).to.equal(1);

      await votingproxy.connect(addr1).register();
      votercount = await votingproxy._voterCount();
      expect(votercount).to.equal(2);

    });

    it("Should not allow a single address to register twice", async () => {

      await votingproxy.connect(addr1).register();
      await expect(votingproxy.connect(addr1).register()).to.be.revertedWith("This address is already registered");

    });

  });
  
  describe('Set Category', () => {

    it("Should properly populate category struct", async () => {

      const catid = await votingproxy.callStatic.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      expect(ethers.BigNumber.from(catid)).to.equal(0); //functions successful and returns the index
      
      await votingproxy.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);

      const categoryname = await votingproxy.getCategoryName(catid);
      expect(categoryname).to.equal("Animals");
      const categoryopen = await votingproxy.getCategoryOpen(catid);
      expect(categoryopen).to.equal(false);
      const candidate1 = await votingproxy.getCandidate(catid, 1);
      expect(candidate1).to.equal("Dogs");

    });

    it("Should not allow non-owners to set a category", async () => {

      await expect(votingproxy.connect(addr1).setCategory("Animals", ["Cats", "Dogs", "Elephants"])).to.be.revertedWith("Ownable: caller is not the owner");

    });

  });

  describe('Pause and Unpause', () => {

    it("Should properly apply pause function", async () => {

      await votingproxy.connect(addr1).register();

      await votingproxy.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      await votingproxy.pause();

      await expect(votingproxy.connect(addr2).register()).to.be.revertedWith("Pausable: paused");
      await expect(votingproxy.connect(addr1).castVote(1,1)).to.be.revertedWith("Pausable: paused");

    });

    it("Should not allow non-owners to pause", async () => {

      await expect(votingproxy.connect(addr1).pause()).to.be.revertedWith("Ownable: caller is not the owner");

    });

  });

  describe('Cast Vote', () => {

    it("Should only allow registered voters to vote", async () => {

      await votingproxy.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);

      await expect(votingproxy.castVote(0,0)).to.be.revertedWith("This wallet address is not yet registered");

    });

    it("Should not allow votes on closed categories", async () => {

      await votingproxy.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      await votingproxy.register();
      await expect(votingproxy.castVote(0,0)).to.be.revertedWith("This action cannot be performed when the category is closed");

    });

    it("Should properly keep track of votes", async () => {

      await votingproxy.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      await votingproxy.openCategory(0);
      await votingproxy.register();
      await votingproxy.connect(addr1).register();
      await votingproxy.connect(addr2).register();

      await votingproxy.castVote(0,0);
      await votingproxy.connect(addr1).castVote(0,0);

      expect(await votingproxy.getCandidateVotes(0,0)).to.equal(2);

      await votingproxy.connect(addr2).castVote(0,2);
      expect(await votingproxy.getCandidateVotes(0,2)).to.equal(1);

      const winner = await votingproxy.callStatic.closeCategory(0);
      expect(winner).to.equal("Cats");

    });

    it("Should not let voters vote more than once in a category", async () => {

      await votingproxy.setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      await votingproxy.openCategory(0);
      await votingproxy.setCategory("Colors", ["Red","Orange","Yellow","Green"]);
      await votingproxy.openCategory(1);

      await votingproxy.register();
      await votingproxy.castVote(0,2);
      await votingproxy.castVote(1,3);

      await expect(votingproxy.castVote(0,1)).to.be.revertedWith("You have already voted in this category");
      await expect(votingproxy.castVote(1,1)).to.be.revertedWith("You have already voted in this category");

    });

  });

  describe('Transfer Ownership', () => {

    it("Should only allow owner to transfer ownership", async () => {

      await votingproxy.transferOwnership("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC");
      await votingproxy.connect(addr2).setCategory("Animals", ["Cats", "Dogs", "Elephants"]);
      await expect(votingproxy.openCategory(0)).to.be.revertedWith("Ownable: caller is not the owner");

    });

  });

  describe('Withdraw', () => {

    it("Should only allow owner to withdraw", async () => {

      await owner.sendTransaction({
        to: votingproxy.address,
        value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
      });
      await votingproxy.withdraw();

    });

    it("Should only allow withdraw if there is ether in the contract", async () => {

      await expect(votingproxy.withdraw()).to.be.revertedWith("No funds in contract");

    });

  });
  
});