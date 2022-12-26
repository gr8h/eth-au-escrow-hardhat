// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

contract Escrow {
	address public arbiter;
	address public beneficiary;
	address public depositor;

	struct Deposit {
		bool isApproved;
		uint value;
		uint id;
	}
	
	Deposit[] deposits;

	constructor(address _arbiter, address _beneficiary) {
		arbiter = _arbiter;
		beneficiary = _beneficiary;
		depositor = msg.sender;
	}

	event Deposited(uint);
	function deposit() public payable {
		require(msg.sender == depositor, "Sender is not a depositor!");

		Deposit memory d = Deposit(false, msg.value, deposits.length);
		deposits.push(d);

		emit Deposited(d.id);
	}

	event Approved(uint);
	function approve(uint id) external {
		require(msg.sender == arbiter, "Sender is not an arbiter!");
		require(address(this).balance >= 0 && deposits.length >= 0, "No deposits is found!");
		require(address(this).balance >= deposits[id].value, "Not enough balance to approve the deposit!");
		
		(bool sent, ) = payable(beneficiary).call{value: deposits[id].value}("");
 		require(sent, "Failed to send Ether");

		Deposit storage d = deposits[id];
		d.isApproved = true;
		
		emit Approved(d.id);
	}

	function getBalance() external view returns (uint) {
        return address(this).balance;
    }

	function getDeposits() external view returns (Deposit[] memory) {
        return deposits;
    }
}
