const { ethers, upgrades } = require("hardhat");

async function main() {
  const contractName = "BridgeBSC"; // New contract name
  console.log("Upgrading to " + contractName + "...");
  const BridgeBSCContractV2 = await ethers.getContractFactory(contractName);

  // The address of the existing proxy
  const existingProxyAddress = "";

  const upgraded = await upgrades.upgradeProxy(
    existingProxyAddress,
    BridgeBSCContractV2,
  );

  console.log(contractName, "upgraded at proxy address:", upgraded.address);
}
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
