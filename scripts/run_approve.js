// add the game address here and update the contract name if necessary
const contactAddr = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
const arbiterPK = "5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a";

async function main() {

  const escrow = await hre.ethers.getContractAt("Escrow", contactAddr);

  const arbiterSigner = new ethers.Wallet(arbiterPK, ethers.provider);

  const tx = await escrow.connect(arbiterSigner).approve();
  const receipt = await tx.wait();

  console.log(receipt);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
