const hre = require('hardhat');

// const FACTORY_NONCE = 1;
const FACTORY_ADDRESS = '0xE8Ae99e06f27884681B3fb889659381FF6083f04';
const EP_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const PM_ADDRESS = '0x26Eca5b350e25A2faeB2518e61C8E17D35B9aFfe';

// CREATE OPP CODE: hash(deployer + nonce)
// CREATE2 OPP CODE: hash(0xFF + deployer + bytecode + salt)

// function encodeNum(value) {
//   // Large number
//   const abiCoder = new hre.ethers.AbiCoder();
//   const encodedValue = abiCoder.encode(['uint256'], [value]);
//   return encodedValue;
// }

async function main() {
  const [signer0, signer1] = await hre.ethers.getSigners();
  const address0 = await signer0.getAddress();

  const ep = await hre.ethers.getContractAt('EntryPoint', EP_ADDRESS);

  // console.log('Checking available methods on EntryPoint...');
  // console.log(ep);

  // const sender = await hre.ethers.getCreateAddress({
  //   from: FACTORY_ADDRESS,
  //   nonce: FACTORY_NONCE,
  // });

  // console.log(sender);

  const AccountFactory = await hre.ethers.getContractFactory('AccountFactory');

  let initCode =
    FACTORY_ADDRESS +
    AccountFactory.interface
      .encodeFunctionData('createAccount', [address0])
      .slice(2);

  try {
    await ep.getSenderAddress(initCode);
  } catch (ex) {
    sender = '0x' + ex.data.slice(-40);
  }

  const smartContractCode = await hre.ethers.provider.getCode(sender);

  console.log(smartContractCode);

  if (smartContractCode !== '0x') {
    initCode = '0x';
  }

  console.log(sender);

  const Account = await hre.ethers.getContractFactory('Account');

  // const depositTx = await ep.depositTo(PM_ADDRESS, {
  //   value: hre.ethers.parseEther('100'),
  // });
  // await depositTx.wait();
  // const balance = await ep.balanceOf(PM_ADDRESS);
  // console.log('Deposited balance:', balance.toString());

  const userOp = {
    sender,
    nonce: '0x' + (await ep.getNonce(sender, 0)).toString(16),
    initCode,
    callData: Account.interface.encodeFunctionData('execute'),
    // accountGasLimits: hre.ethers.zeroPadBytes(
    //   hre.ethers.hexlify(encodeNum(500_000)),
    //   32
    // ),
    // callGasLimit: 400_000,
    // maxFeePerGas: hre.ethers.parseUnits('10', 'gwei'),
    // maxPriorityFeePerGas: hre.ethers.parseUnits('5', 'gwei'),
    // preVerificationGas: 100_000,
    // verificationGasLimit: 500_000,
    // gasFees: hre.ethers.zeroPadBytes(hre.ethers.hexlify(encodeNum(10_000)), 32),
    paymasterAndData: PM_ADDRESS,
    signature:
      '0xfffffffffffffffffffffffffffffff0000000000000000000000000000000007aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1c',
  };

  const { preVerificationGas, callGasLimit, verificationGasLimit } =
    await hre.ethers.provider.send('eth_estimateUserOperationGas', [
      userOp,
      EP_ADDRESS,
    ]);

  userOp.preVerificationGas = preVerificationGas;
  userOp.verificationGasLimit = verificationGasLimit;
  userOp.callGasLimit = callGasLimit;

  const { maxFeePerGas } = await hre.ethers.provider.getFeeData();
  userOp.maxFeePerGas = '0x' + maxFeePerGas.toString(16);

  const maxPriorityFeePerGas = await hre.ethers.provider.send(
    'rundler_maxPriorityFeePerGas'
  );

  userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

  const userOpHash = await ep.getUserOpHash(userOp);
  userOp.signature = await signer0.signMessage(hre.ethers.getBytes(userOpHash));

  const opHash = await hre.ethers.provider.send('eth_sendUserOperation', [
    userOp,
    EP_ADDRESS,
  ]);

  console.log(opHash);

  // const tx = await ep.handleOps([userOp], address0);
  // console.log('transaction');
  // const receipt = await tx.wait();
  // console.log(receipt);
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
