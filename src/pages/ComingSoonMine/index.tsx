import "./stake.css";
import React, { useState, useRef, useEffect, } from 'react'
import EmbedMine from "./embedMine";
import useStaking from "../../hooks/useStaking";
import { ethers } from "ethers"
import useERC20 from "hooks/useERC20";
import { useActiveWeb3React } from '../../hooks/index';
import ConnectWalletButton from 'components/ConnectWalletButton'


export default function Mine() {
  const { account } = useActiveWeb3React();
  const [depositinputamount, setDepositInputAmount] = useState(0.0);
  const [withdrawalinputamount, setWithdrawalInputAmount] = useState(1);
  const [claiminputamount, setClaimInputAmount] = useState(0);
  const [errormessage, setErrorMessage] = useState('')
  const { stakedbalance, earnedBalance, totalStakedBalance, totalRewards, rewardRate, stake,restake, withdraw, claimReward } = useStaking();
  const { allowance, approve, balance } = useERC20();
  const total = Number(ethers.utils.formatEther(totalStakedBalance?totalStakedBalance:0));
  const rate = Number(ethers.utils.formatUnits(rewardRate?rewardRate:0,9));
  const apr = total?(rate * (3600 * 24 * 365 * 100) / total).toFixed(0):total;
  
  console.log("rewardRatetemp---->", rate);
  console.log("total------>", total);
  console.log("result---->", apr);
  /*======================= ClaimReward ===================================*/
  /*======================= ClaimReward ===================================*/
  /*======================= ClaimReward ===================================*/

  const ClaimInput = (e) => {
    setClaimInputAmount(parseInt(e.target.value));
  }
  const incrementClaimUp = () => {
    setClaimInputAmount(claiminputamount + 1);
  }
  const decrementClaimDown = () => {
    if (claiminputamount <= 0) {
      setClaimInputAmount(0);
    } else {
      setClaimInputAmount(claiminputamount - 1);
    }
  }

  const handleClickClaim = () => {
    claimReward(ethers.utils.parseEther(claiminputamount.toString()))
  }
  /*======================= DEPOSIT ===================================*/
  /*======================= DEPOSIT ===================================*/
  /*======================= DEPOSIT ===================================*/

  const depositInput = (e) => {
    setDepositInputAmount(parseFloat(e.target.value));
  }
  const incrementDepositUp = () => {
    setDepositInputAmount(depositinputamount + 1);
  }
  const decrementDepositDown = () => {
    if (depositinputamount <= 0) {
      setDepositInputAmount(0.0);
    } else {
      setDepositInputAmount(depositinputamount - 1);
    }
  }

  /*======================= WITHDRAWAL===================================*/
  /*======================= WITHDRAWAL===================================*/
  /*======================= WITHDRAWAL===================================*/

  const withdrawalInput = (e) => {
    const userInputasInt = parseInt(e.target.value)
    if (userInputasInt > 0 && userInputasInt <= 100)
    {
      setWithdrawalInputAmount(userInputasInt);
    } else if (userInputasInt > 100) {
      setWithdrawalInputAmount(100);
    } else {
      setWithdrawalInputAmount(1);
    }
  }
  const incrementWithdrwalUp = () => {
    if (withdrawalinputamount < 100)
    {
      setWithdrawalInputAmount(withdrawalinputamount + 1);
    }
  }
  const decrementWithdrawalDown = () => {
    if (withdrawalinputamount <= 1) {
      setWithdrawalInputAmount(1);
    } else {
      setWithdrawalInputAmount(withdrawalinputamount - 1);
    }
  }
  const handleClickWithdraw = () => {
    withdraw(withdrawalinputamount.toString())
  }
  /*==========================================================*/
  /*==========================================================*/

  const handleClickApprove = () => {
    approve()
  }

  const handleClickStake = () => {
    stake(ethers.utils.parseEther(depositinputamount.toString()))
  }

  const handleClickReStake = () => {
    restake()
  }

  const handleClickMax = () => {
    setDepositInputAmount(Number(ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3)));
  }

  return (
    <div className="stake-body-whole">
      <div className="floating-box"></div>
      <div className="stake-stats">
        <div>
          <h3 className="header">Staking Stats</h3>
        </div>
        
        <div className="stake-stat-second-level">
          <div className="left-display">
            <div className="balance-and-display-container">
              <h3 className="stake-title">Total Balance</h3>
              <div className="stake-stat-display">
                <p>{totalStakedBalance ? ethers.utils.formatEther(totalStakedBalance) : 0}</p>
              </div>
            </div>
            
            <div className="balance-and-display-container">
              <h3 className="stake-title">My Staked Balance</h3>
              <div className="stake-stat-display">
              <p>{stakedbalance ? ethers.utils.formatEther(stakedbalance).slice(0, ethers.utils.formatEther(stakedbalance).indexOf(".")+3) : 0}</p>
              </div>
            </div>
          </div>

          <div className="apy-stat-display-container">
            <div className="apy-stat-display">
              <div className='apy-box'>
                <h3 className="stake-title">APR</h3>
                <p>{apr ? apr.toString() : 0}%</p>
              </div>
            </div>
          </div>

          <div className="right-display">
            <div className="balance-and-display-container">
              <h3 className="stake-title">My Earned DST</h3>
              <div className="stake-stat-display">
                <p>{earnedBalance ? ethers.utils.formatUnits(earnedBalance,9).slice(0, ethers.utils.formatUnits(earnedBalance,9).indexOf(".")+3) : 0}</p>
              </div>
            </div>

            <div className="balance-and-display-container">
              <h3 className="stake-title">Total Rewards</h3>
              <div className="stake-stat-display">
                <p>{totalRewards ? ethers.utils.formatUnits(totalRewards,9).slice(0, ethers.utils.formatUnits(totalRewards,9).indexOf(".")+3) : 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      < div className="stake-body">
        <form className="stake-form">
          <h3 className="stake-title">Stake DONK-LP</h3>
          <div className="input-div">
            <input disabled={!account} onChange={depositInput} value={depositinputamount} type="number" step='any' placeholder='0.0' className="deposit-input" />
            <div className="increment-div">
              <button disabled={!account} onClick={incrementDepositUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementDepositDown} className="increment-minus">-</button>
            </div>
          </div>
          <div>
            <h6 className = {`max-value ${allowance === '0' ? 'pointer-disabled':''}`} onClick={() => account? handleClickMax:null}>
              Max:{balance ? ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3) : 0}
            </h6>
          </div>
          {
            account?
              allowance !== '0' ?
              <div>
                <button className='stake-btn' onClick={handleClickStake}>Stake</button>
                <button className='stake-btn' onClick={handleClickReStake}>ReStake</button>
              </div>
                : <button className="stake-btn" onClick={handleClickApprove}>Approve</button>
              : <ConnectWalletButton className="stake-btn" style={{'transform': 'scale(.95)'}}/>
          }
        </form>

        <form className="stake-form">
          <h3 className="stake-title">Withdraw Staked LP</h3>
          <div className="input-div">
            <input disabled={!account} onChange={withdrawalInput} value={withdrawalinputamount} type="number" placeholder="1-100" className="withdrawal-input" />
            <span className="percent-symbol">%</span>
            <div className="increment-div">
              <button disabled={!account} onClick={incrementWithdrwalUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementWithdrawalDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            account?
              <button className={`stake-btn ${stakedbalance?.toString() === '0' ? 'btn-disabled':''}`} disabled={!account || stakedbalance?.toString() === '0'} onClick={handleClickWithdraw}>Withdraw</button>
              : <ConnectWalletButton className="stake-btn" style={{'transform': 'scale(.95)'}}/>
            }
        </form>

        <form className="stake-form">
          <h3 className="stake-title">Claim Earned DST</h3>
          <div className="input-div">
            <input disabled={!account} onChange={ClaimInput} value={claiminputamount} type="number" placeholder="0" className="withdrawal-input" />
            <div className="increment-div">
              <button disabled={!account} onClick={incrementClaimUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementClaimDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            account?
              <button className={`stake-btn ${earnedBalance?.toString() === '0' ? 'btn-disabled':''}`} disabled={!account || earnedBalance?.toString() === '0'} onClick={handleClickClaim}>Claim</button>
              : <ConnectWalletButton className="stake-btn" style={{'transform': 'scale(.95)'}}/>
            }
        </form>
      </div>
    </div>
  );
}
