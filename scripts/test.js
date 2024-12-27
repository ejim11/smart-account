const hre = require("hardhat");

const EP_ADDR = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

const ACC_ADDR = "0x75537828f2ce51be7289709686A69CbFDbB714F1";

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
