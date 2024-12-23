const hre = require("hardhat");

const EP_ADDR = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const ACC_ADDR = "0xCafac3dD18aC6c6e92c921884f9E4176737C052c";

async function main() {
  // const code = await hre.ethers.provider.getCode(EP_ADDR);

  // console.log(code);

  const smartAcc = await hre.ethers.getContractAt("Account", ACC_ADDR);
  const count = await smartAcc.count();
  console.log(count);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
