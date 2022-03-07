import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import React, { useContext, useLayoutEffect, useState } from 'react'
import { tokenAddress } from '../addresses.config'
import { Config } from '../pages/_app'

function NFT(props) {

    console.log(props.data)

    const router = useRouter()

    const context = useContext(Config)

    const [data, setData] = useState({promiseText:'',price:'0'})

    async function buyPromise(){
        let price = await context.marketplaceContract.getPriceofNFT(props.data.itemId)
        price = price.toString()
        await context.marketplaceContract.buyNFT(tokenAddress,props.data.itemId,{value:price})
        router.push("/dashboard")
    }

    async function approve(){
        await context.marketplaceContract.approve(props.data.itemId);
        await context.tokenContract.burnToken(props.data.tokenId);
        window.location.reload(false);
    }

    async function reject(){
        await context.marketplaceContract.disapprove(props.data.itemId);
        await context.tokenContract.burnToken(props.data.tokenId);
        window.location.reload(false);
    }
    
    useLayoutEffect(() => {
        async function getTokenData(){
            let tokenURI = await context.tokenContract?.tokenURI(props.data.tokenId)
            fetch(`https://ipfs.infura.io/ipfs/${tokenURI}`)
                .then(response => response.json())
                .then(dat => setData(dat));
        }
        getTokenData();
    }, []);

    
    return (
        <div className="w-full border rounded text-center py-5">
         
            <div className="font-bold text-3xl px-10 pt-5 pb-10">
                I promise {data.promiseText}
            </div>
            <div className="px-10">
                <button disabled className={`${props.data.sold && !props.self ? "visible" : "hidden"} bg-bgSecondary opacity-70 text-white py-3 w-full rounded text-md font-semibold`}>
                    SOLD
                </button>
                <button onClick={()=>{approve()}} className={`${props.self ? "visible" : "hidden"} bg-green text-white py-3 w-full rounded text-md font-semibold`}>
                    APPROVE
                </button>
                <button onClick={()=>{reject()}} className={`${props.self ? "visible" : "hidden"} bg-red text-white py-3 w-full rounded text-md font-semibold mt-3`}>
                    REJECT
                </button>
                <button onClick={()=>{buyPromise()}} className={`${props.market ? "visible" : "hidden"} bg-bgSecondary text-white py-3 w-full rounded text-md font-semibold`}>
                    BUY NOW
                </button>
                <div className="text-left text-xl font-semibold my-5">
                  Price : {data.price} ether
                </div>
                <div className="text-left">
                    <small>
                        From : {(props.data.seller).slice(0, 15).concat('...')}
                    </small>
                </div>
            </div>
            
        </div>
    )
}

export default NFT
