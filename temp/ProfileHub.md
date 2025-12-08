# ProfileHub Contract Guide
(Ye contract users ki profiles create aur manage karta hai)

## Functions

### `createProfile(string username)`
- **Maqsad**: Naya user profile create karna. User ka wallet address is username ke sath link ho jaye ga.

### `deleteProfile(string username)`
- **Maqsad**: Apna profile delete karna. Sirf wahi banda kar sakta hai jiski ye profile hai.

### `editProfile(string username, string newUsername)`
- **Maqsad**: Apna username change karna. Purana username free ho jaye ga aur naya assign ho jaye ga.

### `getProfile(string username)`
- **Maqsad**: Username se uska `UserProfile` contract address dhoondna.

### `getUserByWallet(address wallet)`
- **Maqsad**: Kisi wallet address se uska registered username pata karna.

### `getWalletByUsername(string username)`
- **Maqsad**: Kisi username se uska malik (wallet address) pata karna.

### `getAllUsernames()`
- **Maqsad**: System mein registered tamaam usernames ki list lena.

### `getTotalUsersCount()`
- **Maqsad**: Total kitne users registered hain, wo number dekhna.

### `checkUsernameAvailability(string username)`
- **Maqsad**: Check karna ke username free hai ya nahi.

### `checkWalletAvailability(address wallet)`
- **Maqsad**: Check karna ke wallet pehle se registered to nahi.
