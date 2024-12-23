const hre = require("hardhat");

const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const EP_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// CREATE OPP CODE: hash(deployer + nonce)
// CREATE2 OPP CODE: hash(0xFF + deployer + bytecode + salt)

function encodeNum(value) {
  // Large number
  const abiCoder = new hre.ethers.AbiCoder();
  const encodedValue = abiCoder.encode(["uint256"], [value]);
  return encodedValue;
}

async function main() {
  const [signer0] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const ep = await hre.ethers.getContractAt("EntryPoint", EP_ADDRESS);

  console.log("Checking available methods on EntryPoint...");
  console.log(ep);

  const sender = await hre.ethers.getCreateAddress({
    from: FACTORY_ADDRESS,
    nonce: FACTORY_NONCE,
  });

  console.log(sender);

  const AccountFactory = await hre.ethers.getContractFactory("AccountFactory");

  const initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData("createAccount", [address0])
      .slice(2);

  const Account = await hre.ethers.getContractFactory("Account");

  const depositTx = await ep.depositTo(sender, {
    value: hre.ethers.parseEther("100"),
  });
  await depositTx.wait();
  const balance = await ep.balanceOf(sender);
  console.log("Deposited balance:", balance.toString());

  const userOp = {
    sender,
    nonce: await ep.getNonce(sender, 0),
    initCode,
    callData: Account.interface.encodeFunctionData("execute"),
    // accountGasLimits: hre.ethers.zeroPadBytes(
    //   hre.ethers.hexlify(encodeNum(500_000)),
    //   32
    // ),
    callGasLimit: 200_000,
    maxFeePerGas: hre.ethers.parseUnits("10", "gwei"),
    maxPriorityFeePerGas: hre.ethers.parseUnits("5", "gwei"),
    preVerificationGas: 500_000,
    verificationGasLimit: 200_000,
    // gasFees: hre.ethers.zeroPadBytes(hre.ethers.hexlify(encodeNum(10_000)), 32),
    paymasterAndData: "0x",
    signature: "0x",
  };

  console.log(userOp);

  const tx = await ep.handleOps([userOp], address0, {
    gasLimit: BigInt(30000000),
  });
  console.log("transaction");
  const receipt = await tx.wait();
  console.log(receipt);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

// address sender;
// uint256 nonce;
// bytes initCode;
// bytes callData;
// bytes32 accountGasLimits;
// uint256 preVerificationGas;
// bytes32 gasFees;
// bytes paymasterAndData;
// bytes signature;
