import {utils, BigNumber} from "ethers";
const { formatEther, parseEther } = utils;

export function weiToFixed(bn,decimals) {
    if(!bn) return (0).toFixed(decimals);
    return Number(formatEther(bn)).toFixed(decimals);
}

export function weiToShortString(bn,decimals) {
    if(!bn) return (0).toFixed(decimals);
    if(bn.lt(parseEther("1000"))) return weiToShortStringSmall(bn,18,decimals);
    return toShortString(bn,decimals,18);
}

export function tokenAmtToShortString(bn,tokenDecimals,decimals) {
    if(!bn) return (0).toFixed(decimals);
    if(bn.lt(BigNumber.from("10").pow(tokenDecimals+3))) return weiToShortStringSmall(bn,tokenDecimals,decimals)
    return toShortString(bn,decimals,tokenDecimals);
}

export function weiToShortStringSmall(bn,tokenDecimals,decimals) {
    if(!bn) return (0).toFixed(decimals);
    let power = BigNumber.from("10").pow((tokenDecimals));
    if(bn.lt(power)) {
        let num = Number(bn) / Number(power);
        if(num < 10e-7) return (0).toFixed(decimals);;
        return num.toPrecision(decimals);
    }
    let powerPrecision = Math.floor(tokenDecimals/2);
    return (Number(bn.div(BigNumber.from("10").pow((tokenDecimals - powerPrecision)))).toFixed(decimals) / Math.pow(10,powerPrecision)).toFixed(decimals);
}

export function weiToUsdWeiVal(bn,usdPerTokens) {
    if(!bn) return BigNumber.from("0");
    if(!usdPerTokens) return BigNumber.from("0");
    return bn.mul((Number(usdPerTokens)*1e+18).toFixed()).div(BigNumber.from("10").pow("18"))
}

export function toShortString(bn,decimals,tokenDecimals) {
    if(!tokenDecimals) tokenDecimals = 0;
    if(!bn) return (0).toFixed(decimals);
    let power = BigNumber.from("10").pow(12+tokenDecimals);
    if(bn.gte(power)) {
        return powerConverter(bn,12,decimals,tokenDecimals,"T");
    }
    power = BigNumber.from("10").pow(9+tokenDecimals);
    if(bn.gte(power)) {
        return powerConverter(bn,9,decimals,tokenDecimals,"B");
    }
    power = BigNumber.from("10").pow(6+tokenDecimals);
    if(bn.gte(power)) {
        return powerConverter(bn,6,decimals,tokenDecimals,"M");
    }
    power = BigNumber.from("10").pow(3+tokenDecimals);
    if(bn.gte(power)) {
        return powerConverter(bn,3,decimals,tokenDecimals,"K");
    }
    power = BigNumber.from("10").pow(3+tokenDecimals);
    return powerConverter(bn,0,decimals,tokenDecimals,"")
}

function powerConverter(bn,factorOf10,decimals,tokenDecimals,letter) {
    return (Number(bn.div(BigNumber.from("10").pow(factorOf10+tokenDecimals-decimals)))/Number(10**(decimals))).toFixed(decimals)+letter;
}