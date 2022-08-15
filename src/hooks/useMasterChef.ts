import { useActiveWeb3React } from './index'
import { useMasterchefContract, useERC20Contract } from './useContract'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';

// const contractAddress = "0x8cfE605A4Cebef5c9C69B167d9A99B21BBD53C72";
const masterchefAddress = "0x029FFE06eE1CfddE477BD88c3D42289CbdDe1dB9";
const dstContractAddress = "0x3969Fe107bAe2537cb58047159a83C33dfbD73f9";
const dstLpContractAddress = "0x7123431162c1efF257578D1574014e5305Eb7bd4";

const useMasterChef = (pid, lp) => {
    const { account } = useActiveWeb3React()

    const stakingContract = useMasterchefContract(masterchefAddress);

    const erc20DstContract = useERC20Contract(dstContractAddress);
    const erc20DstLpContract = useERC20Contract(lp);

    const userInfo = useSingleCallResult(stakingContract, 'userInfo', [pid,account]);
    const poolInfo = useSingleCallResult(stakingContract, 'poolInfo', [pid]);
    const pendingDst : BigNumber = useSingleCallResult(stakingContract, 'pendingDst', [pid,account])?.result?.[0];
    const dstPerBlock : BigNumber = useSingleCallResult(stakingContract, 'dstPerBlock', [])?.result?.[0];
    const totalAllocPoint : BigNumber = useSingleCallResult(stakingContract, 'totalAllocPoint', [])?.result?.[0];
    // const apy = useSingleCallResult(stakingContract, 'totalSupply', []);
    const totalLpStaked : BigNumber = useSingleCallResult(erc20DstLpContract, 'balanceOf',[masterchefAddress])?.result?.[0];
    const lpDstBalance : BigNumber = useSingleCallResult(erc20DstContract, 'balanceOf',[dstLpContractAddress])?.result?.[0];

    const stake = async (amount: any) => {
        const ret = await stakingContract.deposit(pid,amount)
    }

    const withdraw = async (amount: any) => {
        const ret = await stakingContract.withdraw(pid,amount)
    }
    
    const claimReward = async () => {
        const ret = await stakingContract.withdraw(pid,0)
    }

    return useMemo(
        () => { 
            const value = { 
                stakedbalance: userInfo?.result?.[0], 
                rewardRate: dstPerBlock?.mul(3)?.mul(poolInfo?.result?.[1])?.div(totalAllocPoint),
                pendingDst,
                totalLpStaked,
                lpDstBalance,
                stake,
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
        [userInfo?.result?.[1], poolInfo?.result?.[1], dstPerBlock, totalAllocPoint, pendingDst, totalLpStaked]
        );
};

export default useMasterChef;
