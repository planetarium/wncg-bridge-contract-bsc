const { ethers, run, hardhatArguments } = require("hardhat");

const contractName = "BridgeBSC";
const contractAddress = "0x0F27696F39A38d3205f6D25F800B25D65C1168A9";

async function main() {
  console.log("Transfer Token:", process.env.TRANSFER_TOKEN);
  const args = [process.env.TRANSFER_TOKEN, process.env.OPERATOR];

  //verify
  await run("verify:verify", {
    address: contractAddress,
    contract: `contracts/${contractName}.sol:${contractName}`,
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
