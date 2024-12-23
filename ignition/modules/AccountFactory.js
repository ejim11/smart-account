// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("AccountFactory", (m) => {
  const accountFactory = m.contract("AccountFactory");

  console.log(accountFactory);

  return { accountFactory };
});

// 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
