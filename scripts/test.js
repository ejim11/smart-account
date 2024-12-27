const hre = require('hardhat');

const EP_ADDR = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

const ACC_ADDR = '0xCafac3dD18aC6c6e92c921884f9E4176737C052c';
const PM_ADDR = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0';

async function main() {
  // const code = await hre.ethers.provider.getCode(EP_ADDR);

  // console.log(code);

  const smartAcc = await hre.ethers.getContractAt('Account', ACC_ADDR);
  const ep = await hre.ethers.getContractAt('EntryPoint', EP_ADDR);
  const count = await smartAcc.count();
  console.log(count);

  console.log('acc balance: ', await hre.ethers.provider.getBalance(ACC_ADDR));
  console.log('acc Ep balance: ', await ep.balanceOf(ACC_ADDR));
  console.log('acc Ep balance: ', await ep.balanceOf(PM_ADDR));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
