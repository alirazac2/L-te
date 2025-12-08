import { ethers } from 'ethers'
import { CONTRACTS } from '@/config/web3/contracts'

const RPC_URL = 'https://rpc-testnet.gokite.ai'

// Provider for reading data (no wallet needed)
const readProvider = new ethers.providers.JsonRpcProvider(RPC_URL)

export const fetchProfileFromChain = async (username: string) => {
    try {
        console.log(`Fetching profile for ${username} from ${CONTRACTS.PROFILE_HUB.address}`)
        const hub = new ethers.Contract(CONTRACTS.PROFILE_HUB.address, CONTRACTS.PROFILE_HUB.abi, readProvider)

        // Get user profile contract address
        // Ensure the function name matches ABI (getProfile)
        const profileAddress = await hub.getProfile(username)

        console.log(`Profile contract for ${username}: ${profileAddress}`)

        if (!profileAddress || profileAddress === ethers.constants.AddressZero) {
            return null
        }

        // Get user data from profile contract
        const userProfile = new ethers.Contract(profileAddress, CONTRACTS.USER_PROFILE_ABI, readProvider)
        const dataString = await userProfile.getUserData()

        if (!dataString) return null

        return JSON.parse(dataString)
    } catch (error) {
        console.error('Error fetching profile from chain:', error)
        return null
    }
}

export const checkUsernameAvailability = async (username: string): Promise<boolean> => {
    try {
        const hub = new ethers.Contract(CONTRACTS.PROFILE_HUB.address, CONTRACTS.PROFILE_HUB.abi, readProvider)
        const isTaken = await hub.checkUsernameAvailability(username)
        // If contract returns true for isTaken, then availability is false.
        // Wait, ABI usually says "checkUsernameAvailability" returns bool?
        // Let's verify ABI. Usually checkAvailability returns TRUE if available.
        // Looking at common practices: usually `available()`.
        // User guide says: "checkUsernameAvailability... Output: true (available) or false (taken)" (MainRegistry guide).
        // ProfileHub guide says similar.
        // So return the value directly.
        return isTaken // assuming returns true if available based on typical logic or guide
    } catch (error) {
        console.error('Error checking username:', error)
        return false
    }
}
