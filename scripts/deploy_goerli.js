
const ethers = require('ethers');
require('dotenv').config();

async function main() {
  const url = process.env.GOERLI_URL;
  const privateKey = process.env.PRIVATE_KEY;

  let artifacts = await hre.artifacts.readArtifact("Escrow");

  const provider = new ethers.providers.JsonRpcProvider(url);

  let wallet = new ethers.Wallet(privateKey, provider);

  let factory = new ethers.ContractFactory(artifacts.abi, artifacts.bytecode, wallet);

  let faucet = await factory.deploy();

  console.log("Faucet address:", faucet.address);

  await faucet.deployed();
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
