const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("BridgeBSC", function () {
  let bridgeBSC;
  let transferToken;
  let owner, operator, user, userB, newOperator;

  beforeEach(async function () {
    t1 = await ethers.getContractFactory("DEMO");
    transferToken = await t1.deploy();
    await transferToken.deployed();

    const BridgeBSC = await ethers.getContractFactory("BridgeBSC");
    bridgeBSC = await BridgeBSC.deploy();
    await bridgeBSC.deployed();

    // Initialize the BridgeBSC contract
    [owner, operator, user, userB, newOperator] = await ethers.getSigners();
    await bridgeBSC.initialize(transferToken.address, operator.address);
  });

  it("Should initialize with correct values", async function () {
    expect(await bridgeBSC.TRANSFER_TOKEN()).to.equal(transferToken.address);
    expect(await bridgeBSC.OPERATOR()).to.equal(operator.address);
  });

  it("Should allow sending to LibPlanet", async function () {
    const amountToUser = ethers.utils.parseUnits("1000", 18);
    await transferToken.connect(owner).transfer(user.address, amountToUser);

    const libplanetAddress =
      ethers.utils.formatBytes32String("libplanet-address");

    const amount = ethers.utils.parseUnits("10", 18);
    await transferToken.connect(user).approve(bridgeBSC.address, amount);

    await bridgeBSC.connect(user).sendToLibPlanet(amount, libplanetAddress);

    const balance = await bridgeBSC.transferredTokenBalance(user.address);
    expect(balance).to.equal(amount);
  });

  it("Should not allow sending to LibPlanet when INVALID_ZERO_AMOUNT", async function () {
    const amountToUser = ethers.utils.parseUnits("1000", 18);
    await transferToken.connect(owner).transfer(user.address, amountToUser);

    const libplanetAddress =
      ethers.utils.formatBytes32String("libplanet-address");
    const amount = ethers.utils.parseUnits("0", 18);

    await transferToken.connect(user).approve(bridgeBSC.address, amount);
    await expect(
      bridgeBSC.connect(user).sendToLibPlanet(amount, libplanetAddress),
    ).to.be.revertedWith("INVALID_ZERO_AMOUNT");
  });

  it("Should not allow sending to LibPlanet when INVALID_AMOUNT", async function () {
    const amountToUser = ethers.utils.parseUnits("1000", 18);
    await transferToken.connect(owner).transfer(user.address, amountToUser);

    const libplanetAddress =
      ethers.utils.formatBytes32String("libplanet-address");
    const amount = ethers.utils.parseUnits("11.1111", 18);

    await transferToken.connect(user).approve(bridgeBSC.address, amount);
    await expect(
      bridgeBSC.connect(user).sendToLibPlanet(amount, libplanetAddress),
    ).to.be.revertedWith("INVALID_AMOUNT");
  });

  it("Should allow the operator to change", async function () {
    await bridgeBSC.connect(operator).changeOperator(newOperator.address);
    expect(await bridgeBSC.OPERATOR()).to.equal(newOperator.address);
  });

  it("Only Operator can change operator", async function () {
    await expect(
      bridgeBSC.connect(user).changeOperator(newOperator.address),
    ).to.be.revertedWith("ONLY_OPERATOR");
  });

  it("Should allow the operator to transfer assets", async function () {
    await bridgeBSC.connect(operator).changeOperator(newOperator.address);

    const amountToUser = ethers.utils.parseUnits("1000", 18);
    await transferToken.connect(owner).transfer(user.address, amountToUser);
    const libplanetAddress =
      ethers.utils.formatBytes32String("libplanet-address");

    const amount = ethers.utils.parseUnits("5", 18);
    await transferToken.connect(user).approve(bridgeBSC.address, amount);
    await bridgeBSC.connect(user).sendToLibPlanet(amount, libplanetAddress);

    // Transfer assets by operator
    await bridgeBSC
      .connect(newOperator)
      .transferAssetByOperator(amount, userB.address);
    const userBalance = await transferToken.balanceOf(userB.address);
    expect(userBalance).to.equal(amount);
  });

  it("Should pass some requirements operator to transfer assets", async function () {
    /**
     * Set up to contract have some amount of token
     */
    const amountToUser = ethers.utils.parseUnits("1000", 18);
    await transferToken.connect(owner).transfer(user.address, amountToUser);
    const libplanetAddress =
      ethers.utils.formatBytes32String("libplanet-address");

    const amount = ethers.utils.parseUnits("5", 18);
    await transferToken.connect(user).approve(bridgeBSC.address, amount);
    await bridgeBSC.connect(user).sendToLibPlanet(amount, libplanetAddress);

    // Transfer assets by operator
    await expect(
      bridgeBSC.connect(user).transferAssetByOperator(amount, userB.address),
    ).to.be.revertedWith("ONLY_OPERATOR");

    const invalidAmount = ethers.utils.parseUnits("0", 18);
    await expect(
      bridgeBSC
        .connect(operator)
        .transferAssetByOperator(amount, ethers.constants.AddressZero),
    ).to.be.revertedWith("INVALID_ADDRESS");

    await expect(
      bridgeBSC
        .connect(operator)
        .transferAssetByOperator(invalidAmount, userB.address),
    ).to.be.revertedWith("INVALID_AMOUNT");
  });

  it("Should return total transfer amount correctly", async function () {
    await bridgeBSC.connect(operator).changeOperator(newOperator.address);
    const amountToUser = ethers.utils.parseUnits("1000", 18);
    await transferToken.connect(owner).transfer(user.address, amountToUser);
    const libplanetAddress =
      ethers.utils.formatBytes32String("libplanet-address");

    const amountString = "5";
    const amount = ethers.utils.parseUnits(amountString, 18);
    await transferToken.connect(user).approve(bridgeBSC.address, amount);
    await bridgeBSC.connect(user).sendToLibPlanet(amount, libplanetAddress);
  });

  it("Should fail when initialize is called more than once", async function () {
    await expect(
      bridgeBSC.initialize(transferToken.address, operator.address),
    ).to.be.revertedWith("Initializable: contract is already initialized");
  });
});
