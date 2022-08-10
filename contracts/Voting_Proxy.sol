// SPDX-License-Identifier: Unlicensed
pragma solidity 0.8.4;

import "./Voting_Storage.sol";

contract VotingProxy is VotingStorage {

    //deploy contract with pointer to current functionality contract
    constructor(address _currentFuncAddress) {
        currentFuncAddress = _currentFuncAddress;
    }

    //update pointer address to new functionality contract
    function upgrade(address _newFuncAddress) public onlyOwner whenPaused {
        currentFuncAddress = _newFuncAddress;
    }

    //fallback function
    fallback() payable external {
    
        //redirect to currentAddress
        address implementation = currentFuncAddress;
        require(currentFuncAddress != address(0));
        bytes memory data = msg.data;

        //delegate call every function call
        assembly {
            let result := delegatecall(gas(), implementation, add(data, 0x20), mload(data), 0, 0)
            let size := returndatasize()
            let ptr := mload(0x40)
            returndatacopy(ptr, 0, size)
            switch result
            case 0 {revert(ptr, size)}
            default {return(ptr,size)}
        }
    }

}