import Head from 'next/head'
import Link from 'next/link'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Promise NFT{`'`}s</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex justify-center items-center text-white flex-col" style={{height:'60vh'}}>
        <h1 className="grad-text text-5xl sm:text-6xl md:text-8xl text-center font-bold mt-5" >
          Promises <br/> Decentralized.
        </h1>
        <h2 className="text-xl md:text-2xl mt-8 text-center">Sell your promises as NFT{`'`}s</h2>
        <Link href="/dashboard">
          <a>
            <button className="mt-8 rounded bg-bgSecondary py-3 px-10 shadow-lg transform hover:scale-95 transition-all duration-300">
                ✨  Start minting today
            </button>
          </a>
        </Link>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 mt-40">
          <div>
              <h1 className="grad-text text-3xl sm:text-6xl md:text-5xl font-bold " >
                Have the proof of your <br/> promises.
              </h1>
              <h3 className="text-xl sm:text-6xl md:text-xl mt-12" >
              our system aims to use nfts as a means to avoid <br/> people from breaking promises
              </h3>
          </div>
          <div>
            <div className=" w-2/3 border rounded text-center py-5 mx-auto">
                <div className="font-bold text-3xl px-10 pt-5 pb-10">
                    I promise that I will have a 1 hr talk on social media marketing
                </div>
                <div className="px-10">
                    
                    <div className="text-left">
                        <small>
                            From : 0x00000
                        </small>
                    </div>
                </div>
            </div>
          </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 grid-flow-row gap-10 mt-60" >
          <div>
              <h1 className="grad-text text-3xl sm:text-6xl md:text-5xl font-bold " >
                Approve or Reject based on whether the promise was fulfilled
              </h1>
              <h3 className="text-xl sm:text-6xl md:text-xl mt-12" >
                Based on your approval/rejection, the staked amount <br/> of the promise maker will be sent back to him or <br/> burnt respectively
              </h3>
          </div>
          <div>
              <div className=" w-2/3 border rounded text-center py-5 mx-auto">
                  <div className="font-bold text-3xl px-10 pt-5 pb-10">
                      I promise that I will have a 1 hr talk on social media marketing
                  </div>
                  <div className="px-10">
                      <button  className="visible bg-green text-white py-3 w-full rounded text-md font-semibold">
                          APPROVE
                      </button>
                      <button className="visible bg-red text-white py-3 w-full rounded text-md font-semibold mt-3">
                          REJECT
                      </button>
                      <div className="text-left mt-5">
                          <small>
                              From : 0x00000
                          </small>
                      </div>
                  </div>
              </div>
          </div>
      </section>

      <section className="mt-60" >
          <h1 className="text-5xl font-bold grad-text text-center">Demo</h1>
          <iframe className="mx-auto mt-8" width="853" height="480" src="https://www.youtube.com/embed/aWBGDitWxYE" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
      </section>

      <footer className=" mt-28 mx-auto text-center pb-10 text-xl">
          Made by team ZapDapp
      </footer>
    </div>
  )
}
