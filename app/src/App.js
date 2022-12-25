import { ethers } from "ethers";
import { useEffect, useState } from "react";
import deploy from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);

export async function approve(escrowContract, signer) {
  // Get gasLimit & gasPrice & nonce
  const gasPrice = await signer.getGasPrice();
  const txCount = await signer.getTransactionCount();
  const gasLimit = await escrowContract.estimateGas.approve();

  console.log("---------> (gasPrice, gasLimit, txCount)", gasPrice, gasLimit, txCount);

  const approveTxn = await escrowContract
    .connect(signer)
    .approve({ gasLimit: gasLimit, gasPrice: gasPrice, nonce: txCount });
  await approveTxn.wait();
}

function App() {
  const [escrows, setEscrows] = useState([]);
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);

      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    getAccounts();
  }, [account]);

  async function newContract() {
    const beneficiary = document.getElementById("beneficiary").value;
    const arbiter = document.getElementById("arbiter").value;

    const eth = document.getElementById("eth").value;
    const value = ethers.utils.parseUnits(eth, "ether");

    const txCount = await signer.getTransactionCount();
    console.log("---------> (txCount)", txCount);

    const escrowContract = await deploy(signer, arbiter, beneficiary, value);

    const escrow = {
      address: escrowContract.address,
      arbiter,
      beneficiary,
      value: eth.toString() + " ETH",
      handleApprove: async () => {
        escrowContract.on("Approved", () => {
          document.getElementById(escrowContract.address).className =
            "complete";
          document.getElementById(escrowContract.address).innerText =
            "✓ It's been approved!";
        });

        await approve(escrowContract, signer);
      },
    };

    setEscrows([...escrows, escrow]);
  }

  return (
    <>
      <div className="contract">
        <h1> New Contract </h1>
        <label>
          Arbiter Address
          <input type="text" id="arbiter" value="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC" />
        </label>

        <label>
          Beneficiary Address
          <input type="text" id="beneficiary" value="0x70997970C51812dc3A010C7d01b50e0d17dc79C8" />
        </label>

        <label>
          Deposit Amount (in eth)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();

            newContract();
          }}
        >
          Deploy
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Contracts </h1>

        <div id="container">
          {escrows.map((escrow) => {
            return <Escrow key={escrow.address} {...escrow} />;
          })}
        </div>
      </div>
    </>
  );
}

export default App;
