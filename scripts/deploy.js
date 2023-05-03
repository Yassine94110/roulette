const hre = require("hardhat");

async function main() {
  const Roulette = await hre.ethers.getContractFactory("Roulette");
  const roulette = await Roulette.deploy();
  await roulette.deployed();
  console.log("l'adresse du smart contract:", roulette.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
