type typeShareObj = {
    id: string,
    share: string,
    value: number,
    qty: number
};

type typeUserShareObj = {
    id: string,
    share: string,
    currentMarketValue: number,
    averageValue: number,
    unrealisedGain: number,
    qty: number
};

type compositeShare = typeShareObj & typeUserShareObj;


export type { typeShareObj, typeUserShareObj, compositeShare };