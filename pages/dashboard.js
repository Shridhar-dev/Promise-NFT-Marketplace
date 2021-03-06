import { useState,useEffect,useContext } from "react"
import { Config } from "./_app"
import { create as ipfsHttpClient } from 'ipfs-http-client'
import { ethers } from 'ethers'
import Head from 'next/head'
const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')
import { tokenAddress, marketAddress } from '../addresses.config'
import NFT from "../components/NFT"

function Dashboard() {
    const context = useContext(Config)
    //let data;
    const [promises, setPromises] = useState([])
    const [promisesCreated, setPromisesCreated] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [isModal, setIsModal] = useState("hidden")
    const [promiseText, setPromiseText] = useState('')
    const [price, setPrice] = useState()
    const [receipent, setReceipent] = useState('')
    
    useEffect(() => {
        loadMyPromises();
    }, [])
    
    async function loadMyPromises(){
        setPromises(await context.marketplaceContract?.fetchMyNFTs());
        loadCreatedPromises();
        setLoaded(true)
    }
    async function loadCreatedPromises(){
        setPromisesCreated(await context.marketplaceContract?.fetchItemsCreated());
    }

    async function createPromise(e){

        const data = JSON.stringify({
            promiseText,
            price
        })
        let uri = await client.add(data);

        let trx = await context.tokenContract.createToken(uri.path);
      
        let tx = await trx.wait()
        let event = tx.events[0]
        let value = event.args[2]

        let id = value.toNumber()
        
       
        await context.marketplaceContract.createNFTonMarket(tokenAddress,id,ethers.utils.parseUnits(price.toString(), 'ether'),{value:ethers.utils.parseUnits((price/2).toString(), 'ether')})

        window.location.reload(false);
    }

    async function transferPromise(e){

        const data = JSON.stringify({
            promiseText,
            price
        })
        let uri = await client.add(data);
        console.log(uri)

        let trx = await context.tokenContract?.createToken(uri.path);
        let tx = await trx.wait()
        let event = tx.events[0]
        let value = event.args[2]

        let id = value.toNumber()
    
        let trx2 = await context.marketplaceContract?.transferNFT(tokenAddress,id,receipent,{value:ethers.utils.parseUnits('0.1', 'ether')})
        await trx2.wait();
        window.location.reload(false);
    }

    return (
        loaded === false && promises?.length === 0 ? <div>Loading....</div>
        :
        <div className="w-full ">
            <Head>
                <title>Dashboard - Promise NFT{`'`}s</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <div>
                <h3 className="text-3xl mb-3">My Promises</h3>
                <small className=" text-lg">All the promises which you have bought from the marketplace or have been transferred to your account</small>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-flow-row gap-10 mt-10">
                    {
                        promises?.length === 0 ? <div>No Promises</div>
                        :
                        promises?.map((i,key)=>{
                            return(
                                <div key={key}>
                                    <NFT data={i} self={true}/>
                                </div>
                            )
                        })
                    }   
                </div>
            </div>
            <div className=" mt-10">
                <h3 className="text-3xl mb-3">Promises Sold/Created</h3>
                <small className=" text-lg">All the promises sold to people through your acc on marketplace or transferred by you  to a person</small>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 grid-flow-row gap-10 mt-10">
                    {
                        promisesCreated?.length === 0 ? <div>No Promises</div>
                        :
                        promisesCreated?.map((i,key)=>{
                            return(
                                <div key={key}>
                                    <NFT data={i}/>
                                </div>
                            )
                        })
                    }   
                </div>
            </div>
            <button onClick={()=>{isModal === "visible" ? setIsModal("hidden") : setIsModal("visible")}} className=" fixed bottom-4 rounded bg-bgSecondary py-3 px-3 shadow-lg transform hover:scale-95 transition-all duration-300">
                ??? Create your Promise
            </button>

            <div className={`w-screen h-screen flex items-center justify-center fixed bg-white bg-opacity-80 backdrop-blur-3xl top-0 left-0 ${isModal} z-20`}>
                <div className=" border-2 rounded p-5 bg-white text-black w-3/4 md:w-2/5">
                    <h5 className="text-xl mb-5">Create Promise</h5>
                    <h6>I promise....</h6>
                
                        <textarea className="p-3 rounded w-full mt-2 border" maxLength="100" onChange={(e)=>{setPromiseText(e.target.value)}} placeholder="Type your promise" value={promiseText}/>
                        <div className="mb-2">
                            <input className="p-1 px-3 rounded  mt-2 border" onChange={(e)=>{setPrice(e.target.value)}} placeholder="Enter the price" value={price}/> ether
                        </div>   
                        <hr/>
                        <div>
                            <input className="border p-1 px-3 rounded  mt-2" onChange={(e)=>{setReceipent(e.target.value)}} placeholder="Enter receipent's address" value={receipent}/> 
                        </div>  
                        <button className="bg-bgSecondary rounded mt-5 px-5 py-3" onClick={()=>{createPromise();setIsModal("hidden")}}>Sell on Marketplace</button>
                        <button className="bg-black rounded mt-5 px-5 py-3 ml-2 text-white" onClick={()=>{transferPromise();setIsModal("hidden")}}>Transfer</button>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
