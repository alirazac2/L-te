# UserProfile Contract Guide
(Har user ka apna alag contract hota hai jisme uska data store hota hai)

## Functions

### `addData(string newData)`
- **Maqsad**: Apni profile mein naya data add karna. Ye data aam tor par JSON format mein hota hai (jese bio, links, theme info).

### `updateData(string newData)`
- **Maqsad**: Existing data ko nayi information se replace/update karna.

### `getMainInfo()`
- **Maqsad**: User ka Username aur Wallet Address return karna.

### `getUserData()`
- **Maqsad**: User ka sara stored data (JSON string) wapis lena taake frontend pe show kiya ja sakay.

### `getWalletAddress()`
- **Maqsad**: Is profile ke owner ka wallet address dekhna.

### `username()`
- **Maqsad**: Is profile ka username dekhna.

### `wallet()`
- **Maqsad**: Is profile ka wallet address dekhna.

### `profileHub()`
- **Maqsad**: Us ProfileHub contract ka address dekhna jisne ye profile banayi thi.
