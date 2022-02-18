// SPDX-License-Identifier: Unlicensed

/*
Even though voter data is visible on the Ethereum blockchain, this application is written as if it isn't.  
The ultimate decentralized voting application would not allow anyone to see voting data as it is collected,
to discourage voting based on current voting data and waiting to vote until the last minute.

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

    function setCategory(string memory _category, string[] memory _candidates) public onlyOwner {

    }

    function castVote(string memory _category, string memory _candidate) public registered {
        require(_boolVoter[msg.sender][_category] == false);
        _boolVoter[msg.sender][_category] = true;
        //add vote for cadidate
        //add vote to totalVotes
        //add vote for totalCategoryVotes
    }

        //implement a timer of some sort
    function setTimer(uint) public onlyOwner {

    }

    //collect votes when timer is comeplete
    function getCategoryVotes(string memory _candidate) public returns(uint) {
            // require timer to be complete
    }
    function getTotalVotes() public returns(uint){

    }


}