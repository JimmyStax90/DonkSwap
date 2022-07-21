import React from 'react'
// import aceSVG from "../Home/images/Ace.svg";

export default function DonkNFT() {
    return (
        <>
            {/* @ts-ignore */}
            <style jsx global>{`
        .donkLogo {
          display: none !important;
        }
      `}</style>
            <div className="container_100">
            <div  style={{width: '100%', height: '100%'}}>
                {/*<img src={(aceSVG)} alt="ace" className="ace-logo" />*/}
                <img src='/images/logo.png' alt="logo" style={{position: 'relative'}} className="animated-logo" />
            </div>
                <h2 style={{textAlign: 'center'}}>DonkSwap Minting Dapp</h2>
                <h3 style={{textAlign: 'center'}}>Coming soon...</h3>
            </div>

        </>
    )
}
