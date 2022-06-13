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
  const maxDropdownContentDeposit = useRef<HTMLDivElement>();
  const maxDropdownContentClaim = useRef<HTMLDivElement>();
  const overlay = useRef<HTMLDivElement>();
  const isUserApproved = allowance !== '0';
  const hasStakedBal = stakedbalance?.toString() !== '0';
  const hasEarnedBal = earnedBalance?.toString() !== '0';

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
    if (claiminputamount - 1 < 0) {
      setClaimInputAmount(0);
    } else {
      setClaimInputAmount(parseInt((claiminputamount - 1).toFixed(0)));
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
    if (depositinputamount - 1 < 0) {
      setDepositInputAmount(0.00);
    } else {
      setDepositInputAmount(parseInt((depositinputamount - 1).toFixed(2)));
    }
  }

  /*======================= WITHDRAWAL===================================*/
  /*======================= WITHDRAWAL===================================*/
  /*======================= WITHDRAWAL===================================*/

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

  const handleClickMaxDepositDropdown = () => {
    if(maxDropdownContentDeposit.current && overlay.current && getComputedStyle(maxDropdownContentDeposit.current).display == 'none') {
      maxDropdownContentDeposit.current.style.display = 'flex';
      overlay.current.style.display = 'block';
    } else {
      maxDropdownContentDeposit.current.style.display = 'none';
      overlay.current.style.display = 'none';
    }
  }

  const handleClickMaxDeposit = (percent) => {
    const userBal = Number(ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3));
    setDepositInputAmount(Number((userBal*(percent/100)).toFixed(2)));

    if(maxDropdownContentDeposit.current && overlay.current) {
      maxDropdownContentDeposit.current.style.display = 'none';
      overlay.current.style.display = 'none';
    }
  }

  const handleClickMaxClaimDropdown = () => {
    if(maxDropdownContentClaim.current && overlay.current && getComputedStyle(maxDropdownContentClaim.current).display == 'none') {
      maxDropdownContentClaim.current.style.display = 'flex';
      overlay.current.style.display = 'block';
    } else {
      maxDropdownContentClaim.current.style.display = 'none';
      overlay.current.style.display = 'none';
    }
  }

  const handleClickMaxClaim = (percent) => {
    const userBal = Number(ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3));
    setClaimInputAmount(Number((userBal*(percent/100)).toFixed(2)));

    if(maxDropdownContentClaim.current && overlay.current) {
      maxDropdownContentClaim.current.style.display = 'none';
      overlay.current.style.display = 'none';
    }
  }

  const handleClickOverlay = () => {
    if (maxDropdownContentDeposit.current && maxDropdownContentClaim.current && overlay.current) {
      maxDropdownContentDeposit.current.style.display = 'none';
      maxDropdownContentClaim.current.style.display = 'none';
      overlay.current.style.display = 'none';
    }
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
        <div className="stake-form">
          <h3 className="stake-title">Stake DONK-LP</h3>
          <div className="input-div">
            <div className='deposit-input-container'>
              <h6 className='user-bal'>
                Balance:  {
                            account?
                              isUserApproved?
                                balance?
                                  ethers.utils.formatEther(balance).slice(0, ethers.utils.formatEther(balance).indexOf(".")+3)
                                :'0.0'
                              :'Approve below to view'
                            : 'Unlock wallet to view'
                          }
              </h6>
              <div className='max-dropdown'>
                <span className={`max-btn ${!account ? 'max-btn-disabled':''}`} onClick={() => account ? handleClickMaxDepositDropdown():null}>Max</span>
                <div ref={maxDropdownContentDeposit} className="max-dropdown-content">
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(100):null}>Max</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(75):null}>75%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(50):null}>50%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxDeposit(25):null}>25%</span>
                </div>
                <div className="overlay" ref={overlay} onClick={handleClickOverlay}></div>
              </div>
              <input disabled={!account} onChange={depositInput} value={depositinputamount} type="number" step='any' placeholder='0.0' className="deposit-input" />
            </div>
            <div className="increment-div">
              <button disabled={!account} onClick={incrementDepositUp} className="increment-plus">+</button>
              <button disabled={!account} onClick={decrementDepositDown} className="increment-minus">-</button>
            </div>
          </div>
          {
            account?
              isUserApproved?
              <div>
                <button className='stake-btn' onClick={handleClickStake}>Stake</button>
                <button className='stake-btn' onClick={handleClickReStake}>ReStake</button>
              </div>
                : <button className="stake-btn" onClick={handleClickApprove}>Approve</button>
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
          <Flex flexDirection={'column'} alignItems={'center'} width={.5}>
            <Text fontSize="20px">{withdrawalinputamount}%</Text>
            <Slider min={1} size={20} value={withdrawalinputamount} onChange={setWithdrawalInputAmount} />
            <Flex justifyContent="space-around" width={1} className='scale-btn-container'>
              <Button
                variant="tertiary"
                scale="sm"
                className="scale-btn"
                onClick={() => setWithdrawalInputAmount(25)}
              >
                25%
              </Button>
              <Button
                variant="tertiary"
                scale="sm"
                className="scale-btn"
                onClick={() => setWithdrawalInputAmount(50)}
              >
                50%
              </Button>
              <Button
                variant="tertiary"
                scale="sm"
                className="scale-btn"
                onClick={() => setWithdrawalInputAmount(75)}
              >
                75%
              </Button>
              <Button
                variant="tertiary"
                scale="sm"
                className="scale-btn"
                onClick={() => setWithdrawalInputAmount(100)}
              >
                {TranslateString(166, 'Max')}
              </Button>
            </Flex>
          </Flex>
          {
            account?
              <button className={`stake-btn ${!hasStakedBal ? 'btn-disabled':''}`} disabled={!account || !hasStakedBal} onClick={handleClickWithdraw}>Withdraw</button>
              : <ConnectWalletButton style={{
                  width: '170px',
                  height: '35px',
                  borderRadius: '10px',
                  color: 'white',
                  backgroundColor: '#9d70c3',
                  boxShadow: '3px 3px 1px #414345',
                  transform: 'scale(.95)'
                }}/>
          }
        </div>

        <div className="stake-form">
          <h3 className="stake-title">Claim Earned DST</h3>
          <div className="input-div">
            <div className='deposit-input-container'>
              <div className='max-dropdown'>
                <span className={`max-btn ${!earnedBalance ? 'max-btn-disabled':''}`} onClick={() => account ? handleClickMaxClaimDropdown():null}>Max</span>
                <div ref={maxDropdownContentClaim} className="max-dropdown-content">
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(100):null}>Max</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(75):null}>75%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(50):null}>50%</span>
                  <span className="max-btn" onClick={() => account ? handleClickMaxClaim(25):null}>25%</span>
                </div>
                <div className="overlay" ref={overlay} onClick={handleClickOverlay}></div>
              </div>
              <input disabled={!account} onChange={ClaimInput} value={claiminputamount} type="number" placeholder="0" className="withdrawal-input" />
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
