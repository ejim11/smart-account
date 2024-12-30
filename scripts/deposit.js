const FACTORY_ADDRESS = '0xE8Ae99e06f27884681B3fb889659381FF6083f04';
const EP_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';
const PM_ADDRESS = '0x26Eca5b350e25A2faeB2518e61C8E17D35B9aFfe';

async function main() {
  const ep = await hre.ethers.getContractAt('EntryPoint', EP_ADDRESS);

  const depositTx = await ep.depositTo(PM_ADDRESS, {
    value: hre.ethers.parseEther('0.0035'),
  });
  await depositTx.wait();
  const balance = await ep.balanceOf(PM_ADDRESS);
  console.log('Deposited balance:', balance.toString());
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
