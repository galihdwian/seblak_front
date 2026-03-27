import { useEffect, useState } from "react"

export default function TableDetailDefault(props) {
    const { model } = props

    const [instuPcs, setInstruPcs] = useState([])
    const [instruSet, setInstruSet] = useState([])

    useEffect(() => {
        if (model.detail) {

            const pcs = []
            const set = []

            model.detail.map((v, k) => {
                if (v.jenis === 'pcs') {
                    pcs.push(v)
                } else {
                    let setPush = {}
                    setPush.nama = v.set_list.nama
                    Object.keys(v.set_list.instrumen).map((keyObj) => {
                        if (!setPush.instrumen) {
                            setPush.instrumen = []
                        }
                        setPush.instrumen = [...setPush.instrumen, ...v.set_list.instrumen[keyObj]]
                    })
                    set.push(setPush)
                }
            })

            setInstruPcs(pcs)
            setInstruSet(set)

        }
    }, [model.detail])

    const TableGroup = (model, title, data, state) => {

        let totalReq = 0
        let totalA1 = 0
        let totalB1 = 0
        let totalB2 = 0
        let totalA2 = 0
        let totalSet = 0
        
        return <div className="px-4 bg-white rounded-2xl">
            <h3 className="font-bold text-green-700 mb-2 py-3">{title}</h3>
            <div className="overflow-auto pb-4 max-h-screen">
                <table className="table-fixed w-full lg:w-auto text-xs">
                    <thead>
                        <tr className="border-y border-gray-300">
                            <th className="px-1 py-1 text-left w-[40px]">#</th>
                            <th className="px-1 py-1 text-left w-[160px] sticky left-0 bg-gray-200">Nama</th>
                            <th className="px-1 py-1 text-left w-[120px]">No Katalog</th>
                            <th className="px-1 py-1 text-left w-[120px]">Brand</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-orange-200">A1</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-green-200">B1</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-red-200">B2</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-blue-200">A2</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-purple-200">Setting</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.length > 0 ? <>
                                {
                                    data
                                        .map((v, k) => {
                                            totalReq += v.amt
                                            totalA1 += v.amt_a1
                                            totalA2 += v.amt_a2
                                            totalB1 += v.amt_b1
                                            totalB2 += v.amt_b2
                                            totalSet += v.amt_sett
                                            return <>
                                                <tr className="border-y border-gray-300" key={k}>
                                                    <td className="px-1 py-1">{k + 1}</td>
                                                    <td className="px-1 py-1 sticky left-0 bg-gray-200">{v.nama}</td>
                                                    <td className="px-1 py-1">{v.no_katalog}</td>
                                                    <td className="px-1 py-1">{v.brand}</td>
                                                    <td className="px-1 py-1 text-right bg-orange-200">{v.amt_a1}</td>
                                                    <td className="px-1 py-1 text-right bg-green-200">{v.amt_b1}</td>
                                                    <td className="px-1 py-1 text-right bg-red-200">{v.amt_b2}</td>
                                                    <td className="px-1 py-1 text-right bg-blue-200">{v.amt_a2}</td>
                                                    <td className="px-1 py-1 text-right bg-purple-200">{v.amt_sett}</td>
                                                </tr>
                                            </>
                                        })
                                }
                            </> : <tr>
                                <td colSpan={3} className="text-center italic py-2">- no data -</td>
                            </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td></td>
                            <td className="px-1 py-1 font-bold text-sm sticky left-0 bg-gray-200">Total</td>
                            <td></td>
                            <td></td>
                            <td className="px-1 py-1 font-bold text-sm text-right">{totalA1}</td>
                            <td className="px-1 py-1 font-bold text-sm text-right">{totalB1}</td>
                            <td className="px-1 py-1 font-bold text-sm text-right">{totalB2}</td>
                            <td className="px-1 py-1 font-bold text-sm text-right">{totalA2}</td>
                            <td className="px-1 py-1 font-bold text-sm text-right">{totalSet}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    }

    return (
        <div className="flex flex-col gap-y-4 overflow-auto">
            {
                (instuPcs.length > 0) && TableGroup(model, 'Instrumen Per Pcs', instuPcs)
            }
            {
                (instruSet.length > 0) && <>
                    {
                        instruSet.map((v, k) => {
                            return TableGroup(model, `${v.nama}`, v.instrumen)
                        })
                    }

                </>
            }
        </div>
    )

    return (
        <div className="rounded-2xl bg-white p-4">
            <h3 className="my-3 font-bold">Detail Instrumen</h3>
            <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-y">
                            <th className="px-1 py-1 text-left w-[40px]">#</th>
                            <th className="px-1 py-1 text-left">Nama</th>
                            <th className="px-1 py-1 text-left">No Katalog</th>
                            <th className="px-1 py-1 text-left">Brand</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-orange-200">A1</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-green-200">B1</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-red-200">B2</th>
                            <th className="px-1 py-1 text-right w-[50px] bg-blue-200">A2</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            model.detail?.length > 0 ? <>
                                {
                                    model.detail
                                        .toSorted((a, b) => (b.nama - a.nama))
                                        .map((v, k) => {
                                            return <>
                                                <tr className="border-y" key={k}>
                                                    <td className="px-1 py-1">{k + 1}</td>
                                                    <td className="px-1 py-1">{v.nama}</td>
                                                    <td className="px-1 py-1">{v.no_katalog}</td>
                                                    <td className="px-1 py-1">{v.brand}</td>
                                                    <td className="px-1 py-1 text-right bg-orange-200">{v.amt_a1}</td>
                                                    <td className="px-1 py-1 text-right bg-green-200">{v.amt_b1}</td>
                                                    <td className="px-1 py-1 text-right bg-red-200">{v.amt_b2}</td>
                                                    <td className="px-1 py-1 text-right bg-blue-200">{v.amt_a2}</td>
                                                </tr>
                                            </>
                                        })
                                }
                            </> : <tr>
                                <td colSpan="4" className="text-center italic py-2">- no data -</td>
                            </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={3} className=""></td>
                            <td className="px-1 py-1 font-bold">Total</td>
                            <td className="px-1 py-1 text-right">
                                {model.pinjam?.total_itm}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    )
}