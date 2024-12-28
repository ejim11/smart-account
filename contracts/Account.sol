// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import "@account-abstraction/contracts/core/EntryPoint.sol";
import "@account-abstraction/contracts/interfaces/IAccount.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "hardhat/console.sol";

// contract Test {
//     constructor(bytes memory sig) {
//         address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(keccak256("wee")), sig);
//         console.log(recovered);
//     }
// }

contract Account is IAccount{
uint public count;
address public owner;

constructor (address _owner) {
    owner = _owner;
}

    function validateUserOp(
        UserOperation calldata userOp ,
        bytes32 userOpHash,
        uint256 
    ) external  view returns (uint256 validationData){
        // allow any account
        // validation
        address recovered = ECDSA.recover(ECDSA.toEthSignedMessageHash(userOpHash), userOp.signature);
         console.log(recovered, owner);
        return owner == recovered ? 0: 1;
        // return 0;
    }

    function execute() external {
        count++;
    }
}

contract AccountFactory {
    function createAccount(address owner) external returns(address) {
        Account acc = new Account(owner);
        return address(acc);
    }
}