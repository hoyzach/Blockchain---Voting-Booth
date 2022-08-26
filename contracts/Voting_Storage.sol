// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.4;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract VotingStorage is Ownable, Pausable{

     address public currentFuncAddress;

    //prevents non registered addresses from voting on the application
    modifier registered() {
        require(_registry[msg.sender] == true, "This wallet address is not yet registered");
        _;
    }

    //prevents calling functions that require a category to be closed and when the category is open
    modifier categoryClosed(uint256 _catId) {
        require(categories[_catId].open == false, "This action cannot be performed when the category is open");
        _;
    }

    //prevents calling functions that require a category to be open when the category is closed
    modifier categoryOpen(uint256 _catId) {
        require(categories[_catId].open == true, "This action cannot be performed when the category is closed");
        _;
    }

    struct Candidate {
        bytes32 name;
        uint248 numCanVotes;
        uint8 canId;
    }

    struct Category {
        bytes32 name;
        Candidate[] candidates;
        bool open;
        uint256 catId;
    }

    Category[] public categories;

    uint128 public _catCounter;
    
    // total voters registered on application
    uint128 public _voterCount;
    // total votes recorded on application
    uint256 public _totalVotes;

    // address => bool --- list of voter addresses registered to site
    mapping (address => bool) public _registry;
    // address => categoryId => bool --- 1 vote per voter per category
    mapping (address => mapping(uint256 => bool)) public _boolVoter;
    // categoryId => bool --- categories can only be opened one time
    mapping (uint256 => bool) public _openedOnce;

    // spare sotrage for upgrades - taken out for efficiency
    /*
    mapping (uint => bool) public _uintboolStorage;
    mapping (address => bool) public _addressboolStorage;
    mapping (address => uint64) public _addressuintStorage;
    */
}