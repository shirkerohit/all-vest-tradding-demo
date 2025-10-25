import { useEffect, useState } from "react";
import type { compositeShare } from "../types/share";
import { getShares, updateShareValue } from "../services/shareservice";
import UpdateTable from "./listing/updateTable";

function UpdateShare() {

    const [shareData, setShareData] = useState<compositeShare[]>([]);

    useEffect(() => {
        refreshShares();
    }, []);

    function refreshShares() {
        getShares().then((data) => {
            setShareData(data);
        });
    }

    function updateShare(shareId: string, newValue: number) {
        updateShareValue(shareId, newValue).then((updatedShare) => {
            console.log('updated share received : ', updatedShare);

            if (updatedShare == undefined) {
                // alert('Failed to update share value. Please try again later.');
                return;
            }

            setShareData((prevShareData) => {
                return prevShareData.map((share) => {
                    if (share.id === updatedShare.id) {
                        return updatedShare;
                    }
                    return share;
                });
            });
            // alert('Share value updated successfully.');
        }).catch((error) => {
            console.error('Error updating share value : ', error);
            alert('Error updating share value. Please try again later.');
        });
    }

    return <>
        <div className="header">
            <header className='mb-5 text-2xl'>All Vest Trading - Update Share Component</header>
        </div>
        <UpdateTable tableData={shareData} updateShare={updateShare}></UpdateTable>
    </>
}

export default UpdateShare;