import { ethers } from "ethers";
import { useEffect, useState } from "react";
import { getdeployed } from "./deploy";
import Escrow from "./Escrow";

const provider = new ethers.providers.Web3Provider(window.ethereum);
const contractAddress = "0x7a2088a1bFc9d81c55368AE168C2C02570cB814F";

export async function approveDeposit(id, escrowContract, signer) {
  const gasPrice = await signer.getGasPrice();
  const txCount = await signer.getTransactionCount();
  const gasLimit = await escrowContract.estimateGas.approve(id);

  const approveTxn = await escrowContract
    .connect(signer)
    .approve(id, { gasLimit: gasLimit, gasPrice: gasPrice, nonce: txCount });
  await approveTxn.wait();
}

function App() {
  const [account, setAccount] = useState();
  const [signer, setSigner] = useState();
  const [contract, setContract] = useState();
  const [deposits, setDeposits] = useState([]);
  const [balance, setBalance] = useState();
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    async function getAccounts() {
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
      setSigner(provider.getSigner());
    }

    async function getData() {
      const contract = await getdeployed(contractAddress, signer);
      setContract(contract);

      const balance = await contract.getBalance();
      setBalance(ethers.utils.formatEther(balance));

      const contractDeposists = await contract.getDeposits();
      const mappedDeposits = contractDeposists.map((item) => {
        return {
          id: item.id.toString(),
          value: ethers.utils.formatEther(item.value),
          isApproved: item.isApproved,
          handleApprove: async () => {
            contract.on("Approved", () => {
              console.log("trigger Approved");
              setTrigger(prev => prev + 1);
            });

            await approveDeposit(
              parseInt(item.id.toString()),
              contract,
              signer
            ).then(
              setTrigger(prev => prev + 1)
            );
          },
        };
      });
      setDeposits(mappedDeposits);
    }

    console.log("------>");

    getAccounts();
    getData();
  }, [account, trigger]);

  async function addDeposit() {
    const valueIneth = document.getElementById("eth").value;
    const valueInWei = ethers.utils.parseUnits(valueIneth, "ether");

    await contract.deposit({ value: valueInWei })
    
    contract.on("Deposited", () => {
      console.log("trigger Deposited");
      setTrigger(prev => prev + 1);
    });
  }

  return (
    <div>
      <div className="contract">
        <h1> New Deposit </h1>
        <label>
          Arbiter Address
          <input
            type="text"
            id="arbiter"
            value="0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"
          />
        </label>

        <label>
          Beneficiary Address
          <input
            type="text"
            id="beneficiary"
            value="0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
          />
        </label>

        <label>
          Amount (in eth)
          <input type="text" id="eth" />
        </label>

        <div
          className="button"
          id="deploy"
          onClick={(e) => {
            e.preventDefault();
            addDeposit();
          }}
        >
          Add Deposit
        </div>
      </div>

      <div className="existing-contracts">
        <h1> Existing Deposits </h1>
        <div id="container">
          {deposits.map((deposit) => {
            return <Escrow key={deposit.id} {...deposit} />;
          })}
        </div>
      </div>

      <div className="balance">
        <h1> Balance </h1>
        <label>Escrow Balance</label>
        <div> {balance} ETH</div>
      </div>
    </div>
  );
}

export default App;
