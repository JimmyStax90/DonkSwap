import "./stake.css";
import React, { useState, useRef } from 'react'
import useStaking from "../../hooks/useStaking";
import { ethers } from 'ethers';
import { BigNumber } from 'bignumber.js';
import useERC20 from "hooks/useERC20";
import { useActiveWeb3React } from '../../hooks/index';
import ConnectWalletButton from 'components/ConnectWalletButton';
import Slider from "../../components/Slider";
import { Button, Flex, Text } from '../../uikit';
import useI18n from 'hooks/useI18n';

export default function Mine() {
  const { account } = useActiveWeb3React();
  const [depositinputamount, setDepositInputAmount] = useState<string>('');
  const [withdrawalinputamount, setWithdrawalInputAmount] = useState<string>('');
  const [claiminputamount, setClaimInputAmount] = useState<string>('');
  const [errormessagewithdraw, setErrorMessagewithdraw] = useState('')
  const [errormessagedeposit, setErrorMessagedeposit] = useState('')
  const [errormessageclaim, setErrorMessageclaim] = useState('')
  const { stakedbalance, earnedBalance, totalStakedBalance, totalRewards, rewardRate, stake,restake, withdraw, claimReward } = useStaking();
  const { allowance, approve, balance } = useERC20();
  const total = Number(ethers.utils.formatEther(totalStakedBalance?totalStakedBalance:0));
  const rate = Number(ethers.utils.formatUnits(rewardRate?rewardRate:0,9));
  const apr = total?(rate).toFixed(3):total;
  // set APR to percentage of total staked
  // const stakedBalanceLimit = Number(ethers.utils.formatEther(stakedbalance?stakedbalance:0));
  // const apr = total?((stakedBalanceLimit/total)*100).toFixed(3):total;
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

  // console.log("rewardRatetemp---->", rate);
  // console.log("total------>", total);
  // console.log("result---->", apr);
  /*======================= ClaimReward ===================================*/
  /*======================= ClaimReward ===================================*/
  /*======================= ClaimReward ===================================*/

  const ClaimInput = (e) => {
    setErrorMessageclaim('');
    const amt = new BigNumber(e.target.value);
    if (amt.lt(0))
    {
      setClaimInputAmount('0');
    } else {
      setClaimInputAmount(amt.toFixed(0));
    }
  }
  const incrementClaimUp = () => {
    setErrorMessageclaim('');
    const amt = new BigNumber(claiminputamount).plus(1);
    setClaimInputAmount(amt.toFixed(0));
    if(claimInputRef.current) {
      claimInputRef.current.focus();
    }
  }
  const decrementClaimDown = () => {
    setErrorMessageclaim('');
    const amt = new BigNumber(claiminputamount).minus(1);
    if (amt.lt(0) || amt.isNaN()) {
      setClaimInputAmount('0');
    } else {
      setClaimInputAmount(amt.toFixed(0));
    }
    if(claimInputRef.current) {
      claimInputRef.current.focus();
    }
  }
  const handleClickClaim = () => {
    const userRewardBal = new BigNumber(ethers.utils.formatUnits(earnedBalance,9).slice(0, ethers.utils.formatUnits(earnedBalance,9).indexOf(".")+3))
    const claimAmt = new BigNumber(claiminputamount)
    if(claimAmt.gt(userRewardBal)) {
      setErrorMessageclaim('Amount cannot exceed your reward balance.')
    } else if (claimAmt.lte(0) || claimAmt.isNaN()) {
      setErrorMessageclaim('Amount cannot be zero.')
    } else {
      claimReward(claiminputamount.toString())
    }
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
      const userRewardBal = new BigNumber(ethers.utils.formatUnits(earnedBalance,9).slice(0, ethers.utils.formatUnits(earnedBalance,9).indexOf(".")+3))
      setClaimInputAmount((userRewardBal.times(percent/100)).toFixed(0));
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

  const handleClickStake = () => {
    const userBal = new BigNumber(ethers.utils.formatEther(balance?balance:0).slice(0, ethers.utils.formatEther(balance?balance:0).indexOf(".")+3));
    const depositAmt = new BigNumber(depositinputamount)
    if (depositAmt.gt(userBal)){
      setErrorMessagedeposit('Amount cannot exceed your balance.')
    } else if (depositAmt.lte(0) || depositAmt.isNaN()) {
      setErrorMessagedeposit('Amount cannot be zero.')
    } else {
      stake(ethers.utils.parseEther(depositinputamount))
    }
  }

  const depositInput = (e) => {
    setErrorMessagedeposit('');
    const amt = new BigNumber(e.target.value);
    if (amt.lt(0)) {
      setDepositInputAmount('0.000');
    } else {
      setDepositInputAmount(amt.toString());
    }
  }
  const incrementDepositUp = () => {
    setErrorMessagedeposit('');
    const amt = new BigNumber(depositinputamount).plus(1)
    setDepositInputAmount(amt.toString());
    if(depositInputRef.current) {
      depositInputRef.current.focus();
    }
  }
  const decrementDepositDown = () => {
    setErrorMessagedeposit('');
    const amt = new BigNumber(depositinputamount).minus(1)
    if (amt.lt(0) || amt.isNaN()) {
      setDepositInputAmount('0.000');
    } else {
      setDepositInputAmount(amt.toString());
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
      const userBal = new BigNumber(ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3));
      setDepositInputAmount((userBal.times(percent/100)).toFixed(3));
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
    setErrorMessagewithdraw('');
    const amt = new BigNumber(e.target.value);
    if (amt.lt(0)) {
      setWithdrawalInputAmount('0.000');
    } else {
      setWithdrawalInputAmount(amt.toString());
    }
  }
  const incrementWithdrwalUp = () => {
    setErrorMessagewithdraw('');
    const amt = new BigNumber(withdrawalinputamount).plus(1);
    setWithdrawalInputAmount(amt.toString());
    if(withdrawInputRef.current) {
      withdrawInputRef.current.focus();
    }
  }
  const decrementWithdrawalDown = () => {
    setErrorMessagewithdraw('');
    const amt = new BigNumber(withdrawalinputamount).minus(1)
    if (amt.lt(0) || amt.isNaN()) {
      setWithdrawalInputAmount('0.000');
    } else {
      const amt = new BigNumber(withdrawalinputamount).minus(1)
      setWithdrawalInputAmount(amt.toString());
    }
    if(withdrawInputRef.current) {
      withdrawInputRef.current.focus();
    }
  }
  const handleClickWithdraw = () => {
    const userStakedBal = new BigNumber(ethers.utils.formatEther(stakedbalance).slice(0, ethers.utils.formatEther(stakedbalance).indexOf(".")+3));
    const withdrawAmt = new BigNumber(withdrawalinputamount);
    if (withdrawAmt.gt(userStakedBal)) {
      setErrorMessagewithdraw('Amount cannot exceed your staked balance.')
    } else if (withdrawAmt.lte(0) || withdrawAmt.isNaN()) {
      setErrorMessagewithdraw('Amount cannot be zero.')
    } else {
      const withdrawPercent = (new BigNumber(withdrawalinputamount).div(userStakedBal)).times(100);
      withdraw(withdrawPercent.toString())
    }
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
    if (!hasUserApproved && approveBtnRef.current) {
      approveBtnRef.current.classList.toggle('shake');
    } else {
      const userStakedBal = Number(ethers.utils.formatEther(stakedbalance).slice(0, ethers.utils.formatEther(stakedbalance).indexOf(".")+3));
      const amt = new BigNumber(userStakedBal*(percent/100))
      setWithdrawalInputAmount(amt.toFixed(3));
    }

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

  const handleClickApprove = async () => {
    try {
      await approve()
    } catch (e) {
      console.log(e)
    }
  }

  const handleClickReStake = async () => {
    try {
      await restake()
    } catch (e) {
      console.log(e)
    }
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
              <input ref={depositInputRef} disabled={!account} onChange={depositInput} value={depositinputamount} type="number" placeholder='0.000' className="deposit-input" />
            </div>
            <div className="increment-div">
              <button disabled={!account} onClick={incrementDepositUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementDepositDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            errormessagedeposit?
            <p className='errorMsg'>{errormessagedeposit}</p>
            : null
          }
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
                <span className={`max-btn ${!account ? 'max-btn-disabled':''}`} onClick={() => account ? handleClickMaxWithdrawDropdown():null}>Max</span>
                <div ref={maxDropdownContentWithdrawRef} className="max-dropdown-content">
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(100):null}>Max</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(75):null}>75%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(50):null}>50%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxWithdraw(25):null}>25%</span>
                </div>
              </div>
              <input ref={withdrawInputRef} disabled={!account} onChange={withdrawalInput} value={withdrawalinputamount} type="number" placeholder="0.000" className="withdrawal-input" />
            </div>
              {/* <span className="percent-symbol">%</span> */}
            <div className="increment-div">
              <button disabled={!account} onClick={incrementWithdrwalUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementWithdrawalDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            errormessagewithdraw?
            <p className='errorMsg'>{errormessagewithdraw}</p>
            : null
          }
          {
            account?
              <button className={'stake-btn'} disabled={!account} onClick={handleClickWithdraw}>Withdraw</button>
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
                <span className={`max-btn ${!account ? 'max-btn-disabled':''}`} onClick={() => account ? handleClickMaxClaimDropdown():null}>Max</span>
                <div ref={maxDropdownContentClaimRef} className="max-dropdown-content">
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(100):null}>Max</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(75):null}>75%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(50):null}>50%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(25):null}>25%</span>
                </div>
              </div>
              <input ref={claimInputRef} disabled={!account} onChange={ClaimInput} value={claiminputamount} type="number" placeholder="0" className="withdrawal-input" />
            </div>
            <div className="increment-div">
              <button disabled={!account} onClick={incrementClaimUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementClaimDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            errormessageclaim?
            <p className='errorMsg'>{errormessageclaim}</p>
            : null
          }
          {
            account?
              <button className={'stake-btn'} disabled={!account} onClick={handleClickClaim}>Claim</button>
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
