# MainRegistry Contract Guide
(Is contract ka maqsad factories (jese ProfileHub) ko manage karna hai)

## Functions

### `blockUsername(string username)`
- **Maqsad**: Kisi specific username ko block karna taake koi usay register na kar sakay.
- **Kaun kar sakta hai**: Sirf Admin/Owner.

### `checkUsernameAvailability(string username)`
- **Maqsad**: Check karna ke kya ye username available hai ya kisi ne le liya hai.
- **Output**: `true` (available hai) ya `false` (taken hai).

### `checkWalletAvailability(address wallet)`
- **Maqsad**: Check karna ke kya is wallet address par pehle se koi profile registered hai.
- **Output**: `true` (available hai) ya `false` (taken hai).

### `createProfileHub()`
- **Maqsad**: Naya Profile Hub contract deploy karna aur register karna.
- **Output**: Naye contract ka address.

### `deployer()`
- **Maqsad**: Contract deploy karne walay ka address dekhna.

### `getAllFactories()`
- **Maqsad**: Registered tamaam factories ki list lena.

### `getFactoryCount()`
- **Maqsad**: Total kitni factories registered hain, wo number dekhna.

### `getUsernameFactory(string username)`
- **Maqsad**: Ye pata karna ke user (username) kis factory contract ke zariye banaya gaya tha.

### `getWalletFactory(address wallet)`
- **Maqsad**: Ye pata karna ke user (wallet) kis factory contract ke zariye banaya gaya tha.

### `isUsernameBlocked(string username)`
- **Maqsad**: Check karna ke kya ye username blocked list mein hai.

### `owner()`
- **Maqsad**: Current owner ka address dekhna.

### `pause()`
- **Maqsad**: Contract ko temporary tor par rok dena (emergency ke liye).

### `paused()`
- **Maqsad**: Check karna ke contract roka hua hai ya chal raha hai.

### `registerFactory(address factory)`
- **Maqsad**: Koi nayi factory manually register karna.

### `registeredFactories(address)`
- **Maqsad**: Verify karna ke kya ye address registered factory hai.

### `transferOwnership(address newOwner)`
- **Maqsad**: Contract ki malkiyat kisi aur address ko dena.

### `unblockUsername(string username)`
- **Maqsad**: Kisi blocked username ko wapis allow karna.

### `unpause()`
- **Maqsad**: Rokay hue contract ko wapis chalana.

### `unregisterFactory(address factory)`
- **Maqsad**: Kisi factory ko system se hatana.
