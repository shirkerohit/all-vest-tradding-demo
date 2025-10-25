import type { typeShareObj } from "../../types/share";

function Table({ tableData, buySell }: { tableData: typeShareObj[], buySell: (action: string, shareId: string) => void }) {
    return <><table className="min-w-full border-collapse border border-gray-200">
        <thead>
            <tr>
                <th className="border border-gray-300 px-4 py-2">Share</th>
                <th className="border border-gray-300 px-4 py-2">Market Value</th>
                <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
        </thead>
        <tbody>
            {tableData.length > 0 ? tableData.map((data) => {
                return <tr id={data.id} className="border border-gray-300 px-4 py-2">
                    <td className="border border-gray-300 px-4 py-2">{data.share}</td>
                    <td className="border border-gray-300 px-4 py-2">${data.value}</td>
                    <td>
                        <button className="btn btn-primary border-1 p-1 m-2" onClick={() => buySell("buy", data.id)}>Buy</button>
                    </td>
                </tr>
            }) : <tr><td colSpan={3}>No data found!</td></tr>}
        </tbody>
    </table>
    </>
}

export default Table;