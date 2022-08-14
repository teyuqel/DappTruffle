// SPDX-License-Identifier: MIT
pragma solidity >=0.4.15 <0.9.0;

contract Migrations {
  address public owner = msg.sender;
  uint public last_completed_migration;
	modifier restricted() {
    
    _;
  }
  

  function setCompleted(uint completed) public restricted {
    last_completed_migration = completed;
  }
}
