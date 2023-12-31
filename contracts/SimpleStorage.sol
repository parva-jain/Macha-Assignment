// SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.4.16 <0.9.0;

contract SimpleStorage {
    uint256 storedData;

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint) {
        return storedData;
    }
}