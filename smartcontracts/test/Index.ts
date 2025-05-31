import { expect } from "chai";
import hre from "hardhat";
import { Contract } from "ethers";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers"; // ✅ correct import

describe("", async function () {
  let //
    deployer: HardhatEthersSigner;

  beforeEach(async () => {
    [deployer] = await hre.ethers.getSigners();
    // escrow.
  });

  it("", async function () {
    expect(null).to.equal(null);
  });
});
