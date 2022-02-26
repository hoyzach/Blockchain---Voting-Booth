// SPDX-License-Identifier: Unlicensed

/*
Even though voter data is visible on the Ethereum blockchain, this application is written as if it isn't.  
The ultimate decentralized voting application would not allow anyone to see voting data as it is collected,
to discourage voting based on current current voting data and protecting the privacy of the voters.

This application does not prevent the same entity from creating multiple address to vote from.
A separate database with a voter identifcation number obtained through a voter identification verification
process would need to be queried through a modified register function. 
*/
pragma solidity ^0.8.6;

import "Voting_Storage.sol";

contract VotingBooth is VotingStorage {

    function register() public {
        require(_registry[msg.sender] != true);
        _registry[msg.sender] = true;
        _voterCount++;
    }

    function setCategory(string memory _category, string[] memory _candidates) external onlyOwner returns (uint64){

        require(_candidates.length <256, "There are too many candidates.");
        
        catCounter++;

        Categories[catCounter].category = _category;
        Categories[catCounter].catId = catCounter;

        for(uint8 i = 0; i < _candidates.length; i++) {
            Categories[catCounter].candidates[i].name = _candidates[i];
            Categories[catCounter].candidates[i].numCanVotes = 0;
            Categories[catCounter].candidates[i].canId = i;
        }

        return catCounter;        
    }

    function openCategory(uint64 _catId) public onlyOwner {
        require(Categories[_catId].open == false);
        Categories[_catId].open = true;
    }

    function closeCategory(uint64 _catId) public onlyOwner {
        require(Categories[_catId].open != false);
        Categories[_catId].open = false;
    }

    function castVote(uint64 _catId, uint8 _canId) public registered {
        //prevent voter from voting in a closed category
        require(Categories[_catId].open == true, "This category is not open for voting.");

        //prevent voter from voting for another candidate in the same category
        require(_boolVoter[msg.sender][_catId] == false, "You have already voted in this category");
        _boolVoter[msg.sender][_catId] = true;

        //add vote for cadidate
        Categories[_catId].candidates[_canId].numCanVotes++;

        //add vote to totalVotes
        _totalVotes++;
    }

    function getCategoryVotes(uint64 _catId) public view returns(uint) {
        require(Categories[_catId].open == false);

        uint CategoryVotes = 0;
        for(uint8 i = 0; i < Categories[_catId].candidates.length; i++) {
            SafeMath.add(CategoryVotes, Categories[_catId].candidates[i].numCanVotes);
        }

        return CategoryVotes;
    }
    
    function getTotalVotes() public view returns(uint){
        return _totalVotes;
    }


}