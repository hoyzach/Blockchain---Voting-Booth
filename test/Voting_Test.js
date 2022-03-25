const { expect } = require("chai");
const { formatBytes32String, parseBytes32String } = require("ethers/lib/utils");
const { ethers } = require("hardhat");

describe("VotingProxy", function () {

  let VotingStorage, votingstorage, VotingBooth, votingbooth, VotingBoothUpdated, votingboothupdated, VotingProxy, votingproxy, owner, addr1, addr2, addr3;

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
      expect(await votingproxy._voterCount()).to.equal(1);

      await votingproxy.connect(addr1).register();
      expect(await votingproxy._voterCount()).to.equal(2);

    });

    it("Should not allow a single address to register more than once", async () => {

      await votingproxy.connect(addr1).register();
      await expect(votingproxy.connect(addr1).register()).to.be.revertedWith("This address is already registered");

    });

  });
  
  describe('Set Category', () => {

    it("Should properly populate category struct", async () => {

      const catid = await votingproxy.callStatic.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      expect(ethers.BigNumber.from(catid)).to.equal(0); //functions successful and returns the index
      
      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);

      const categoryname = await votingproxy.getCategoryName(catid);
      expect(parseBytes32String(categoryname)).to.equal("Animals");

      expect(await votingproxy.getCategoryOpen(catid)).to.equal(false);

      const candidate0 = await votingproxy.getCandidate(catid, 0);
      expect(parseBytes32String(candidate0)).to.equal("Cats");
      const candidate1 = await votingproxy.getCandidate(catid, 1);
      expect(parseBytes32String(candidate1)).to.equal("Dogs");
      const candidate2 = await votingproxy.getCandidate(catid, 2);
      expect(parseBytes32String(candidate2)).to.equal("Elephants");

    });

  });

  describe('Open-Close Category', () => {

    it("Should not allow re-opening of an already closed category", async () => {
      
      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      await votingproxy.openCategory(0);
      await votingproxy.closeCategory(0);
      await expect(votingproxy.openCategory(0)).to.be.revertedWith("This category cannot be opened again");

    });

    it("Should not allow owner to open unset category", async () => {
  
      await expect(votingproxy.openCategory(0)).to.be.reverted;

    });

  });

  describe('Pause and Unpause', () => {

    it("Should not allow voters to register when paused", async () => {

      await votingproxy.pause();
      await expect(votingproxy.register()).to.be.revertedWith("Pausable: paused");

    });

    it("Should not allow votes to be cast when paused", async () => {

      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      await votingproxy.register();
      await votingproxy.pause();
      await expect(votingproxy.castVote(1,1)).to.be.revertedWith("Pausable: paused");

    });

    it("Should not allow functionality contract address to be updated when unpaused", async () => {

      await expect(votingproxy.upgrade(votingstorage.address)).to.be.revertedWith("Pausable: not paused");

    });

  });

  describe('Cast Vote', () => {

    it("Should only allow registered voters to vote", async () => {

      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);

      await expect(votingproxy.castVote(0,0)).to.be.revertedWith("This wallet address is not yet registered");

    });

    it("Should not allow votes on closed categories", async () => {

      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      await votingproxy.register();
      await expect(votingproxy.castVote(0,0)).to.be.revertedWith("This action cannot be performed when the category is closed");

    });

    it("Should not allow votes on non-existing categories", async () => {

      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      await votingproxy.register();
      await expect(votingproxy.castVote(1,0)).to.be.reverted;

    });

    it("Should properly keep track of votes", async () => {

      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      await votingproxy.openCategory(0);
      await votingproxy.register();
      await votingproxy.connect(addr1).register();
      await votingproxy.connect(addr2).register();

      await votingproxy.castVote(0,0);
      await votingproxy.connect(addr1).castVote(0,0);
      await votingproxy.connect(addr2).castVote(0,2);

      const winner = await votingproxy.callStatic.closeCategory(0);
      expect(parseBytes32String(winner)).to.equal("Cats");
      await votingproxy.closeCategory(0);

      expect(await votingproxy.getCandidateVotes(0,0)).to.equal(2);
      expect(await votingproxy.getCandidateVotes(0,2)).to.equal(1);
      expect(await votingproxy._totalVotes()).to.equal(3);

    });

    it("Should not let voters vote more than once in a category", async () => {

      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      await votingproxy.openCategory(0);

      await votingproxy.register();
      await votingproxy.castVote(0,2);

      await expect(votingproxy.castVote(0,1)).to.be.revertedWith("You have already voted in this category");

    });

  });

  describe("Upgrade", () => {

    it("Should properly update functionality contract address", async () => {

      VotingBoothUpdated = await hre.ethers.getContractFactory("VotingBoothUpdated");
      votingboothupdated = await VotingBoothUpdated.deploy();
      await votingproxy.pause();
      await votingproxy.upgrade(votingboothupdated.address);
      expect(await votingproxy.currentFuncAddress()).to.equal(votingboothupdated.address);

    });

  });

  describe('Ownership', () => {

    it("Should not allow non-owners to update functionality contract address", async () => {

        await expect(votingproxy.connect(addr1).upgrade(votingstorage.address)).to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Should not allow non-owners to transfer ownership", async () => {

      await expect(votingproxy.connect(addr1).transferOwnership(addr1.address))
        .to.be.revertedWith("Ownable: caller is not the owner");
      await votingproxy.transferOwnership(addr1.address);
      await expect(votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]))
        .to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Should not allow non-owners to open and close category", async () => {
      
      await votingproxy.setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]);
      await expect(votingproxy.connect(addr1).openCategory(0)).to.be.revertedWith("Ownable: caller is not the owner");
      await votingproxy.openCategory(0);
      await expect(votingproxy.connect(addr1).closeCategory(0)).to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Should not allow non-owners to set cateogry", async () => {

      await expect(votingproxy.connect(addr1).setCategory(formatBytes32String("Animals"), [formatBytes32String("Cats"), formatBytes32String("Dogs"), formatBytes32String("Elephants")]))
        .to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Should not allow non-owners to pause or unpause", async () => {
      
      await expect(votingproxy.connect(addr1).pause()).to.be.revertedWith("Ownable: caller is not the owner");
      await votingproxy.pause();
      await expect(votingproxy.connect(addr1).unpause()).to.be.revertedWith("Ownable: caller is not the owner");

    });

    it("Should not allow non-owners to withdraw", async () => {
      
      await addr1.sendTransaction({
        to: votingproxy.address,
        value: ethers.utils.parseEther("1.0"), // Sends exactly 1.0 ether
      });

      await expect(votingproxy.connect(addr1).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");

    });

  });

  describe('Withdraw', () => {

    it("Should allow owner to withdraw", async () => {

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