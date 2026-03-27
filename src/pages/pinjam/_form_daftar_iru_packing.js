import { Tooltip } from "flowbite-react"
import { useEffect, useState } from "react"
import { HiExclamation, HiTrash } from "react-icons/hi"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"

export default function PinjamFormIruPacking(props) {
    const { action, model, state, instrumen, handleDeleteIruFromList, listAmt, totalCekList, handleChangeAmt, handleOpenModalSet, naList = [], handleChangeNaList } = props

    const [instuPcs, setInstruPcs] = useState([])
    const [instruSet, setInstruSet] = useState([])

    useEffect(() => {
        if (instrumen) {

            const pcs = []
            const set = []

            instrumen.map((v, k) => {
                if (v.jenis === 'pcs') {
                    pcs.push(v)
                } else {
                    Object.keys(v.set_list.instrumen).map((keyObj) => {
                        let setPush = {}
                        setPush.id = v.set_list.id
                        setPush.nama = v.set_list.nama
                        if (!setPush.instrumen) {
                            setPush.instrumen = []
                        }
                        setPush.instrumen = [...setPush.instrumen, ...v.set_list.instrumen[keyObj]]
                        set.push(setPush)
                    })
                }
            })

            setInstruPcs(pcs)
            setInstruSet(set)

        }
    }, [instrumen])

    let totalReq = 0
    let totalA1 = 0
    let totalB1 = 0
    let totalB2 = 0
    let totalA2 = 0
    let totalSet = 0



    const [swalProps, setSwalProps] = useState({
        title: '',
        text: '',
    })
    const showSwal = (props) => {
        return withReactContent(Swal).fire({
            ...props
        })
    }

    const TableGroup = (model, title, data, state, jenis = '', id = undefined) => {
        const disabledBySet = ((jenis === 'set') && (naList.indexOf(`${jenis}-${id}`) >= 0))
        return <div className="px-4 bg-gray-200/40">
            <h3 className="font-bold text-green-700 mb-2 py-3 flex flex-row gap-4">
                {title}
                {
                    jenis === 'set' && ([2, 3].indexOf(model.pinjam?.status) >= 0) && <>
                        <button type="button" className="rounded bg-red-500 text-white p-1 flex items-center" onClick={() => {
                            showSwal({
                                icon: 'question',
                                title: 'Yakin akan dihapus?',
                                text: 'Aksi ini tidak dapat dikembalikan',
                                showConfirmButton: true,
                                showCancelButton: true,
                                confirmButtonColor: "#3085d6",
                                cancelButtonColor: "#d33",
                                cancelButtonText: "Batal",
                                confirmButtonText: "Ya, Hapus!",
                            }).then((res) => {
                                if (res.isConfirmed) {
                                    handleDeleteIruFromList(`${jenis}-${id}`)
                                }
                            })
                        }}><HiTrash style={{ display: 'inline' }} /></button>
                    </>
                }
            </h3>

            <div className="overflow-auto pb-4 max-h-screen">
                <table className={["table-fixed w-100 text-xs", (disabledBySet ? 'text-gray-300' : '')].join(' ')}>
                    <thead>
                        <tr className="border-y border-gray-300">
                            <th className="px-1 py-1 text-left w-[160px] sticky left-0 bg-gray-200">Nama</th>
                            <th className="px-1 py-1 text-left w-[120px]">No Katalog</th>
                            <th className="px-1 py-1 text-left w-[120px]">Brand</th>
                            {
                                (model.pinjam?.status === 2) ? <>
                                    <th className="px-1 py-1 text-right w-[80px] ">Jml Req</th>
                                    <th className="px-1 py-1 text-right min-w-[80px] lg:w-[100px] ">A1</th>
                                </> : <>
                                    {(action !== 'setting') && model.pinjam?.status >= 2 && <th className="px-1 py-1 text-right min-w-[80px] lg:w-[100px] ">A1</th>}
                                    {(action !== 'setting') && model.pinjam?.status >= 3 && <th className="px-1 py-1 text-right min-w-[80px] lg:w-[100px] ">B1</th>}
                                    {(action !== 'setting') && model.pinjam?.status >= 4 && <th className="px-1 py-1 text-right min-w-[80px] lg:w-[100px] ">B2</th>}
                                    {model.pinjam?.status >= 5 && <th className="px-1 py-1 text-right min-w-[80px] lg:w-[100px] ">A2</th>}
                                </>
                            }
                            {([2, 3].indexOf(model.pinjam?.status) >= 0) && (action !== 'setting') && (jenis === 'pcs') && <th className="px-1 py-1 min-w-[80px] lg:w-[100px] ">Aksi</th>}
                            {action === 'setting' && <th className="px-1 py-1 text-right min-w-[80px] lg:w-[100px] ">Setting</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {
                            data?.length > 0 ? <>
                                {
                                    data
                                        .map((v, k) => {
                                            totalReq += v.amt
                                            totalA1 += listAmt[v.id].amt_a1
                                            totalA2 += listAmt[v.id].amt_a2
                                            totalB1 += listAmt[v.id].amt_b1
                                            totalB2 += listAmt[v.id].amt_b2
                                            totalSet += listAmt[v.id].amt_sett
                                            const iDwJenis = `${jenis}-${v.id}`
                                            const inclNA = (naList.indexOf(iDwJenis) >= 0)
                                            return <>
                                                <tr className={["border-y border-gray-300", inclNA ? 'text-gray-400' : ''].join(' ')} key={k}>
                                                    <td className="px-1 py-1 sticky left-0 bg-gray-200">{v.nama}</td>
                                                    <td className="px-1 py-1">{v.no_katalog}</td>
                                                    <td className="px-1 py-1">{v.brand}</td>
                                                    {
                                                        ((action !== 'setting') && ([2].indexOf(model.pinjam?.status) >= 0)) ? <>
                                                            <td className="px-1 py-1 text-end ">{v.amt}</td>
                                                            <td className="px-1 py-1 flex gap-2 items-center  z-100">
                                                                {
                                                                    state.errors[`list-${v.id}-amt_a1`] && <>
                                                                        <Tooltip content={state.errors[`list-${v.id}-amt_a1`]}>
                                                                            <button className="text-red-500"><HiExclamation /></button>
                                                                        </Tooltip>
                                                                    </>
                                                                }
                                                                <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${v.id}-amt_a1`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} disabled={(naList.indexOf(iDwJenis) >= 0) || disabledBySet} type="number" min="0" step="1" value={listAmt[v.id].amt_a1} onChange={handleChangeAmt(v.id, 'a1')} />
                                                            </td>

                                                        </> : <>
                                                            {(action !== 'setting') && model.pinjam?.status >= 2 && <td className="ss">
                                                                <div className="px-1 py-1 flex gap-2 items-center">
                                                                    {
                                                                        state.errors[`list-${v.id}-amt_a1`] && <>
                                                                            <Tooltip content={state.errors[`list-${v.id}-amt_a1`]}>
                                                                                <button className="text-red-500"><HiExclamation /></button>
                                                                            </Tooltip>
                                                                        </>
                                                                    }
                                                                    <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${v.id}-amt_a1`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={listAmt[v.id].amt_a1} onChange={handleChangeAmt(v.id, 'a1')} />
                                                                </div>
                                                            </td>}
                                                            {(action !== 'setting') && model.pinjam?.status >= 3 && <td className="">
                                                                <div className="px-1 py-1 flex gap-2 items-center">
                                                                    {
                                                                        state.errors[`list-${v.id}-amt_b1`] && <>
                                                                            <Tooltip content={state.errors[`list-${v.id}-amt_b1`]}>
                                                                                <button className="text-red-500"><HiExclamation /></button>
                                                                            </Tooltip>
                                                                        </>
                                                                    }
                                                                    <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${v.id}-amt_b1`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={listAmt[v.id].amt_b1} onChange={handleChangeAmt(v.id, 'b1')} />
                                                                </div>
                                                            </td>}
                                                            {(action !== 'setting') && model.pinjam?.status >= 4 && <td className="">
                                                                <div className="px-1 py-1 flex gap-2 items-center">
                                                                    {
                                                                        state.errors[`list-${v.id}-amt_b2`] && <>
                                                                            <Tooltip content={state.errors[`list-${v.id}-amt_b2`]}>
                                                                                <button className="text-red-500"><HiExclamation /></button>
                                                                            </Tooltip>
                                                                        </>
                                                                    }
                                                                    <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${v.id}-amt_b2`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={listAmt[v.id].amt_b2} onChange={handleChangeAmt(v.id, 'b2')} />
                                                                </div>
                                                            </td>}
                                                            {model.pinjam?.status >= 5 && <td className="">
                                                                <div className="px-1 py-1 flex gap-2 items-center">
                                                                    {
                                                                        state.errors[`list-${v.id}-amt_a2`] && <>
                                                                            <Tooltip content={state.errors[`list-${v.id}-amt_a2`]}>
                                                                                <button className="text-red-500"><HiExclamation /></button>
                                                                            </Tooltip>
                                                                        </>
                                                                    }
                                                                    <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${v.id}-amt_a2`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={listAmt[v.id].amt_a2} onChange={handleChangeAmt(v.id, 'a2')} />
                                                                </div>
                                                            </td>}
                                                            {action === 'setting' && <td className="">
                                                                <div className="px-1 py-1 flex gap-2 items-center">
                                                                    {
                                                                        state.errors[`list-${v.id}-amt_sett`] && <>
                                                                            <Tooltip content={state.errors[`list-${v.id}-amt_sett`]}>
                                                                                <button className="text-red-500"><HiExclamation /></button>
                                                                            </Tooltip>
                                                                        </>
                                                                    }
                                                                    <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${v.id}-amt_sett`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={listAmt[v.id].amt_sett} onChange={handleChangeAmt(v.id, 'sett')} />
                                                                </div>
                                                            </td>}






                                                        </>
                                                    }

                                                    {

                                                        ([2, 3].indexOf(model.pinjam?.status) >= 0) && (action !== 'setting') && (jenis === 'pcs') && <td className="text-center">
                                                            <button type="button" className="rounded bg-red-500 text-white p-1 flex items-center mx-auto" onClick={() => {
                                                                showSwal({
                                                                    icon: 'question',
                                                                    title: 'Yakin akan dihapus?',
                                                                    text: 'Aksi ini tidak dapat dikembalikan',
                                                                    showConfirmButton: true,
                                                                    showCancelButton: true,
                                                                    confirmButtonColor: "#3085d6",
                                                                    cancelButtonColor: "#d33",
                                                                    cancelButtonText: "Batal",
                                                                    confirmButtonText: "Ya, Hapus!",
                                                                }).then((res) => {
                                                                    if (res.isConfirmed) {
                                                                        handleDeleteIruFromList(iDwJenis)
                                                                    }
                                                                })
                                                            }}><HiTrash style={{ display: 'inline' }} /></button>
                                                        </td>

                                                    }

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
                        <tr className="border-y">
                            <td colSpan={3} className="font-bold py-2 px-1 text-lg"><span className="">Total</span></td>
                            {
                                ((action !== 'setting') && model.pinjam?.status === 2) ? <>
                                    <td className="font-bold text-right py-2 px-1"> {totalReq} </td>
                                    <td className="font-bold text-right py-2 px-1"><input className={["rounded w-full py-1 px-1 text-xs text-right border border-gray-200"].join(" ")} type="number" min="0" step="1" value={totalA1} readOnly /></td>
                                </>
                                    : <>
                                        {
                                            ((action !== 'setting') && model.pinjam?.status >= 2) &&
                                            <td className="font-bold text-right py-2 px-1"><input className={["rounded w-full py-1 px-1 text-xs text-right border border-gray-200"].join(" ")} type="number" min="0" step="1" value={totalA1} readOnly /></td>
                                        }
                                        {
                                            ((action !== 'setting') && model.pinjam?.status >= 3) &&
                                            <td className="font-bold text-right py-2 px-1"><input className={["rounded w-full py-1 px-1 text-xs text-right border border-gray-200"].join(" ")} type="number" min="0" step="1" value={totalB1} readOnly /></td>
                                        }
                                        {
                                            ((action !== 'setting') && model.pinjam?.status >= 4) &&
                                            <td className="font-bold text-right py-2 px-1"><input className={["rounded w-full py-1 px-1 text-xs text-right border border-gray-200"].join(" ")} type="number" min="0" step="1" value={totalB2} readOnly /></td>
                                        }
                                        {
                                            (model.pinjam?.status >= 5) &&
                                            <td className="font-bold text-right py-2 px-1"><input className={["rounded w-full py-1 px-1 text-xs text-right border border-gray-200"].join(" ")} type="number" min="0" step="1" value={totalA2} readOnly /></td>
                                        }
                                        {
                                            (action === 'setting') &&
                                            <td className="font-bold text-right py-2 px-1"><input className={["rounded w-full py-1 px-1 text-xs text-right border border-gray-200"].join(" ")} type="number" min="0" step="1" value={totalSet} readOnly /></td>
                                        }


                                    </>
                            }
                        </tr>
                    </tfoot>
                </table>

            </div>
        </div>
    }

    return (
        <div className="flex flex-col gap-y-4 overflow-auto">
            {
                (instuPcs.length > 0) && TableGroup(model, 'Instrumen Per Pcs', instuPcs, state, 'pcs')
            }
            {
                (instruSet.length > 0) && <>
                    {
                        instruSet.map((v, k) => {
                            return TableGroup(model, `${v.nama}`, v.instrumen, state, 'set', v.id)
                        })
                    }

                </>
            }
            {
                state.errors[`list`] && <div className="text-red-500 block text-sm my-2">
                    {state.errors[`list`]}
                </div>
            }
        </div>
    )
}