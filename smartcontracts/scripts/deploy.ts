const hre = require("hardhat");
const { verify } = require("../utils/verify.js");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  // Deploy CONTRACT
  const CONTRACT = await hre.ethers.deployContract("CONTRACT", [
    deployer.address,
  ]);
  await CONTRACT.waitForDeployment();
  console.log("CONTRACT Contract Deployed at " + CONTRACT.target);
  console.log("");

  // Verify contracts (optional, only if you have an etherscan key and on testnet/mainnet)

  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("Verifying contracts...");
    await verify(
      CONTRACT.target,
      [deployer.address],
      "contracts/CONTRACT.sol:CONTRACT"
    );

    // Get CONTRACT contract instance connected with deployer signer
    const CONTRACT_ADDRESS = await hre.ethers.getContractAt(
      "CONTRACT",
      CONTRACT.target,
      deployer
    );

    // Call setCreatorTokenAddress on CONTRACT
    const tx = await CONTRACT.setCreatorTokenAddress(
      "0x1234567890abcdef1234567890abcdef12345678"
    );
    await tx.wait(1); // wait for 1 confirmation
    console.log(
      `✅ setCreatorTokenAddress called: ${"0x1234567890abcdef1234567890abcdef12345678"}`
    );
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
