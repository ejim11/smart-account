// // SPDX-License-Identifier: UNLICENSED
// pragma solidity ^0.8.28;

// import "@account-abstraction/contracts/interfaces/IPaymaster.sol";

// contract Paymaster is IPaymaster{
   
//     function validatePaymasterUserOp(UserOperation calldata userOp, bytes32, uint256)
//     external     pure
// returns (bytes memory context, uint256 validationData){


// // Paymaster server for holding signature
// // paymaster address 20 bytes
// // timePeriod
// // signature
// userOp.paymasterAndData;

//         context = new bytes(0);
//         // 0 is a special value indicating the signature is valid and we are willing to sponsor the gas for user op
//         validationData = 0;
//     }

//     /**
//      * post-operation handler.
//      * Must verify sender is the entryPoint
//      * @param mode enum with the following options:
//      *      opSucceeded - user operation succeeded.
//      *      opReverted  - user op reverted. still has to pay for gas.
//      *      postOpReverted - user op succeeded, but caused postOp (in mode=opSucceeded) to revert.
//      *                       Now this is the 2nd call, after user's op was deliberately reverted.
//      * @param context - the context value returned by validatePaymasterUserOp
//      * @param actualGasCost - actual gas used so far (without this postOp call).
//      */
//     function postOp(PostOpMode mode, bytes calldata context, uint256 actualGasCost) external{}
// }