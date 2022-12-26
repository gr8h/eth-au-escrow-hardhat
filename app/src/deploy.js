import { ethers } from 'ethers';
import Escrow from './artifacts/contracts/Escrow.sol/Escrow';

export async function deploy(signer, arbiter, beneficiary) {
  const factory = new ethers.ContractFactory(
    Escrow.abi,
    Escrow.bytecode,
    signer
  );
  return factory.deploy(arbiter, beneficiary);
}

export async function getdeployed(address, signer) {
  const factory = await new ethers.Contract(
    address,
    Escrow.abi,
    signer
  );
  return factory
}
