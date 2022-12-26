const arbiterAddress = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
const beneficiaryAddress = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
const depositorAddress = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";
const depositorPK =
  "ac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

async function main() {
  const depositorSigner = new ethers.Wallet(depositorPK, ethers.provider);

  const Escrow = await hre.ethers.getContractFactory("Escrow");
  const escrow = await Escrow.connect(depositorSigner).deploy(
    arbiterAddress,
    beneficiaryAddress
  );
  console.log(`Escrow deployed to address: ${escrow.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
