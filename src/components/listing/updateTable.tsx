import { useEffect, useState } from "react";
import type { compositeShare } from "../../types/share";

function UpdateTable({ tableData, updateShare }: { tableData: compositeShare[], updateShare: (shareId: string, shareValue: number) => void }) {

    const [tableRenderData, setTableRenderData] = useState<compositeShare[]>([]);

    useEffect(() => {
        setTableRenderData(tableData);
        console.log('table data in update table changed : ', tableRenderData);

    }, [tableData]);

    function updateTradePrice(shareId: string) {
        const inputElement = document.getElementById('share-' + shareId) as HTMLInputElement;
        const newValue = parseFloat(inputElement.value);
        if (!isNaN(newValue)) {
            updateShare(shareId, newValue);
        } else {
            alert('Please enter a valid number for the new share value.');
        }
    }

    function changeValue(id: string, value: string) {

        if (isNaN(parseFloat(value)) && value !== "") {
            alert('Please enter a valid number for the new share value.');
            return;
        }

        setTableRenderData(prev =>
            prev.map(share =>
                share.id === id ? { ...share, value: parseFloat(value) || 0 } : share
            )
        );
    }


    return <><table className="min-w-full border-collapse border border-gray-200">
        <thead>
            <tr>
                <th className="border border-gray-300 px-4 py-2">Share</th>
                <th className="border border-gray-300 px-4 py-2">Market Value</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
        </thead>
        <tbody>
            {tableRenderData.length > 0 ? tableRenderData.map((data) => {
                return <tr id={data.id} className="border border-gray-300 px-4 py-2">
                    <td className="border border-gray-300 px-4 py-2">{data.share}</td>
                    <td className="border border-gray-300 px-4 py-2">${data.value}</td>
                    <td>
                        <input type="text" id={"share-" + data.id} name="newvalue" className="border border-gray-300 px-2 py-1 mr-2"
                            placeholder="New Value" value={data.value} onChange={(e) => changeValue(data.id, e.target.value)} />
                        <button className="btn btn-primary border-1 p-1 m-2" onClick={() => updateTradePrice(data.id)}>Update Price</button>
                    </td>
                </tr>
            }) : <tr><td colSpan={4}>No data found!</td></tr>}
        </tbody>
    </table >
    </>
}

export default UpdateTable;