
export const STANDARD_TOKEN_ABI = [
	{
		"inputs": [{"internalType": "address","name": "account","type": "address"}],
		"name": "balanceOf",
		"outputs": [{"internalType": "uint256","name": "","type": "uint256"}],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],
		"name": "transfer",
		"outputs": [{"internalType": "bool","name": "","type": "bool"}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
    {
		"inputs": [{"internalType": "address","name": "from","type": "address"},{"internalType": "address","name": "to","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],
		"name": "transferFrom",
		"outputs": [{"internalType": "bool","name": "","type": "bool"}],
		"stateMutability": "nonpayable",
		"type": "function"
	},
    {
        "inputs": [{"internalType": "address","name": "spender","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],
        "name": "approve",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

export const TOKEN_MANAGER_ABI = [
    {
        "inputs": [{"internalType": "address","name": "tokenAddress","type": "address"},{"internalType": "address","name": "recipient","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],
        "name": "sendToken",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "tokenAddress","type": "address"},{"internalType": "address[]","name": "recipients","type": "address[]"},{"internalType": "uint256","name": "amount","type": "uint256"}],
        "name": "sendTokensMultiple",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "tokenAddress","type": "address"},{"internalType": "address[]","name": "recipients","type": "address[]"},{"internalType": "uint256[]","name": "amounts","type": "uint256[]"}],
        "name": "sendTokensMultipleCustom",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "recipient","type": "address"}],
        "name": "sendNative",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address[]","name": "recipients","type": "address[]"}],
        "name": "sendNativeMultiple",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address[]","name": "recipients","type": "address[]"},{"internalType": "uint256[]","name": "amounts","type": "uint256[]"}],
        "name": "sendNativeMultipleCustom",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "tokenAddress","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],
        "name": "burnToken",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [{"internalType": "address","name": "tokenAddress","type": "address"},{"internalType": "uint256","name": "amount","type": "uint256"}],
        "name": "burnTokenDirect",
        "outputs": [{"internalType": "bool","name": "","type": "bool"}],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];
