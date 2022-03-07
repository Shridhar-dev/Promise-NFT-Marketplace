import { ethers } from 'ethers'
import Web3Modal from "web3modal"

import { tokenAddress, marketAddress } from './addresses.config.js'

import Market from "./artifacts/contracts/Marketplace.sol/Marketplace.json"
import Token from "./artifacts/contracts/Token.sol/Token.json"

async function connectWallet(){
    
    const web3Modal = new Web3Modal({
        network: "rinkeby",
        cacheProvider: true,
    })
    const connection = await web3Modal.connect()
    const provider = new ethers.providers.Web3Provider(connection)
    const signer = provider.getSigner();
    const signerAddress = await signer.getAddress();
    const marketplaceContract = new ethers.Contract(marketAddress, Market.abi, signer)
    const tokenContract = new ethers.Contract(tokenAddress, Token.abi, signer)

    return {
        signer:signer,
        marketplaceContract:marketplaceContract,
        tokenContract:tokenContract,
        signerAddress:signerAddress
    }
}

export default connectWallet;