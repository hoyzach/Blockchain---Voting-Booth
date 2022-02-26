// SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.6;

import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract VotingStorage is Ownable{

    modifier registered() {
        require(_registry[msg.sender] == true);
        _;
    }

    struct Candidate {
        string name;
        uint numCanVotes;
        uint8 canId;
    }

    struct Category {
        string category;
        Candidate[] candidates;
        bool open;
        uint64 catId;
    }

    Category[] public Categories;
    uint64 catCounter = 0;

    // address => bool --- list of voter addresses registered to site
    mapping (address => bool) public _registry;
    // address => categoryId => bool --- 1 vote per voter per category
    mapping (address => mapping(uint => bool)) public _boolVoter;

    // total voters registered
    uint64 public _voterCount;
    // total votes recorded on application
    uint64 public _totalVotes;
    
}