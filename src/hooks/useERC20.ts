import { useActiveWeb3React } from './index'
import { useERC20Contract } from './useContract'
import { NEVER_RELOAD, useSingleCallResult } from '../state/multicall/hooks'
import { BigNumber, ethers } from 'ethers';

// const contractAddress = "0x3969Fe107bAe2537cb58047159a83C33dfbD73f9";
const contractAddress = "0x7123431162c1efF257578D1574014e5305Eb7bd4";

// const stakingAddress = "0x8cfE605A4Cebef5c9C69B167d9A99B21BBD53C72";
const masterchefAddress = "0x029FFE06eE1CfddE477BD88c3D42289CbdDe1dB9";


const useERC20 = () => {
    const { account } = useActiveWeb3React()

    const erc20Contract = useERC20Contract(contractAddress)
    // console.log("erc20----->", erc20Contract);

    const allowance: BigNumber = useSingleCallResult(erc20Contract, 'allowance', [account, masterchefAddress])?.result?.[0];
    const approve = async () => {
        const ret = await erc20Contract.approve(masterchefAddress, ethers.constants.MaxUint256)
    }
    // console.log("ERC20 CONTRACT allowance => ", allowance?.toString())
    const balance : BigNumber = useSingleCallResult(erc20Contract, 'balanceOf',[account])?.result?.[0];
    // console.log("balance => ", balance);
    const totalSupply = useSingleCallResult(erc20Contract, 'totalSupply', [])?.result?.[0];
    return { allowance:allowance ? allowance.toString() : '0', approve, balance, totalSupply};
};

export default useERC20;
