import type { compositeShare } from "../types/share";

async function getShares() {
    let data = await fetch('http://localhost:3000/shares').then(response => response.json()).then(data => {
        console.log('fetched share data : ', data);
        return data.data as compositeShare[];
    });
    return data;
}

async function updateShareValue(shareId: string, newValue: number) {
    let data = await fetch(`http://localhost:3000/update-share-price/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareId: shareId, newValue: newValue }),
    }).then(response => response.json()).then(data => {
        console.log('updated share data : ', data);
        return data.data as compositeShare;
    });
    return data;
}

async function tradeShares(data: any) {
    const [shareId, action, quantity, userId, shareValue] = data;
    let response = await fetch(`http://localhost:3000/trade-shares/`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ shareId: shareId, action: action, quantity: quantity, userId: userId, shareValue: shareValue }),
    }).then(response => response.json()).then(data => {
        console.log('trade shares response data : ', data);
        return data;
    });
    return response;
}

export { getShares, updateShareValue, tradeShares };