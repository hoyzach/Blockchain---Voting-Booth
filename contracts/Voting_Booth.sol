// SPDX-License-Identifier: Unlicensed

/*
Even though voter data is visible on the Ethereum blockchain, this application is written as if it isn't.
Additionally, solidity does not allow for functions to be called automatically after a specified period of time,
therefore this contract needs to use owner privileges to open and close a voting category.   
The ultimate decentralized voting application would not require owner privileges and would not allow anyone to 
see voting data as it is collected in order to discourage voting based on current voting data and to 
protect the privacy of the individual voters.

This application does not prevent the same entity from creating multiple address to vote from.
A separate database with a voter identifcation number obtained through a voter identification verification
process would need to be queried through a modified register function. 
*/
pragma solidity ^0.8.0;

import "./Voting_Storage.sol";


contract VotingBooth is VotingStorage {

    event categorySet(string _func, string _categoryName, string[] _candidateNames, address _from);
    event categoryStatusChange(string _func, string _categoryName, string _winner, address _from);
    event donationReceived(address _donator, uint _amount, bytes _message);

// Functionality ------------------------------------------------------------------------------------------------------------------------------------------------------

    function register() external whenNotPaused {
        require(_registry[msg.sender] != true, "This address is already registered");
        _registry[msg.sender] = true;
        _voterCount++;
    }


    function setCategory(string memory _category, string[] memory _candidates) external onlyOwner returns (uint64){

        require(_candidates.length <256, "There are too many candidates.");

        uint64 currentCatId = _catCounter;

        categories.push();
        categories[currentCatId].name = _category;
        categories[currentCatId].catId = currentCatId;

        for(uint8 i = 0; i < _candidates.length; i++) {
            categories[currentCatId].candidates.push(Candidate(_candidates[i], 0, i));
        }

        emit categorySet("New Category", _category, _candidates, msg.sender);

        _catCounter++;

        return currentCatId;        
    }

    function openCategory(uint64 _catId) external onlyOwner categoryClosed(_catId) returns(bool){

        require(_openedOnce[_catId] == false);
        _openedOnce[_catId] = true;
        categories[_catId].open = true;

        emit categoryStatusChange("Category Opened", categories[_catId].name, "", msg.sender);

        return true;
    }

    function closeCategory(uint64 _catId) external onlyOwner categoryOpen(_catId) returns(string memory){

        categories[_catId].open = false;

        string memory winner = getCategoryWinner(_catId);

        emit categoryStatusChange("Category Closed", categories[_catId].name, winner, msg.sender);

        return winner;
    }

    function castVote(uint64 _catId, uint8 _canId) external registered whenNotPaused categoryOpen(_catId) returns(bool) {

        //prevent voter from voting for another candidate in the same category
        require(_boolVoter[msg.sender][_catId] == false, "You have already voted in this category");
        _boolVoter[msg.sender][_catId] = true;

        //add vote for cadidate
        categories[_catId].candidates[_canId].numCanVotes++;

        //add vote to totalVotes
        _totalVotes++;

        return true;
    }

// Getter functions ------------------------------------------------------------------------------------------------------------------------------------------------------

    function getCategoryVotes(uint64 _catId) internal view categoryClosed(_catId) returns(uint) {

        uint categoryVotes = 0;
        for(uint8 i = 0; i < categories[_catId].candidates.length; i++) {
            categoryVotes = categoryVotes + categories[_catId].candidates[i].numCanVotes;
        }

        return categoryVotes;
    }

    function getCategoryWinner(uint64 _catId) internal view categoryClosed(_catId) returns(string memory) {

        string memory categoryWinner = "no winner";
        uint categoryWinnerVotes = 0;

        for(uint8 i = 0; i < categories[_catId].candidates.length; i++) {

            uint currentCandidateVotes = categories[_catId].candidates[i].numCanVotes;

            if(currentCandidateVotes > categoryWinnerVotes) {
                categoryWinner = categories[_catId].candidates[i].name;
                categoryWinnerVotes = currentCandidateVotes;
            }
        }

        return categoryWinner;
    }

    function getCategoryName(uint64 _catId) external view returns(string memory) {
        return categories[_catId].name;
    }

    function getCategoryOpen(uint64 _catId) external view returns(bool) {
        return categories[_catId].open;
    }

    function getCandidate(uint64 _catId, uint8 _canId) external view returns(string memory) {
        return categories[_catId].candidates[_canId].name;
    }
    
    function getCandidateVotes(uint64 _catId, uint8 _canId) external view returns(uint) {
        return categories[_catId].candidates[_canId].numCanVotes;
    }

// Security functions ------------------------------------------------------------------------------------------------------------------------------------------------------

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "No funds in contract");
        payable(msg.sender).transfer(address(this).balance);
    }

    fallback() payable external {
         emit donationReceived(msg.sender, msg.value, msg.data);
    }
}