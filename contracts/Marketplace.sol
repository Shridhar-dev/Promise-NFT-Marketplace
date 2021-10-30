// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract Marketplace is ReentrancyGuard {
  using Counters for Counters.Counter;
  Counters.Counter private _itemIds;
  Counters.Counter private _itemsSold;


  uint256 transferPrice = 0.01 ether;

  address owner;

  constructor() {
    owner = payable(msg.sender);
  }

  struct NFT {
    uint itemId;
    address nftContract;
    uint256 tokenId;
    address payable seller; // person putting promise to sale
    address payable owner; // current owner of promise
    uint256 price;
    bool sold;
    uint staked;
  }

  mapping(uint256 => NFT) private idToNFT;

  event NFTCreated (
    uint indexed itemId,
    address indexed nftContract,
    uint256 indexed tokenId,
    address seller,
    address owner,
    uint256 price,
    bool sold
  );


  function createNFTonMarket(
    address nftContract,
    uint256 tokenId,
    uint256 price
  ) public payable nonReentrant {
    require(price > 0, "Price must be at least 1 wei");
    require(msg.value >= (price/2), "You need to stake more or equal to half the price specified for putting items in marketplace");

    _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToNFT[itemId] =  NFT(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(address(0)),
      price,
      false,
      msg.value
    );

    IERC721(nftContract).transferFrom(msg.sender, address(this), tokenId);

    emit NFTCreated(
      itemId,
      nftContract,
      tokenId,
      msg.sender,
      address(0),
      price,
      false
    );
  }

 
  function buyNFT(
    address nftContract,
    uint256 itemId
    ) public payable nonReentrant {

    uint price = idToNFT[itemId].price;
    uint tokenId = idToNFT[itemId].tokenId;

    console.log("NFT price : %d",price);
    require(msg.value == price, "Please submit the asking price in order to complete the purchase");
    console.log("Provided value : %d",msg.value);
    _itemsSold.increment();
    idToNFT[itemId].seller.transfer(msg.value);
    IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
    idToNFT[itemId].owner = payable(msg.sender);
    idToNFT[itemId].sold = true;
    
  }

  function getPriceofNFT(uint itemId) public view returns(uint){
    return idToNFT[itemId].price;
  }

  function fetchMarketItems() public view returns (NFT[] memory) {
    uint itemCount = _itemIds.current();
    uint unsoldItemCount = _itemIds.current() - _itemsSold.current();
    uint currentIndex = 0;

    NFT[] memory items = new NFT[](unsoldItemCount);
    console.log(unsoldItemCount);
    for (uint i = 0; i < itemCount; i++) {
      if (idToNFT[i + 1].owner == address(0) && idToNFT[i + 1].sold == false) {
        uint currentId = i + 1;
        console.log(currentIndex);
        NFT storage currentItem = idToNFT[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }


  function fetchMyNFTs() public view returns (NFT[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToNFT[i + 1].owner == msg.sender) {
        itemCount += 1;
      }
    }

    NFT[] memory items = new NFT[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToNFT[i + 1].owner == msg.sender) {
        uint currentId = i + 1;
        NFT storage currentItem = idToNFT[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function fetchItemsCreated() public view returns (NFT[] memory) {
    uint totalItemCount = _itemIds.current();
    uint itemCount = 0;
    uint currentIndex = 0;

    for (uint i = 0; i < totalItemCount; i++) {
      if (idToNFT[i + 1].seller == msg.sender) {
        itemCount += 1;
      }
    }

    NFT[] memory items = new NFT[](itemCount);
    for (uint i = 0; i < totalItemCount; i++) {
      if (idToNFT[i + 1].seller == msg.sender) {
        uint currentId = i + 1;
        NFT storage currentItem = idToNFT[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function transferNFT(address nftContract,uint256 tokenId, address receipent) public payable{
      require(msg.value >= 0.1 ether, "Please submit the asking price in order to complete the purchase");
      
      _itemIds.increment();
    uint256 itemId = _itemIds.current();

    idToNFT[itemId] =  NFT(
      itemId,
      nftContract,
      tokenId,
      payable(msg.sender),
      payable(receipent),
      0,
      true,
      msg.value
    );


      //payable(address(this)).transfer(msg.value);
    
      IERC721(nftContract).transferFrom(msg.sender, receipent, itemId);
      _itemsSold.increment();
    
  }

  function approve(uint itemId) public{
      require(idToNFT[itemId].owner == msg.sender);
      idToNFT[itemId].owner = payable(0x0000000000000000000000000000000000000000);
      console.log("transferring staked to seller : %d",idToNFT[itemId].staked);
      payable(idToNFT[itemId].seller).transfer(idToNFT[itemId].staked);
      idToNFT[itemId].seller = payable(0x0000000000000000000000000000000000000000);
  }

  function disapprove(uint itemId) public{
      require(idToNFT[itemId].owner == msg.sender);
      idToNFT[itemId].owner = payable(0x0000000000000000000000000000000000000000);
      payable(owner).transfer(idToNFT[itemId].staked);
      idToNFT[itemId].seller = payable(0x0000000000000000000000000000000000000000);
  }
}