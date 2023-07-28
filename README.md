# Assignment

This project aims to interact with deployed smart contract functions without using any client-side wallet library. The *index.js* script uses low-level API calls for signing and broadcasting transactions into the blockchain. 

For running the project locally, install the dependencies first 
``` shell
npm install
```

Then create a .env file and paste the following credentials - 
```
INFURA_URL=<YOUR_INFURA_URL>
ACCOUNT_ADDRESS=<YOUR_ACCOUNT_ADDRESS>
PRIVATE_KEY=<CORRESPONDING_PRIVATE_KEY>
```

Finally run the script for preparing, signing, and broadcasting the transaction - 
```shell
node index.js
```

## Project Description

The contracts folder consists of SimpleStorage.sol file which contains a simple smart contract for reading and storing an integer. We will call this contracts' *set(uint256 x)* function from a backend script without using any wallet and contract instance.

The scripts folder contains the deploy.js file which deploys the contract on execution.

The utils.js file exports CONTRACT_ABI and CONTRACT_ADDRESS.

The index.js file is the main script for creating, signing, and broadcasting the transaction. On successful execution, it logs the transaction receipt which can be used to verify the successful execution of the transaction.

It uses "ethereumjs-tx" library for creating a transaction. The key features of the index.js scripts are as follows:

- Firstly we calculate the nonce for our account address through the following API call - 
```Javascript
const nonce = await axios.post(INFURA_URL, {
      jsonrpc: "2.0",
      method: "eth_getTransactionCount",
      params: [myAccount, "latest"],
      id: 1,
});
 ```

- Then we prepare the calldata which contains information about the function to be called and its arguments.
```Javascript
// Encode the function signature
const functionSignature = web3.utils.keccak256("set(uint256)").slice(0, 10);

// Encode the function parameters
const functionParameter = web3.eth.abi.encodeParameter("uint256", "50"); // setting value to 100

// Concatenate the function signature and parameters to form the calldata
const calldata = `${functionSignature}${functionParameter.slice(2)}`; // remove prefix 0x from functionParameter
```

- Next step is to obtain gas information.
```Javascript
const gasEstimate = await web3.eth.estimateGas({
      from: myAccount,
      to: CONTRACT_ADDRESS,
      data: calldata,
});

const gasPrice = await web3.eth.getGasPrice();
```

- The final steps include creating a transaction object, signing and serializing it and making API call for sending signed transaction using **eth_sendRawTransaction** method.
```Javascript
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

const serializedTx = tx.serialize();
const rawTx = "0x" + serializedTx.toString("hex");

const txReceipt = await axios.post(INFURA_URL, {
      jsonrpc: "2.0",
      method: "eth_sendRawTransaction",
      params: [rawTx],
      id: 1,
});
```




