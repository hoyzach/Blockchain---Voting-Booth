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
        string _candidate;
        uint _numVotes;
    }

    // address => bool --- list of voter addresses registered to site
    mapping (address => bool) _registry;
    // address => category => bool --- 1 vote per voter per category
    mapping (address => mapping(string => bool)) _boolVoter;
    // category => candidates struct
    mapping (string => Candidate[]) _categories;
    mapping (string => bool) _open;

    // total voters registered
    uint64 public _voterCount;
    // total votes recorded on application
    uint64 public _totalVotes;
    
}