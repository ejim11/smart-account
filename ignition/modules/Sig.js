// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition
const hre = require('hardhat');
const { buildModule } = require('@nomicfoundation/hardhat-ignition/modules');

const getSignature = async () => {
  const [signer0] = hre.ethers.getSigners();
  const signature = signer0.signMessage(
    hre.ethers.getBytes(hre.ethers.id('wee'))
  );
  return signature;
};

const signature = await getSignature();

module.exports = buildModule('Sig', (m) => {
  const sig = m.contract('Test', [signature]);

  console.log(sig);

  return { sig };
});
