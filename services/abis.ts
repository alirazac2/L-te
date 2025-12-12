export const ProfileContractABI = [
    {
        "inputs": [
            { "internalType": "string", "name": "_username", "type": "string" },
            { "internalType": "address", "name": "_wallet", "type": "address" }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    { "inputs": [], "name": "EmptyData", "type": "error" },
    { "inputs": [], "name": "EmptyUsername", "type": "error" },
    { "inputs": [], "name": "ReentrantCall", "type": "error" },
    { "inputs": [], "name": "Unauthorized", "type": "error" },
    {
        "anonymous": false,
        "inputs": [{ "indexed": false, "internalType": "string", "name": "data", "type": "string" }],
        "name": "DataAdded",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": false, "internalType": "string", "name": "oldData", "type": "string" },
            { "indexed": false, "internalType": "string", "name": "newData", "type": "string" }
        ],
        "name": "DataUpdated",
        "type": "event"
    },
    {
        "inputs": [{ "internalType": "string", "name": "newData", "type": "string" }],
        "name": "addData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMainInfo",
        "outputs": [
            { "internalType": "string", "name": "", "type": "string" },
            { "internalType": "address", "name": "", "type": "address" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getUserData",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getWalletAddress",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "profileHub",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "newData", "type": "string" }],
        "name": "updateData",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "username",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "wallet",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
];

export const MainRegistryABI = [
    { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
    {
        "inputs": [{ "internalType": "string", "name": "username", "type": "string" }],
        "name": "checkUsernameAvailability",
        "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
        "stateMutability": "view",
        "type": "function"
    }
];

export const ProfileHubABI = [
    {
        "inputs": [{ "internalType": "address", "name": "_registry", "type": "address" }],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "string", "name": "username", "type": "string" },
            { "indexed": true, "internalType": "address", "name": "wallet", "type": "address" },
            { "indexed": false, "internalType": "address", "name": "profileContract", "type": "address" }
        ],
        "name": "ProfileCreated",
        "type": "event"
    },
    {
        "inputs": [{ "internalType": "string", "name": "username", "type": "string" }],
        "name": "createProfile",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getAllUsernames",
        "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "username", "type": "string" }],
        "name": "getProfile",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "address", "name": "wallet", "type": "address" }],
        "name": "getUserByWallet",
        "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [{ "internalType": "string", "name": "username", "type": "string" }],
        "name": "getWalletByUsername",
        "outputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "stateMutability": "view",
        "type": "function"
    }
];