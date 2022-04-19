// SPDX-License-Identifier: Unlicensed

/*
Even though voter data is visible on the Ethereum blockchain, this application is written as if it isn't.
Additionally, solidity does not allow for functions to be called automatically after a specified period of time,
therefore this contract needs to use owner privileges to open and close a voting category.   
The ultimate decentralized voting application would not require owner privileges and would not allow anyone to 
see voting data as it is collected in order to discourage voting based on current voting data and to 
protect the privacy of the individual voters.

This application does not prevent the same entity from creating multiple addresses to vote from.
A separate database with a voter identifcation number obtained through a voter identification verification
process (such as a TIN or SSN number in the USA) would need to be queried through a modified register function. 
*/
pragma solidity ^0.8.0;

import "./Voting_Storage.sol";


contract VotingBooth is VotingStorage {

    event categorySet(bytes32 _func, bytes32 _categoryName, bytes32[] _candidateNames, address _from);
    event categoryStatusChange(bytes32 _func, bytes32 _categoryName, bytes32 _winner, address _from);
    event donationReceived(address _donator, uint _amount);

// Functionality ------------------------------------------------------------------------------------------------------------------------------------------------------

    //registers voter address to application
    function register() external whenNotPaused {
        //addresses cannot be registered more than once
        require(_registry[msg.sender] != true, "This address is already registered");
        _registry[msg.sender] = true;
        _voterCount++;
    }

    //returns catId for new category given category name and candidates array
    function setCategory(bytes32 _category, bytes32[] memory _candidates) external onlyOwner returns (uint64){

        //ensures number of candidates remains within amount allowable by data type for canId (uint8)
        require(_candidates.length <256, "There are too many candidates.");

        //grab current catId number
        uint64 currentCatId = _catCounter;
        _catCounter++;

        //create new categories array entry and populate category struct data
        categories.push();
        categories[currentCatId].name = _category;
        categories[currentCatId].catId = currentCatId;

        //push candidate struct data into candidates array within categories array entry
        for(uint8 i = 0; i < _candidates.length; i++) {
            categories[currentCatId].candidates.push(Candidate(_candidates[i], 0, i));
        }
        emit categorySet("New Category", _category, _candidates, msg.sender);

        return currentCatId;        
    }

    //allows owner to open a previously set category given catId
    function openCategory(uint64 _catId) external onlyOwner categoryClosed(_catId) {

        //only allow categories to be opened once
        require(_openedOnce[_catId] == false, "This category cannot be opened again");
        _openedOnce[_catId] = true;
        categories[_catId].open = true;

        emit categoryStatusChange("Category Opened", categories[_catId].name, "", msg.sender);
    }

    //allows owner to close an open category and determine winner given catId
    function closeCategory(uint64 _catId) external onlyOwner categoryOpen(_catId) returns(bytes32) {

        categories[_catId].open = false;

        //get category winner
        bytes32 winner = getCategoryWinner(_catId);

        emit categoryStatusChange("Category Closed", categories[_catId].name, winner, msg.sender);

        return winner;
    }

    //allows user to cast vote given category Id and candidate Id
    function castVote(uint64 _catId, uint8 _canId) external registered whenNotPaused categoryOpen(_catId) {

        //prevent voter from voting for another candidate in the same category
        require(_boolVoter[msg.sender][_catId] == false, "You have already voted in this category");
        _boolVoter[msg.sender][_catId] = true;

        //add vote for cadidate
        categories[_catId].candidates[_canId].numCanVotes++;

        //add vote to totalVotes
        _totalVotes++;
    }

// Getter functions ------------------------------------------------------------------------------------------------------------------------------------------------------

    //returns total number of category votes given catId
    function getCategoryVotes(uint64 _catId) public view returns(uint) {

        //loop through cadidates and sum candidate votes
        uint categoryVotes = 0;
        for(uint8 i = 0; i < categories[_catId].candidates.length; i++) {
            categoryVotes = categoryVotes + categories[_catId].candidates[i].numCanVotes;
        }

        return categoryVotes;
    }

    //returns category winner given catId
    function getCategoryWinner(uint64 _catId) internal view returns(bytes32) {

        bytes32 categoryWinner = "no winner";
        uint categoryWinnerVotes = 0;

        //loop through candidates and compare each vote count
        for(uint8 i = 0; i < categories[_catId].candidates.length; i++) {

            uint currentCandidateVotes = categories[_catId].candidates[i].numCanVotes;

            if(currentCandidateVotes > categoryWinnerVotes) {
                categoryWinner = categories[_catId].candidates[i].name;
                categoryWinnerVotes = currentCandidateVotes;
            }
        }

        return categoryWinner;
    }

    //returns category name given category Id
    function getCategoryName(uint64 _catId) external view returns(bytes32) {
        return categories[_catId].name;
    }

    //returns bool value showing if category open is true or false given category Id
    function getCategoryOpen(uint64 _catId) external view returns(bool) {
        return categories[_catId].open;
    }

    //returns candidate name given both category and candidate Ids
    function getCandidate(uint64 _catId, uint8 _canId) external view returns(bytes32) {
        return categories[_catId].candidates[_canId].name;
    }
    
    //returns candidate total votes given category and candidate Ids as long as category is closed
    function getCandidateVotes(uint64 _catId, uint8 _canId) external view categoryClosed(_catId) returns(uint) {
        return categories[_catId].candidates[_canId].numCanVotes;
    }

// Security functions ------------------------------------------------------------------------------------------------------------------------------------------------------
    
    //allows owner to pause key functions within the contract
    function pause() external onlyOwner {
        _pause();
    }
    
    //allows the owner to unpause key functions within the contract
    function unpause() external onlyOwner {
        _unpause();
    }
    
    //ensure eth cannot be trapped within the contract
    function withdraw() external onlyOwner {
        require(address(this).balance > 0, "No funds in contract");
        payable(msg.sender).transfer(address(this).balance);
    }

    receive() payable external {
         emit donationReceived(msg.sender, msg.value);
    }
}