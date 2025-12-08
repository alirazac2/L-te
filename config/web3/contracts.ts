import MainRegistryABI from './abis/MainRegistry.json'
import ProfileHubABI from './abis/ProfileHub.json'
import UserProfileABI from './abis/UserProfile.json'

export const CONTRACTS = {
    MAIN_REGISTRY: {
        address: '0xC6144A7a09E633F902B6A407db9788A0f40E6f25',
        abi: MainRegistryABI
    },
    PROFILE_HUB: {
        // Current Hub for new user registrations
        address: '0x85BD36C574837FD01A024E3f8D242f97E55a836A',
        abi: ProfileHubABI
    },
    LEGACY_PROFILE_HUBS: [
        '0x668fd4332a072AF26589157d6B13472BDd2B025c',
        '0xE453eD52f4787B891EEF2817a3B8EBd94e9F0cee'
    ],
    // UserProfile address is dynamic (fetched per user), so we just export the ABI for utility
    USER_PROFILE_ABI: UserProfileABI
} as const

// Helper to get contract address by name
export const getContractConfig = (contractName: keyof typeof CONTRACTS) => {
    return CONTRACTS[contractName]
}
