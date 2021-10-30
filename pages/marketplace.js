import { ethers } from 'ethers';
import React,{ useContext, useEffect, useState } from 'react'
import { marketAddress, tokenAddress } from '../addresses.config';

import Market from "../artifacts/contracts/Marketplace.sol/Marketplace.json"
import Token from "../artifacts/contracts/Token.sol/Token.json"
import NFT from './components/NFT';

function Marketplace() {
   
    const [nfts, setNfts] = useState([])

    useEffect(() => {
       loadNFTs()
    }, [])

    async function loadNFTs(){
        const provider = new ethers.providers.JsonRpcProvider(`https://rinkeby.infura.io/v3/${process.env.NEXT_PUBLIC_PROJECT_ID}`);
        const marketplaceContract = new ethers.Contract(marketAddress, Market.abi, provider)
        const data = await marketplaceContract?.fetchMarketItems();
        setNfts(data) 
    }

    return (
        <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-flow-row gap-10 mt-10">
                    {
                        nfts?.map((i,key)=>{
                            return(
                                <div key={key}>
                                    <NFT data={i} market={true}/>
                                </div>
                            )
                        })
                    }   
            </div>
        </div>
    )
}

export default Marketplace