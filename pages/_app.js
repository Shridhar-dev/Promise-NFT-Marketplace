import '../styles/globals.css'
import Link from 'next/link'
import { createContext, useEffect, useState } from 'react'
import connectWallet from '../utils';

let Config = createContext();

function MyApp({ Component, pageProps }) {
  
  const [signer, setSigner] = useState();
  const [tokenContract, setTokenContract] = useState()
  const [marketplaceContract, setMarketplaceContract] = useState()
  const [signerAddress, setSignerAddress] = useState()
  const [navBar, setNavBar] = useState('hidden')
  
  useEffect(() => {
    async function initialize(){
      let data = await connectWallet();
      setSigner(data.signer);
      setMarketplaceContract(data.marketplaceContract);
      setTokenContract(data.tokenContract);
      setSignerAddress(data.signerAddress)
    }
    initialize();
  }, [])


  return (
    <div className="min-h-screen text-white bg-black">
      <nav className="w-full p-10 py-8 flex justify-between items-center sticky top-0 bg-black z-10">
        <Link href="/">
            <a>
              Promise 🤝
            </a>
        </Link>
        <div>
          <button className="border ml-auto mr-5 rounded py-3 px-5 visible md:hidden" onClick={()=>{navBar === "hidden" ? setNavBar("flex") : setNavBar("hidden") }} >
            =
          </button>
          <div className={`flex-1 w-full ${navBar} flex-col items-center md:flex-row fixed md:static md:flex left-0`} >
            <Link href="/marketplace">
                <a className=" py-4 bg-black w-full text-center">
                  Marketplace
                </a>
            </Link>
            <Link href="/dashboard">
                <a className="mx-10 py-4 bg-black w-full text-center">
                  Dashboard
                </a>
            </Link>
            <button onClick={()=>{connectWallet()}} className=" py-4 bg-black w-full text-center">
              {signerAddress ? signerAddress.slice(0, 10).concat('...') : "Connect"}
            </button>
          </div>
        </div>
      </nav>
      <Config.Provider value={{
        signer:signer,
        tokenContract:tokenContract,
        marketplaceContract:marketplaceContract
      }}>
        <div className="px-10 mx-auto" style={{maxWidth:'1500px'}}>
          <Component {...pageProps} />
        </div>
      </Config.Provider>
    </div>
  )
}

export default MyApp
export {Config}