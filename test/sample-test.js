const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Marketplace", function() {
  it("Should create and execute market sales", async function() {
    /* deploy the marketplace */
    const Market = await ethers.getContractFactory("Marketplace")
    const market = await Market.deploy()
    await market.deployed()
    const marketAddress = market.address

    /* deploy the NFT contract */
    const NFT = await ethers.getContractFactory("Token")
    const nft = await NFT.deploy(marketAddress)
    await nft.deployed()
    const nftContractAddress = nft.address


    const auctionPrice = ethers.utils.parseUnits('1', 'ether')
    const stakedPrice = ethers.utils.parseUnits('0.5', 'ether')

    await nft.createToken("https://www.mytokenlocation.com")
    await nft.createToken("https://www.mytokenlocation2.com")

    const [owner, buyerAddress] = await ethers.getSigners()

    console.log((await owner.getBalance()).toString())

    await market.transferNFT(nftContractAddress, 1, buyerAddress.address, { value: stakedPrice })

    console.log((await owner.getBalance()).toString())
  
    items = await market.connect(buyerAddress).fetchMyNFTs()
    
    await market.connect(buyerAddress).approve(1)

    console.log((await owner.getBalance()).toString())

    items = await Promise.all(items.map(async i => {
      const tokenUri = await nft.tokenURI(i.tokenId)
      let item = {
        price: i.price.toString(),
        tokenId: i.tokenId.toString(),
        seller: i.seller,
        owner: i.owner,
        tokenUri
      }
      return item
    }))
    //console.log('items: ', items)
  })
})