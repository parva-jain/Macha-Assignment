const Tx = require("ethereumjs-tx").Transaction;
const { Web3 } = require("web3");

const axios = require("axios");
require("dotenv").config();

const { CONTRACT_ADDRESS, CONTRACT_ABI } = require("./utils");
const INFURA_URL = process.env.INFURA_URL;
const PRIV_KEY = process.env.PRIVATE_KEY;

const myAccount = process.env.ACCOUNT_ADDRESS;
const privateKey = Buffer.from(PRIV_KEY, "hex");
var web3 = new Web3(INFURA_URL);

async function smartContractInteraction() {
  try {
    // calculating nonce for the selected account
    const nonce = await axios.post(INFURA_URL, {
      jsonrpc: "2.0",
      method: "eth_getTransactionCount",
      params: [myAccount, "latest"],
      id: 1,
    });

    console.log("nonce ", web3.utils.toHex(nonce.data.result));

    // Encode the function signature
    const functionSignature = web3.utils.keccak256("set(uint256)").slice(0, 10);
    console.log("functionSignature ", functionSignature);

    // Encode the function parameters
    const functionParameter = web3.eth.abi.encodeParameter("uint256", "50"); // setting value to 100
    console.log("functionParameter ", functionParameter);

    // Concatenate the function signature and parameters to form the calldata
    const calldata = `${functionSignature}${functionParameter.slice(2)}`; // remove prefix 0x from functionParameter
    console.log("calldata ", calldata);

    const gasEstimate = await web3.eth.estimateGas({
      from: myAccount,
      to: CONTRACT_ADDRESS,
      data: calldata,
    });
    console.log("gasEstimate ", gasEstimate);

    const gasPrice = await web3.eth.getGasPrice();
    console.log("gasPrice ", gasPrice);

    const txData = {
      from: myAccount,
      nonce: web3.utils.toHex(nonce.data.result),
      gas: web3.utils.toHex(gasEstimate),
      gasPrice: web3.utils.toHex(gasPrice),
      to: CONTRACT_ADDRESS,
      data: calldata,
      chainId: 5,
    };

    const tx = new Tx(txData, { chain: "goerli" });
    tx.sign(privateKey);

    console.log("tx ", tx);
    const serializedTx = tx.serialize();
    console.log("serailized ", serializedTx);
    const rawTx = "0x" + serializedTx.toString("hex");
    console.log("rawTx ", rawTx);

    const txReceipt = await axios.post(INFURA_URL, {
      jsonrpc: "2.0",
      method: "eth_sendRawTransaction",
      params: [rawTx],
      id: 1,
    });

    console.log("Transaction receipt:", txReceipt.data);
  } catch (error) {
    console.error("Error:", error.message);
  }
}

smartContractInteraction();
