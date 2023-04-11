// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.1;

// Uncomment this line to use console.log
// import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract NFT is Ownable, ERC721 {
    using Strings for uint256;

    mapping(address => bool) mapWhitelist;
    mapping(address => uint8) nftsMinted;

    uint public immutable maxSupply;
    uint public pricePerNft;
    uint public maxNftPerAddress;
    bool public paused;
    bool public revealed;
    uint public totalSupply;

    string public baseURI;

    constructor(
        string memory _name,
        string memory _symbol,
        uint _maxSupply
    ) ERC721(_name, _symbol) {
        maxSupply = _maxSupply;
        paused = true;
        revealed = false;
        totalSupply = 0;
    }

    modifier onlyWhitelisted(address _address) {
        require(mapWhitelist[_address], "You are not whitelisted");
        _;
    }

    modifier notPaused() {
        require(paused == false, "Contract paused");
        _;
    }

    function addToWhitelist(address _newWhitelisted) external onlyOwner {
        require(mapWhitelist[_newWhitelisted] == false, "Already whitelisted");
        mapWhitelist[_newWhitelisted] = true;
    }

    function removeFromWhitelist(address _outWhitelisted) external onlyOwner {
        require(mapWhitelist[_outWhitelisted] == true, "Not whitelisted");
        mapWhitelist[_outWhitelisted] = false;
    }

    ///// MINT /////
    function mint(
        uint amount
    ) external payable onlyWhitelisted(msg.sender) notPaused {
        require(msg.value >= amount * pricePerNft, "Not enough ether");
        require(
            nftsMinted[msg.sender] + amount <= maxNftPerAddress,
            "Limit of nft exceeded"
        );
        require(totalSupply < maxSupply, "SOLD OUT");
        for (uint8 i = 0; i < amount; i++) {
            nftsMinted[msg.sender] += 1;
            _mint(msg.sender, totalSupply + 1); // token id 1 to maxSupply
            totalSupply++;
        }
    }

    function pause() external onlyOwner {
        require(paused == false, "Already paused");
        paused = true;
    }

    function unpause() external onlyOwner {
        require(paused == true, "Not paused");
        require(pricePerNft > 0, "pricePerNft should be > 0"); // price is not 0
        require(maxNftPerAddress > 0, "maxNftPerAddress should be > 0"); // max amount is not 0
        paused = false;
    }

    function reveal() external onlyOwner {
        require(revealed == false, "Already revealed");
        revealed = true;
    }

    function setPricePerNft(uint _pricePerNft) external onlyOwner {
        pricePerNft = _pricePerNft;
    }

    function setMaxNftPerAddress(uint _maxNftPerAddress) external onlyOwner {
        maxNftPerAddress = _maxNftPerAddress;
    }

    function setBaseURI(string memory _baseURI) public onlyOwner {
        baseURI = _baseURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view override returns (string memory) {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );
        string memory _tokenURI = baseURI;

        if (revealed) {
            return
                bytes(_tokenURI).length > 0
                    ? string(
                        abi.encodePacked(_tokenURI, tokenId.toString(), ".json")
                    )
                    : "";
        } else {
            return
                bytes(_tokenURI).length > 0
                    ? string(abi.encodePacked(_tokenURI, "0.json"))
                    : "";
        }
    }

    function withdraw() external onlyOwner {
        (bool sent, ) = msg.sender.call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    // view
    function isWhitelisted(address _address) public view returns (bool) {
        return mapWhitelist[_address];
    }

    function getNftsMinted(address _address) public view returns (uint8) {
        return nftsMinted[_address];
    }

    receive() external payable {}

    fallback() external payable {}
}
