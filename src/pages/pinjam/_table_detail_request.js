import { useEffect, useState } from "react"

export default function TableDetailRequest(props) {
    const { model } = props 
    let totalReq = 0 
    return (
        <div className="rounded-2xl bg-white p-4">
            <h3 className="my-3 font-bold">Detail Request</h3>
            <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-y border-gray-300">
                            <th className="px-1 py-1 text-left">#</th>
                            <th className="px-1 py-1 text-left sticky left-0 bg-gray-200">Nama</th>
                            <th className="px-1 py-1 text-left">No Katalog</th>
                            <th className="px-1 py-1 text-left">Brand</th>
                            <th className="px-1 py-1 text-right w-[100px]">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            model.detail?.length > 0 ? <>
                                {
                                    model.detail
                                        .toSorted((a, b) => (a.nama - b.nama))
                                        .map((v, k) => {
                                            totalReq += v.amt
                                            return <>
                                                <tr className="border-y border-gray-300" key={k}>
                                                    <td className="px-1 py-1">{k + 1}</td>
                                                    <td className="px-1 py-1 sticky left-0 bg-gray-200">{v.nama} {v.jenis === 'set' && <span className="text-red-600 font-bold ml-1">(set)</span>} </td>
                                                    <td className="px-1 py-1">{v.no_katalog}</td>
                                                    <td className="px-1 py-1">{v.brand}</td>
                                                    <td className="px-1 py-1 text-right">{v.amt}</td>
                                                </tr>
                                            </>
                                        })
                                }
                            </> : <tr>
                                <td colSpan="5" className="text-center italic py-2">- no data -</td>
                            </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className=""></td>
                            <td className="px-1 py-1 font-bold sticky left-0 bg-gray-200">Total</td>
                            <td className="px-1 py-1 text-right">
                                {totalReq}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}