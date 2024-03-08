const { ethers, upgrades } = require("hardhat");

async function main() {
  const contractName = "BridgeBSC";
  console.log("Deploying " + contractName + "...");
  const BridgeBSCContract = await ethers.getContractFactory(contractName);
  const s = await upgrades.deployProxy(
    BridgeBSCContract,
    [
      process.env.TRANSFER_TOKEN, // _transferToken
      process.env.OPERATOR, // _operator
    ],
    {
      initializer: "initialize",
    },
  );
  await s.deployed();
  console.log(contractName, "deployed to:", s.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
