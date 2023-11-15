// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";

contract YourToken is ERC20Capped {
    address public owner;

    struct Blog{
        uint blogId;
        string title;
        string content;
        string rating;
        uint likesCnt;
        uint dislikesCnt;
        address[] likedUsers;
        address[] dislikedUsers;
        address author;
        uint creationTime;
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

    function withdrawTokens() external onlyOwner {

    uint256 contractBalance = balanceOf(address(this));
    require(contractBalance > 0, "No tokens to withdraw");
    _transfer(address(this), owner, contractBalance);

    }

    constructor()
        ERC20("NewsPulse", "NP")
        ERC20Capped(100000000000000 * 1e18)
    {
        // 1,000,000 YT tokens with 18 decimal places (1e18)
        _mint(msg.sender, 5000 * 1e18);
        owner = msg.sender;
    }

    // Allow users to send 0.01 ETH to receive 500 tokens
   function receiveTokens(uint256 val) public payable returns (string memory) {

    require(
        msg.value >= 0.001 ether,
        "Send minimum of 500 tokens to receive"                           
    );

    uint256 tokensToMint = val * 1e18; // 500 tokens with 18 decimal places
    // require(totalSupply() + tokensToMint <= cap(), "Token cap exceeded");
    _mint(msg.sender, tokensToMint);

    return "Success: Tokens received!";

    }

    function postSomething(string memory title, string memory content) public returns (bool) {
        require(
            balanceOf(msg.sender) >= 100 * 1e18,
            "Insufficient tokens to post"
        );
        _transfer(msg.sender, address(this), 100 * 1e18); // Burn 500 tokens from the user
        uint currentTime = block.timestamp;

        Blog memory newBlog = Blog({
        title: title,
        content: content,
        rating:"Not yet rated",
        likesCnt: 0,
        dislikesCnt: 0,
        likedUsers: new address[](0),
        dislikedUsers: new address[](0),
        author: msg.sender,
        blogId: numOfBlogs,
        creationTime:currentTime
    });

    numOfBlogs++;

    blogs.push(newBlog); // Add the new blog to the array of blogs

    return true;
        
    }

    function likePost(uint256 blogIndex) public returns (bool) {

    Blog storage blog = blogs[blogIndex];

    require(blog.author != msg.sender,"You cannot like your own post");

    require(balanceOf(msg.sender) >= 5 * 1e18, "Insufficient tokens to like the post");

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
        _transfer(sender, blog.author, 5 * 1e18);
        // Record the like
        blog.likesCnt++;

        if(blog.likesCnt > blog.dislikesCnt || blog.likesCnt > 4){
            blog.rating="People are liking your post";
            }else{
                blog.rating="People are not liking your post";
            }

        }

    return true;

    }

    function dislikePost(uint256 blogIndex) public returns (bool) {

        Blog storage blog = blogs[blogIndex];

        require(blog.author != msg.sender,"You cannot dislike your own post");
        
        require(balanceOf(msg.sender) >= 5 * 1e18, "Insufficient tokens to dislike the post");

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
            _transfer(blog.author ,address(this), 2 * 1e18);

            // Record the dislike
            blog.dislikesCnt++;

            if( blog.dislikesCnt > blog.likesCnt  || blog.dislikesCnt > 4){
                blog.rating="People are not liking your post";
            }else{
                blog.rating="People are liking your post";
            }

        }

        return true;

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


    function getBlog_Single(uint index) public view returns(Blog memory){
        Blog storage blog = blogs[index];
        return blog;
    }

    function deleteBlog(uint256 blogIndex) public returns (bool) {

    require(blogIndex < blogs.length, "Invalid blog index");

    Blog storage blogToDelete = blogs[blogIndex];

    require(blogToDelete.author == msg.sender,"You cannot delete others post");

    _transfer(blogToDelete.author, address(this), 20 * 1e18);

    // Create an empty space in the array at the given index
    blogs[blogIndex] = Blog({
        title: "",
        content: "",
        rating: "",
        likesCnt: 0,
        dislikesCnt: 0,
        likedUsers: new address[](0),
        dislikedUsers: new address[](0),
        author: address(0),
        blogId: 0,
        creationTime: 0
    });
    return true;
    }       

}