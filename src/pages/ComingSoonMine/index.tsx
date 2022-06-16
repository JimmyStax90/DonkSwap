import "./stake.css";
import React, { useState, useRef } from 'react'
import useStaking from "../../hooks/useStaking";
import { ethers } from "ethers"
import useERC20 from "hooks/useERC20";
import { useActiveWeb3React } from '../../hooks/index';
import ConnectWalletButton from 'components/ConnectWalletButton';
import Slider from "../../components/Slider";
import { Button, Flex, Text } from '../../uikit';
import useI18n from 'hooks/useI18n';

export default function Mine() {
  const { account } = useActiveWeb3React();
  const [depositinputamount, setDepositInputAmount] = useState(0.00);
  const [withdrawalinputamount, setWithdrawalInputAmount] = useState(1);
  const [claiminputamount, setClaimInputAmount] = useState(0);
  const [errormessage, setErrorMessage] = useState('')
  const { stakedbalance, earnedBalance, totalStakedBalance, totalRewards, rewardRate, stake,restake, withdraw, claimReward } = useStaking();
  const { allowance, approve, balance } = useERC20();
  const total = Number(ethers.utils.formatEther(totalStakedBalance?totalStakedBalance:0));
  const rate = Number(ethers.utils.formatUnits(rewardRate?rewardRate:0,9));
  const apr = total?(rate).toFixed(3):total;
  const TranslateString = useI18n();
  const maxDropdownContentDepositRef = useRef<HTMLDivElement>();
  const maxDropdownContentClaimRef = useRef<HTMLDivElement>();
  const maxDropdownContentWithdrawRef = useRef<HTMLDivElement>();
  const overlayRef = useRef<HTMLDivElement>();
  const claimInputRef = useRef<HTMLInputElement>();
  const depositInputRef = useRef<HTMLInputElement>();
  const withdrawInputRef = useRef<HTMLInputElement>();
  const approveBtnRef = useRef<HTMLButtonElement>();
  const hasUserApproved = allowance !== '0';
  const hasStakedBal = stakedbalance?.toString() !== '0';
  const hasEarnedBal = earnedBalance?.toString() !== '0';

  console.log("rewardRatetemp---->", rate);
  console.log("total------>", total);
  console.log("result---->", apr);
  /*======================= ClaimReward ===================================*/
  /*======================= ClaimReward ===================================*/
  /*======================= ClaimReward ===================================*/

  const ClaimInput = (e) => {
    if (e.target.value === '' || e.target.value < 0)
    {
      setClaimInputAmount(0);
    } else {
      setClaimInputAmount(parseInt(e.target.value));
    }
  }
  const incrementClaimUp = () => {
    setClaimInputAmount(claiminputamount + 1);
    if(claimInputRef.current) {
      claimInputRef.current.focus();
    }
  }
  const decrementClaimDown = () => {
    if (claiminputamount - 1 < 0) {
      setClaimInputAmount(0);
    } else {
      setClaimInputAmount(parseInt((claiminputamount - 1).toFixed(0)));
    }
    if(claimInputRef.current) {
      claimInputRef.current.focus();
    }
  }
  const handleClickClaim = () => {
    claimReward(ethers.utils.parseEther(claiminputamount.toString()))
  }

  const handleClickMaxClaimDropdown = () => {
    if(maxDropdownContentClaimRef.current && overlayRef.current && getComputedStyle(maxDropdownContentClaimRef.current).display == 'none') {
      maxDropdownContentClaimRef.current.style.display = 'flex';
      overlayRef.current.style.display = 'block';
    } else {
      maxDropdownContentClaimRef.current.style.display = 'none';
      overlayRef.current.style.display = 'none';
    }
  }

  const handleClickMaxClaim = (percent) => {
    if (!hasUserApproved && approveBtnRef.current) {
      approveBtnRef.current.classList.toggle('shake');
    } else {
      const userBal = Number(ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3));
      setClaimInputAmount(Number((userBal*(percent/100)).toFixed(2)));
    }

    if(maxDropdownContentClaimRef.current && overlayRef.current) {
      maxDropdownContentClaimRef.current.style.display = 'none';
      overlayRef.current.style.display = 'none';
    }
    if(claimInputRef.current) {
      claimInputRef.current.focus();
    }
  }

  /*======================= DEPOSIT ===================================*/
  /*======================= DEPOSIT ===================================*/
  /*======================= DEPOSIT ===================================*/

  const depositInput = (e) => {
    if (e.target.value === '' || e.target.value < 0) {
      setDepositInputAmount(0.00);
    } else {
      setDepositInputAmount(parseFloat(e.target.value));
    }
  }
  const incrementDepositUp = () => {
    setDepositInputAmount(depositinputamount + 1);
    if(depositInputRef.current) {
      depositInputRef.current.focus();
    }
  }
  const decrementDepositDown = () => {
    if (depositinputamount - 1 < 0) {
      setDepositInputAmount(0.00);
    } else {
      setDepositInputAmount(parseInt((depositinputamount - 1).toFixed(2)));
    }
    if(depositInputRef.current) {
      depositInputRef.current.focus();
    }
  }

  const handleClickMaxDepositDropdown = () => {
    if(maxDropdownContentDepositRef.current && overlayRef.current && getComputedStyle(maxDropdownContentDepositRef.current).display == 'none') {
      maxDropdownContentDepositRef.current.style.display = 'flex';
      overlayRef.current.style.display = 'block';
    } else {
      maxDropdownContentDepositRef.current.style.display = 'none';
      overlayRef.current.style.display = 'none';
    }
  }

  const handleClickMaxDeposit = (percent) => {
    if (!hasUserApproved && approveBtnRef.current) {
      approveBtnRef.current.classList.toggle('shake');
    } else {
      const userBal = Number(ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3));
      setDepositInputAmount(Number((userBal*(percent/100)).toFixed(2)));
    }

    if(maxDropdownContentDepositRef.current && overlayRef.current) {
      maxDropdownContentDepositRef.current.style.display = 'none';
      overlayRef.current.style.display = 'none';
    }
    if(depositInputRef.current) {
      depositInputRef.current.focus();
    }
  }

  /*======================= WITHDRAWAL===================================*/
  /*======================= WITHDRAWAL===================================*/
  /*======================= WITHDRAWAL===================================*/

  const withdrawalInput = (e) => {
    const hasPercentSign = e.target.value.includes('%')

    if (hasPercentSign) {
      const numberInput = parseInt(e.target.value.replace('%',''));
  
      if (numberInput > 100) {
        setWithdrawalInputAmount(100);
      } else if (numberInput < 1 || Number.isNaN(numberInput)) {
        setWithdrawalInputAmount(0);
      } else {
        setWithdrawalInputAmount(numberInput);
      }
    } else if (e.target.value.length > 1) {
      const trimmedNumber = parseInt(e.target.value.slice(0,-1));
      setWithdrawalInputAmount(trimmedNumber);
    } else {
      setWithdrawalInputAmount(0);
    }
  }
  const incrementWithdrwalUp = () => {
    setWithdrawalInputAmount(withdrawalinputamount + 1);
    if(withdrawInputRef.current) {
      withdrawInputRef.current.focus();
    }
  }
  const decrementWithdrawalDown = () => {
    if (withdrawalinputamount - 1 < 1) {
      setWithdrawalInputAmount(1);
    } else {
      setWithdrawalInputAmount(parseInt((withdrawalinputamount - 1).toFixed(0)));
    }
    if(withdrawInputRef.current) {
      withdrawInputRef.current.focus();
    }
  }
  const handleClickWithdraw = () => {
    withdraw(withdrawalinputamount.toString())
  }

  const handleClickMaxWithdrawDropdown = () => {
    if(maxDropdownContentWithdrawRef.current && overlayRef.current && getComputedStyle(maxDropdownContentWithdrawRef.current).display == 'none') {
      maxDropdownContentWithdrawRef.current.style.display = 'flex';
      overlayRef.current.style.display = 'block';
    } else {
      maxDropdownContentWithdrawRef.current.style.display = 'none';
      overlayRef.current.style.display = 'none';
    }
  }

  const handleClickMaxWithdraw = (percent) => {
    setWithdrawalInputAmount(percent);

    if(maxDropdownContentWithdrawRef.current && overlayRef.current) {
      maxDropdownContentWithdrawRef.current.style.display = 'none';
      overlayRef.current.style.display = 'none';
    }
    if(withdrawInputRef.current) {
      withdrawInputRef.current.focus();
    }
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

  const handleClickOverlay = () => {
    if (maxDropdownContentDepositRef.current && maxDropdownContentClaimRef.current && maxDropdownContentWithdrawRef.current && overlayRef.current) {
      maxDropdownContentDepositRef.current.style.display = 'none';
      maxDropdownContentClaimRef.current.style.display = 'none';
      maxDropdownContentWithdrawRef.current.style.display = 'none';
      overlayRef.current.style.display = 'none';
    }
  }

  const approveBtnShakeEnd = () => {
    if (approveBtnRef.current) {
      approveBtnRef.current.classList.remove('shake');
    }
  }

  return (
    <div className="stake-body-whole">
      <div className="overlay" ref={overlayRef} onClick={handleClickOverlay}></div>
      <div className="floating-box"></div>
      <div className="stake-stats">
        <div>
          <h3 className="header">Staking Stats</h3>
        </div>
        
        <div className="stake-stat-second-level">
          <div className="left-display">
            <div className="balance-and-display-container">
              <h3 className="stake-title">My Staked Balance</h3>
              <div className="stake-stat-display">
              <p>{stakedbalance ? ethers.utils.formatEther(stakedbalance).slice(0, ethers.utils.formatEther(stakedbalance).indexOf(".")+3) : 0}</p>
              </div>
            </div>

            <div className="balance-and-display-container">
              <h3 className="stake-title">My Earned DST</h3>
              <div className="stake-stat-display">
                <p>{earnedBalance ? ethers.utils.formatUnits(earnedBalance,9).slice(0, ethers.utils.formatUnits(earnedBalance,9).indexOf(".")+3) : 0}</p>
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
              <h3 className="stake-title">Total Balance</h3>
              <div className="stake-stat-display">
                <p>{totalStakedBalance ? ethers.utils.formatEther(totalStakedBalance) : 0}</p>
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
        <div className="stake-form">
          <h3 className="stake-title">Stake DONK-LP</h3>
          <div className="input-div">
            <div className='input-container'>
              <h6 className='user-bal'>
                Balance:  {
                            account?
                              hasUserApproved?
                                balance?
                                  ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3)
                                :'0.0'
                              :'Approve below to view'
                            : 'Unlock wallet to view'
                          }
              </h6>
              <div className='max-dropdown'>
                <span className={`max-btn ${!account ? 'max-btn-disabled':''}`} onClick={() => account ? handleClickMaxDepositDropdown():null}>Max</span>
                <div ref={maxDropdownContentDepositRef} className="max-dropdown-content">
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(100):null}>Max</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(75):null}>75%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(50):null}>50%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(25):null}>25%</span>
                </div>
              </div>
              <input ref={depositInputRef} disabled={!account} onChange={depositInput} value={depositinputamount.toString()} type="number" placeholder='0.0' className="deposit-input" onWheel={depositInput} />
            </div>
            <div className="increment-div">
              <button disabled={!account} onClick={incrementDepositUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementDepositDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            account?
              hasUserApproved?
              <div>
                <button className='stake-btn' onClick={handleClickStake}>Stake</button>
                <button className='stake-btn' onClick={handleClickReStake}>ReStake</button>
              </div>
                : <button className="stake-btn" ref={approveBtnRef} onAnimationEndCapture={approveBtnShakeEnd} onClick={handleClickApprove}>Approve</button>
              : <ConnectWalletButton style={{
                  width: '170px',
                  height: '35px',
                  borderRadius: '10px',
                  color: 'white',
                  backgroundColor: '#9d70c3',
                  boxShadow: '3px 3px 1px #414345'
                }}/>
          }
        </div>

        <div className="stake-form">
          <h3 className="stake-title">Withdraw Staked LP</h3>
          <div className="input-div">
            <div className="input-container">
              <div className='max-dropdown'>
                <span className={`max-btn ${!stakedbalance ? 'max-btn-disabled':''}`} onClick={() => account ? handleClickMaxWithdrawDropdown():null}>Max</span>
                <div ref={maxDropdownContentWithdrawRef} className="max-dropdown-content">
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(100):null}>Max</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(75):null}>75%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(50):null}>50%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(25):null}>25%</span>
                </div>
              </div>
              <input ref={withdrawInputRef} disabled={!account} onChange={withdrawalInput} value={withdrawalinputamount+'%'} type="text" placeholder="1-100%" className="withdrawal-input" />
            </div>
              {/* <span className="percent-symbol">%</span> */}
            <div className="increment-div">
              <button disabled={!account} onClick={incrementWithdrwalUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementWithdrawalDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            account?
              <button className={`stake-btn ${!hasStakedBal || withdrawalinputamount === 0 ? 'btn-disabled':''}`} disabled={!account || !hasStakedBal || withdrawalinputamount === 0} onClick={handleClickWithdraw}>Withdraw</button>
              : <ConnectWalletButton style={{
                  width: '170px',
                  height: '35px',
                  borderRadius: '10px',
                  color: 'white',
                  backgroundColor: '#9d70c3',
                  boxShadow: '3px 3px 1px #414345'
                }}/>
          }
        </div>

        <div className="stake-form">
          <h3 className="stake-title">Claim Earned DST</h3>
          <div className="input-div">
            <div className='input-container'>
              <div className='max-dropdown'>
                <span className={`max-btn ${!earnedBalance ? 'max-btn-disabled':''}`} onClick={() => account ? handleClickMaxClaimDropdown():null}>Max</span>
                <div ref={maxDropdownContentClaimRef} className="max-dropdown-content">
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(100):null}>Max</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(75):null}>75%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(50):null}>50%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(25):null}>25%</span>
                </div>
              </div>
              <input ref={claimInputRef} disabled={!account} onChange={ClaimInput} value={claiminputamount.toString()} type="number" placeholder="0" className="withdrawal-input" onWheel={ClaimInput} />
            </div>
            <div className="increment-div">
              <button disabled={!account} onClick={incrementClaimUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementClaimDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            account?
              <button className={`stake-btn ${!hasEarnedBal ? 'btn-disabled':''}`} disabled={!account || !hasEarnedBal} onClick={handleClickClaim}>Claim</button>
              : <ConnectWalletButton style={{
                width: '170px',
                height: '35px',
                borderRadius: '10px',
                color: 'white',
                backgroundColor: '#9d70c3',
                boxShadow: '3px 3px 1px #414345'
              }}/>
            }
        </div>
      </div>
    </div>
  );
}
