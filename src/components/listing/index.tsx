import { useEffect, useRef, useState } from "react";
import type { compositeShare, typeShareObj, typeUserShareObj } from "../../types/share";
import Table from "./table";
import UserTable from "./usertable";
import { getShares, updateShareValue } from "../../services/shareservice";

function Listing() {

    const userAccountInitialAmount = 10000;

    const [userAmount, setUserAmount] = useState(userAccountInitialAmount);
    const [allCallLedger, setallCallLedger] = useState<Array<{ action: string }>>([]);
    const [userPortfolio, setUserPortfolio] = useState<Array<typeUserShareObj>>([]);
    const [tradedValue, setTradedValue] = useState(0);

    const localUpdateValue = useRef<HTMLInputElement>(null);
    const localUpdateShare = useRef<HTMLSelectElement>(null);


    const [originalShareData, setOriginalShareData] = useState<Array<typeShareObj>>([
        { id: 'SH1', share: 'Share A', value: 200, qty: 1 },
        { id: 'SH2', share: 'Share B', value: 200, qty: 1 },
        { id: 'SH3', share: 'Share C', value: 400, qty: 1 },
        { id: 'SH4', share: 'Share D', value: 300, qty: 1 },
        { id: 'SH5', share: 'Share E', value: 300, qty: 1 },
        { id: 'SH6', share: 'Share F', value: 300, qty: 1 },
        { id: 'SH7', share: 'Share G', value: 300, qty: 1 },
        { id: 'SH8', share: 'Share H', value: 300, qty: 1 },
        { id: 'SH9', share: 'Share I', value: 300, qty: 1 },
        { id: 'SH10', share: 'Share J', value: 300, qty: 1 },
    ]);

    const [shareData, setShareData] = useState<typeShareObj[]>([]);

    useEffect(() => {
        refreshShares();
    }, []);

    useEffect(() => {
        refreshUserPortfolio();
    }, [shareData, originalShareData]);

    useEffect(() => {
        console.log('user portfolio : ', userPortfolio);
    }, [userPortfolio]);

    function refreshShares() {
        setShareData(originalShareData);
        // setInterval(() => {
        //     console.log('share data updated');
        //     // getShares().then((data) => {
        //     //     setShareData(data);
        //     // });
        // }, 5000);
    }

    function refreshUserPortfolio() {
        let updatedPortfolio: typeUserShareObj[] = userPortfolio.map((userShare: typeUserShareObj) => {
            let updatedShareInfo = shareData.find((share: typeShareObj) => share.id == userShare.id);
            if (updatedShareInfo != undefined) {
                return {
                    ...userShare,
                    // currentMarketValue: updatedShareInfo ? updatedShareInfo.value : 0,
                    // averageValue: (userShare.currentMarketValue * userShare.qty) / userShare.qty,
                    unrealisedGain: updatedShareInfo.value * userShare.qty - userShare.qty * userShare.averageValue
                }
            } else {
                return userShare;
            }
        });

        setUserPortfolio([...updatedPortfolio]);
    }

    function buySell(action: string, shareId: string) {

        if (userAmount <= 0 && action == 'buy') {
            alert("Insufficient funds to buy more shares.");
            return;
        }

        let message: string = "";
        let tradedShare: compositeShare = { ...shareData.find((share) => share.id == shareId) as compositeShare };

        if (action == 'sell') {
            message = `Sell : ${shareId} for ${tradedShare?.value}`;
        } else {
            message = `Buy : ${shareId} for ${tradedShare?.value}`;
        }

        updateUserPortfolio(action, tradedShare);
        setallCallLedger((prevCalls) => [{ action: message }, ...prevCalls]);
        return;
    }

    function localUpdatePrice() {
        let newValue: string = localUpdateValue.current?.value ?? "0";
        let numNewValue: number = parseInt(newValue);
        let shareToUpdate: string = localUpdateShare.current?.value ?? "";

        if (shareToUpdate != "" && numNewValue > 0) {
            setShareData(originalShareData.map((share: typeShareObj) => {
                if (share.id == shareToUpdate) {
                    return { ...share, value: numNewValue }
                }
                return share;
            }));
        }
    }

    function updateUserPortfolio(action: string, tradedShare: typeShareObj) {

        let shareExistsInPortfolio: typeUserShareObj = (userPortfolio.find((share: typeUserShareObj) => (share.id != null && share.id == tradedShare.id))) ?? {} as typeUserShareObj;
        let updatedUserPortfolio: typeUserShareObj[] = [];
        let tradedValue = 0;
        if (Object.values(shareExistsInPortfolio).length > 0) {
            let totalShares = shareExistsInPortfolio.qty + 1;
            if (action == 'sell') {
                if (shareExistsInPortfolio.qty > 1) {
                    shareExistsInPortfolio.qty -= 1;
                    // shareExistsInPortfolio.averageValue = (shareExistsInPortfolio.averageValue * shareExistsInPortfolio.qty);
                    updatedUserPortfolio = userPortfolio.map((share: typeUserShareObj) => share.id == shareExistsInPortfolio.id ? shareExistsInPortfolio : share)
                    tradedValue = tradedShare.value;
                } else {
                    const portFolioWithoutThisShare = userPortfolio.filter((share) => share.id != tradedShare.id);
                    updatedUserPortfolio = [...portFolioWithoutThisShare];
                    tradedValue = tradedShare.value;
                }
            } else {
                shareExistsInPortfolio.averageValue = ((shareExistsInPortfolio.averageValue * shareExistsInPortfolio.qty) + tradedShare.value) / totalShares;
                shareExistsInPortfolio.currentMarketValue = tradedShare.value;
                shareExistsInPortfolio.qty = totalShares;
                updatedUserPortfolio = userPortfolio.map((share: typeUserShareObj) => share.id == shareExistsInPortfolio.id ? shareExistsInPortfolio : share)
                tradedValue = Math.abs(tradedShare.value) * -1;
            }

        } else {
            if (action == 'buy') {
                updatedUserPortfolio = [
                    ...userPortfolio,
                    {
                        id: tradedShare.id,
                        share: tradedShare.share,
                        currentMarketValue: tradedShare.value,
                        averageValue: tradedShare.value,
                        unrealisedGain: 0,
                        qty: 1
                    } as typeUserShareObj
                ];
                tradedValue = Math.abs(tradedShare.value) * -1;
            }
        }

        setTradedValue((prevtradedvalue) => prevtradedvalue + tradedValue);
        setUserPortfolio([...updatedUserPortfolio]);
        // setUserAmount(userAccountInitialAmount + (diff < 0 ? diff * -1 : diff));

        return;

    }

    return <>
        <div className="flex">
            <div className="w-1/2  p-4">
                Market :
                <Table tableData={shareData} buySell={buySell}></Table>
            </div>
            <div className="w-1/2  p-4">
                Your Portfolio :
                <div className="overflow-y-scroll" style={{ height: '500px' }}>
                    <UserTable tableData={userPortfolio} buySell={buySell}></UserTable>
                </div>
            </div>
        </div>
        <div className="flex">
            <div className="w-1/2  p-4">
                <div className="overflow-x-scroll" style={{ height: '150px' }}>
                    <div className="text-left font-bold">
                        Trade Session Ledger :<hr />
                        {allCallLedger.length > 0 ? allCallLedger.map((dt, index) => <>
                            <div id={index.toString()} className="">
                                trade {allCallLedger.length - index} : {dt.action}
                            </div>
                        </>) : " No actions yet"}
                    </div>
                </div >
            </div>
            <div className="w-1/2  p-4">
                <div className="m-4 text-2xl text-right" style={{ color: tradedValue > 0 ? 'green' : 'red' }}>Total Trade value : {tradedValue}</div>
                <div className="m-4 text-2xl text-right" style={{ color: userAmount > 0 ? 'green' : 'red' }}>Porfolio : {userAmount}</div>
            </div>
        </div>
        <div>
            <div>
                <h3 className="text-4xl m-3 p-3">Update price demo</h3>
                <select className="p-3 text-3xl border-2 m-3" ref={localUpdateShare}>
                    {originalShareData ? originalShareData.map((v) => {
                        return <option value={v.id}>{v.share}</option>
                    }) : <option value="">No option</option>}
                </select>
                <input ref={localUpdateValue} type="text" className="border text-4xl p-3"></input>
                <input type="button" value="Update Price" className="border text-4xl p-3 m-3" onClick={() => localUpdatePrice()}></input>
            </div>
        </div >
    </>
}

function shareValueRandomizer(share: compositeShare[]) {
    return share.map((sh) => {
        const randomValue = Math.floor(Math.random() * 500) - 50; // Random value between 50 and 550
        // const randomValue = 250;
        return {
            ...sh,
            price: `$${randomValue}`,
            value: randomValue
        }
    });
}

export default Listing;