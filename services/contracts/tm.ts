
export const TOKEN_MANAGER_SOURCE = `// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function burn(uint256 amount) external;
}

contract TokenManager {
    address public owner;
    
    event TokensSent(address indexed token, address indexed from, address[] recipients, uint256[] amounts);
    event NativeSent(address indexed from, address[] recipients, uint256[] amounts);
    event TokensBurned(address indexed token, address indexed from, uint256 amount);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    // Function 1: Send tokens to a single recipient
    function sendToken(
        address tokenAddress, 
        address recipient, 
        uint256 amount
    ) external returns (bool) {
        require(tokenAddress != address(0), "Invalid token address");
        require(recipient != address(0), "Invalid recipient address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, recipient, amount), "Transfer failed");
        
        address[] memory recipients = new address[](1);
        recipients[0] = recipient;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;
        
        emit TokensSent(tokenAddress, msg.sender, recipients, amounts);
        return true;
    }
    
    // Function 2: Send tokens to multiple recipients (same amount for all)
    function sendTokensMultiple(
        address tokenAddress,
        address[] calldata recipients,
        uint256 amount
    ) external returns (bool) {
        require(tokenAddress != address(0), "Invalid token address");
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length <= 100, "Too many recipients");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(tokenAddress);
        uint256 totalAmount = amount * recipients.length;
        
        // First transfer all tokens to this contract
        require(token.transferFrom(msg.sender, address(this), totalAmount), "Bulk transfer failed");
        
        // Then distribute to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(token.transfer(recipients[i], amount), "Individual transfer failed");
        }
        
        uint256[] memory amounts = new uint256[](recipients.length);
        for (uint256 i = 0; i < recipients.length; i++) {
            amounts[i] = amount;
        }
        
        emit TokensSent(tokenAddress, msg.sender, recipients, amounts);
        return true;
    }
    
    // Function 3: Send tokens to multiple recipients (different amounts)
    function sendTokensMultipleCustom(
        address tokenAddress,
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external returns (bool) {
        require(tokenAddress != address(0), "Invalid token address");
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 100, "Too many recipients");
        
        IERC20 token = IERC20(tokenAddress);
        uint256 totalAmount = 0;
        
        // Calculate total amount
        for (uint256 i = 0; i < amounts.length; i++) {
            require(amounts[i] > 0, "Amount must be greater than 0");
            totalAmount += amounts[i];
        }
        
        // First transfer all tokens to this contract
        require(token.transferFrom(msg.sender, address(this), totalAmount), "Bulk transfer failed");
        
        // Then distribute to recipients
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            require(token.transfer(recipients[i], amounts[i]), "Individual transfer failed");
        }
        
        emit TokensSent(tokenAddress, msg.sender, recipients, amounts);
        return true;
    }
    
    // Function 4: Send native tokens (ETH) to a single recipient
    function sendNative(address recipient) external payable returns (bool) {
        require(recipient != address(0), "Invalid recipient address");
        require(msg.value > 0, "Must send some ETH");
        
        (bool success, ) = recipient.call{value: msg.value}("");
        require(success, "ETH transfer failed");
        
        address[] memory recipients = new address[](1);
        recipients[0] = recipient;
        uint256[] memory amounts = new uint256[](1);
        amounts[0] = msg.value;
        
        emit NativeSent(msg.sender, recipients, amounts);
        return true;
    }
    
    // Function 5: Send native tokens (ETH) to multiple recipients (same amount for all)
    function sendNativeMultiple(address[] calldata recipients) external payable returns (bool) {
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length <= 100, "Too many recipients");
        require(msg.value > 0, "Must send some ETH");
        
        uint256 amountPerRecipient = msg.value / recipients.length;
        require(amountPerRecipient > 0, "Amount per recipient too small");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            (bool success, ) = recipients[i].call{value: amountPerRecipient}("");
            require(success, "ETH transfer failed");
        }
        
        uint256[] memory amounts = new uint256[](recipients.length);
        for (uint256 i = 0; i < recipients.length; i++) {
            amounts[i] = amountPerRecipient;
        }
        
        emit NativeSent(msg.sender, recipients, amounts);
        return true;
    }
    
    // Function 6: Send native tokens (ETH) to multiple recipients (different amounts)
    function sendNativeMultipleCustom(
        address[] calldata recipients,
        uint256[] calldata amounts
    ) external payable returns (bool) {
        require(recipients.length > 0, "No recipients provided");
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length <= 100, "Too many recipients");
        
        uint256 totalAmount = 0;
        
        for (uint256 i = 0; i < amounts.length; i++) {
            require(amounts[i] > 0, "Amount must be greater than 0");
            totalAmount += amounts[i];
        }
        
        require(msg.value == totalAmount, "ETH sent doesn't match total amount");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient address");
            (bool success, ) = recipients[i].call{value: amounts[i]}("");
            require(success, "ETH transfer failed");
        }
        
        emit NativeSent(msg.sender, recipients, amounts);
        return true;
    }
    
    // Function 7: Burn tokens (assuming token has burn function)
    function burnToken(address tokenAddress, uint256 amount) external returns (bool) {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(tokenAddress);
        
        // Transfer tokens from sender to this contract first
        require(token.transferFrom(msg.sender, address(this), amount), "Transfer failed");
        
        // Then burn them (requires token to have burn function)
        token.burn(amount);
        
        emit TokensBurned(tokenAddress, msg.sender, amount);
        return true;
    }
    
    // Function 8: Burn tokens directly from sender (alternative method)
    function burnTokenDirect(address tokenAddress, uint256 amount) external returns (bool) {
        require(tokenAddress != address(0), "Invalid token address");
        require(amount > 0, "Amount must be greater than 0");
        
        IERC20 token = IERC20(tokenAddress);
        
        // Use transferFrom to burn directly (if token supports burning via transferFrom)
        require(token.transferFrom(msg.sender, address(0xdead), amount), "Burn transfer failed");
        
        emit TokensBurned(tokenAddress, msg.sender, amount);
        return true;
    }
    
    // Emergency function to withdraw any stuck tokens
    function withdrawStuckTokens(address tokenAddress) external onlyOwner {
        IERC20 token = IERC20(tokenAddress);
        uint256 balance = token.balanceOf(address(this));
        require(balance > 0, "No tokens to withdraw");
        require(token.transfer(owner, balance), "Withdrawal failed");
    }
    
    // Emergency function to withdraw stuck ETH
    function withdrawStuckETH() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No ETH to withdraw");
        (bool success, ) = owner.call{value: balance}("");
        require(success, "ETH withdrawal failed");
    }
    
    // Receive function to accept ETH
    receive() external payable {}
    
    // Fallback function
    fallback() external payable {}
}
`;
