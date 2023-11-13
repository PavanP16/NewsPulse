// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";  

contract YourToken is ERC20Capped {
    address public owner;

    struct Blog{
        uint blogId;
        string title;
        string content;
        uint likesCnt;
        uint dislikesCnt;
        address[] likedUsers;
        address[] dislikedUsers;
        address author;
    }
    uint public numOfBlogs = 0;
    Blog[] public blogs; // An array to store all the blogs
    
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "Only the contract owner can call this function"
        );
        _;
    }

    // The owner can withdraw any Ether sent to the contract
    function withdrawEther() public onlyOwner {
        payable(owner).transfer(address(this).balance);
    }

    constructor()
        ERC20("", "")
        ERC20Capped(100000000000000 * 1e18)
    {
        // 1,000,000 YT tokens with 18 decimal places (1e18)
        _mint(msg.sender, 10000 * 1e18);
        owner = msg.sender;
    }

    // Allow users to send 0.01 ETH to receive 500 tokens
   function receiveTokens() public payable returns (string memory) {
    require(
        msg.value >= 0.001 ether,
        "Send exactly 0.001 ETH to receive tokens"                           
    );
    uint256 tokensToMint = 5000 * 1e18; // 500 tokens with 18 decimal places
    // require(totalSupply() + tokensToMint <= cap(), "Token cap exceeded");
    _mint(msg.sender, tokensToMint);

    return "Success: Tokens received!";
    }

    function postSomething(string memory title, string memory content) public {
        require(
            balanceOf(msg.sender) >= 500 * 1e18,
            "Insufficient tokens to post"
        );
        _transfer(msg.sender, address(this), 500 * 1e18); // Burn 500 tokens from the user

         Blog memory newBlog = Blog({
        title: title,
        content: content,
        likesCnt: 0,
        dislikesCnt: 0,
        likedUsers: new address[](0),
        dislikedUsers: new address[](0),
        author: msg.sender,
        blogId: numOfBlogs
    });

    numOfBlogs++;

    blogs.push(newBlog); // Add the new blog to the array of blogs
        
    }

    function likePost(uint256 blogIndex) public returns (uint256 balance) {
    require(balanceOf(msg.sender) >= 10 * 1e18, "Insufficient tokens to like the post");

    Blog storage blog = blogs[blogIndex];
    address sender = msg.sender;

    if (isUserInList(sender, blog.dislikedUsers)) {
        // Remove the user from the disliked list
        removeFromList(sender, blog.dislikedUsers);
        blog.dislikesCnt--;
    }

    if (!isUserInList(sender, blog.likedUsers)) {
        // Check if the user is not in the liked list, then add the user to the liked list
        blog.likedUsers.push(sender);

        // Transfer 10 tokens from the sender to the author
        _transfer(sender, blog.author, 10 * 1e18);

        // Record the like
        blog.likesCnt++;
    }
   
    // You can add additional logic here related to liking a post.

        return balanceOf(sender);
    }

    function dislikePost(uint256 blogIndex) public {
        require(balanceOf(msg.sender) >= 5 * 1e18, "Insufficient tokens to dislike the post");

        Blog storage blog = blogs[blogIndex];
        address sender = msg.sender;

        if (isUserInList(sender, blog.likedUsers)) {
            // Remove the user from the liked list
            removeFromList(sender, blog.likedUsers);
            blog.likesCnt--;
        }

        if (!isUserInList(sender, blog.dislikedUsers)) {
            // Check if the user is not in the disliked list, then add the user to the disliked list
            blog.dislikedUsers.push(sender);

            // Transfer 5 tokens from the sender to the contract (burn it)
            _transfer(sender, address(this), 5 * 1e18);

            // Transfer 1 token from the contract (burned tokens) to the author
            _transfer(blog.author ,address(this), 5 * 1e18);

            // Record the dislike
            blog.dislikesCnt++;
        }

        // You can add additional logic here related to disliking a post.
    }

    function isUserInList(address user, address[] storage userArray) internal view returns (bool) {
        for (uint256 i = 0; i < userArray.length; i++) {
            if (userArray[i] == user) {
                return true;
            }
        }
        return false;
    }

    function removeFromList(address user, address[] storage userArray) internal {
        for (uint256 i = 0; i < userArray.length; i++) {
            if (userArray[i] == user) {
                userArray[i] = userArray[userArray.length - 1];
                userArray.pop();
                break;
            }
        }
    }

    function getBlogs() public view returns(Blog[] memory){
        return blogs;
    }   


}