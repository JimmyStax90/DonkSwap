import { useActiveWeb3React } from './index'
import { useStakingContract, useERC20Contract } from './useContract'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';

// const contractAddress = "0x8cfE605A4Cebef5c9C69B167d9A99B21BBD53C72";
const contractAddress = "0xA1eeA9d5A596D88C87b14Ce28acB5eFEc9efC046";
const dstContractAddress = "0x3969Fe107bAe2537cb58047159a83C33dfbD73f9";
const dstLpContractAddress = "0x7123431162c1efF257578D1574014e5305Eb7bd4";

const useStaking = () => {
    const { account } = useActiveWeb3React()

    const stakingContract = useStakingContract(contractAddress)

    const erc20DstContract = useERC20Contract(dstContractAddress)

    const stakedbalance = useSingleCallResult(stakingContract, 'getStakedBalanceOfUser', [account]);
    const earnedBalance = useSingleCallResult(stakingContract, 'earned', [account]);
    // const apy = useSingleCallResult(stakingContract, 'totalSupply', []);
    const totalStakedBalance = useSingleCallResult(stakingContract, 'totalSupply', []);
    const totalRewards = useSingleCallResult(stakingContract, 'totalRewards', []);
    const rewardRate = useSingleCallResult(stakingContract,'rewardRate',[]);
    const lpDstBalance : BigNumber = useSingleCallResult(erc20DstContract, 'balanceOf',[dstLpContractAddress])?.result?.[0];

    // console.log("useStaking apy => ", apy);

    // const stakedbalance = 0;
    // const earnedBalance = 0;
    // const apy = 0;
    // const totalStakedBlalnce = 0;
    // const totalRewards = 0;
    const stake = async (amount: any) => {
        const ret = await stakingContract.stake(amount)
    }
    const restake = async() => {
        const ret = await stakingContract.restake()
    }

    const withdraw = async (percent: any) => {
        const ret = await stakingContract.withdraw(percent)
    }
    
    const claimReward = async (amount: any) => {
        const ret = await stakingContract.claimReward(amount)
    }

    return useMemo(
        () => { 
            const value = { 
                stakedbalance: stakedbalance?.result?.[0], 
                earnedBalance: earnedBalance?.result?.[0], 
                // apy: apy?.result?.[0], 
                totalStakedBalance: totalStakedBalance?.result?.[0],
                totalRewards: totalRewards?.result?.[0], 
                rewardRate: rewardRate?.result?.[0],
                lpDstBalance,
                stake,
                restake, 
                withdraw, 
                claimReward
            } 
            // console.log({
            //     stakedbalance: value.stakedbalance?.toString(),
            //     earnedBalance: value.earnedBalance?.toString(),
            //     // apy: value.apy?.toString(),
            //     totalStakedBlalnce: value.totalStakedBalance?.toString(),
            //     totalRewards: value.totalRewards?.toString(),
            //     rewardRate: value.rewardRate?.toString(),
            // })
            return value;
        }, 
        [stakedbalance, earnedBalance, totalStakedBalance, totalRewards, rewardRate, stake,restake, withdraw, claimReward]
        );
};

export default useStaking;