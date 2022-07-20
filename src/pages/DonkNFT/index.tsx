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
            <div className="right-of-first-box">
                {/*<img src={(aceSVG)} alt="ace" className="ace-logo" />*/}
                <img src='/images/logo.png' alt="logo" className="donkey-logo" />
            </div>
                <h2>DonkSwap NFT Launchpad</h2>
                <h3>Coming Soon...</h3>
        </>
    )
}
