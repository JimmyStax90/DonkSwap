import React from 'react'

export default function DonkNFT() {
    return (
        <>
            {/* @ts-ignore */}
            <style jsx global>{`
        .donkLogo {
          display: none !important;
        }
      `}</style>
            <img src="/images/logo.png" style={{ zIndex: 0, width: 'min-content', marginBottom: 26, marginTop: '-31px' }} />
                <h2>DonkSwap Minting Dapp</h2>
                <h3>Coming soon...</h3>
        </>
    )
}
