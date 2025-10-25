import type { typeUserShareObj } from "../../types/share";

function UserTable({ tableData, buySell }: { tableData: typeUserShareObj[], buySell: (action: string, shareId: string) => void }) {
    return <><table className="min-w-full border-collapse border border-gray-200">
        <thead>
            <tr>
                <th className="border border-gray-300 px-4 py-2">Share</th>
                <th className="border border-gray-300 px-4 py-2">Market Value</th>
                <th className="border border-gray-300 px-4 py-2">Average Value</th>
                <th className="border border-gray-300 px-4 py-2">Unrealised Gain</th>
                <th className="border border-gray-300 px-4 py-2">Qty</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
        </thead>
        <tbody>
            {tableData.length > 0 ? tableData.map((data) => {
                return <tr id={data.id} className="border border-gray-300 px-4 py-2">
                    <td className="border border-gray-300 px-4 py-2">{data.share}</td>
                    <td className={`border border-gray-300 px-4 py-2`}> {parseFloat(data.currentMarketValue.toFixed(3).toString())} </td>
                    <td className={`border border-gray-300 px-4 py-2`}> {parseFloat(data.averageValue.toFixed(2).toString())} </td>
                    <td className={`border border-gray-300 px-4 py-2 ${data.unrealisedGain > 0 ? 'bg-green-600' : (data.unrealisedGain == 0 ? '' : 'bg-red-500')}`}>{parseFloat(data.unrealisedGain.toFixed(2).toString())}</td>
                    <td className="border border-gray-300 px-4 py-2">
                        {data.qty}
                    </td>
                    <td>
                        {/* <button className="btn btn-primary border-1 p-1 m-2" onClick={() => buySell("buy", data.id)}>Buy</button> */}
                        <button className="btn btn-primary border-1 p-1 m-2" onClick={() => buySell("sell", data.id)}>Sell</button>
                    </td>
                </tr>
            }) : <tr><td colSpan={4}>No data found!</td></tr>}
        </tbody>
    </table >
    </>
}

export default UserTable;