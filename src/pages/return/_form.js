'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import dayjs from "dayjs"
import { Datepicker, Tooltip } from "flowbite-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiExclamation, HiSave } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function ReturnForm(props) {

    const router = useRouter()

    const { modelPinjam, model } = props
    const [state, setState] = useState({
        input: {
            id: '',
            dt_return: new Date(),
            ruangan: '',
            kamar: '',
            nomor: '',
            submitter: '',
            verifikator: '',
            items: [],
            filter_list: '',
            filter_pick: ''
        },
        list: [],
        pick: [],
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)
    const [instrumen, setInstrumen] = useState([])
    const dispatch = useDispatch()

    const handleChange = (e) => {
        let { name, value, type, checked } = e.target

        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [name]: value
            },
        }))
    }

    const submit = async () => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        const payloads = { ...state.input }
        delete payloads['filter_list']
        delete payloads['filter_pick']

        let list = [...instrumen]
            .map((v, k) => {
                return {
                    instrumen: v.id,
                    amt: v.amt,
                    amt_return: v.amt_return,
                }
            })
        payloads.list = list

        const method = 'POST'
        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/return/verifikasi/${model.return.trans_kode}`,  params:{},payloads:payload }))
        .then((resp) => {
          return {...resp.payload}
        }, (error) => {
          if (error.response) {
          }
          return error.response
        })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            if (method === 'POST') {
            } else {
            }
            router.push(`/return/view/${data.data.trans_kode}`)
        } else {
             
            if (errors) {
                setState((prevState) => ({
                    ...prevState,
                    errors: errors
                }))
            }
        }
        setSubmitting(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        submit();
    }

    const handleChangeAmt = (id) => (e) => {
        const { name, value } = e.target
        let idx = -1
        let lastState = [...instrumen]
        lastState.map((v, k) => {
            if (v.id === id) {
                idx = k
            }
        })
        lastState[idx].amt_return = value
        setState((prevState) => ({
            ...prevState,
            list: lastState
        }))
        CalcuTotalCL(lastState)
    }

    const [totalCekList, setTotalCekList] = useState(0)
    const [totalPinjam, setTotalPinjam] = useState(0)
    const CalcuTotalCL = async (instrumen) => {
        let totalCL = 0, totalPinjam = 0
        await Promise.all(
            instrumen.map((v, k) => {
                if (v.amt_return) {
                    totalCL += (Math.floor(v.amt_return * 1))
                }
                if (v.amt) {
                    totalPinjam += (Math.floor(v.amt * 1))
                }
            })
        )
        setTotalCekList(totalCL)
        setTotalPinjam(totalPinjam)
        console.log(totalCL, totalPinjam)
        return totalCL

    }
    useEffect(() => {
        if (instrumen) {
            CalcuTotalCL(instrumen)
        }
    }, [instrumen])

    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (modelPinjam) {
            setInstrumen(modelPinjam.detail)
            setState((prevState) => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    id: model.return?.trans_kode,
                    submitter: model.return?.submitter,
                    verifikator: model.return?.verifikator,
                }
            }))
        }
    }, [modelPinjam])

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" >
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2 rounded-2xl bg-white p-4">
                        <h3 className="font-bold text-xl mb-3">Data Pengembalian </h3>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Tanggal Kembali</label>
                            <div className="flex flex-col gap-2 lg:w-7/12">
                                <Datepicker className="" value={state.input.dt_return} onChange={(e) => {
                                    handleChange({ target: { name: 'dt_return', value: e } })
                                }} placeholder="Pilih tanggal" defaultValue={new Date()} />
                                {
                                    state.errors.dt_return && <div className="text-red-500 text-xs block">
                                        {state.errors.dt_return}
                                    </div>
                                }
                            </div>

                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Petugas Pengembali</label>
                            <div className="flex flex-col gap-2 lg:w-7/12">
                                <input className={["border py-1 rounded-xl px-2 placeholder:text-[#A0AEC0] col-span-4", (state.errors.submitter) ? "border-red-800" : "border-gray-200"].join(" ")} name="submitter" type="text" onChange={handleChange} value={state.input.submitter} />
                                {
                                    state.errors.submitter && <div className="text-red-500 text-xs block">
                                        {state.errors.submitter}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Petugas Verifikator</label>
                            <div className="flex flex-col gap-2 lg:w-7/12">
                                <input className={["border py-1 rounded-xl px-2 placeholder:text-[#A0AEC0] col-span-4", (state.errors.verifikator) ? "border-red-800" : "border-gray-200"].join(" ")} name="verifikator" type="text" onChange={handleChange} value={state.input.verifikator} />
                                {
                                    state.errors.verifikator && <div className="text-red-500 text-xs block">
                                        {state.errors.verifikator}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2  rounded-2xl bg-red-50 p-4">
                        <h3 className="font-bold text-xl mb-3">Data Peminjaman</h3>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Tanggal Pinjam</label>
                            <Datepicker className="lg:w-7/12" defaultValue={dayjs(model.return?.tgl).toDate()} readOnly />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Ruangan</label>
                            <input className={["lg:w-7/12 border py-1 rounded-xl px-2 placeholder:text-[#A0AEC0] col-span-4", "border-gray-200"].join(" ")} type="text" defaultValue={`${model.return?.ruang_nama} - ${model.return?.institusi_nama}`} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Kamar</label>
                            <input className={["lg:w-7/12 border py-1 rounded-xl px-2 placeholder:text-[#A0AEC0] col-span-4", "border-gray-200"].join(" ")} type="text" defaultValue={`${model.return?.kamar}`} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Nomor</label>
                            <input className={["lg:w-7/12 border py-1 rounded-xl px-2 placeholder:text-[#A0AEC0] col-span-4", "border-gray-200"].join(" ")} type="text" defaultValue={`${model.return?.nomor}`} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Petugas Pengepakan</label>
                            <input className={["lg:w-7/12 border py-1 rounded-xl px-2 placeholder:text-[#A0AEC0] col-span-4", "border-gray-200"].join(" ")} type="text" defaultValue={`${model.return?.packer}`} />
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-5/12">Petugas Penerima</label>
                            <input className={["lg:w-7/12 border py-1 rounded-xl px-2 placeholder:text-[#A0AEC0] col-span-4", "border-gray-200"].join(" ")} type="text" defaultValue={`${model.return?.receiver}`} />
                        </div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 rounded-2xl bg-white p-4">
                    <h3 className="font-bold text-xl mb-3">Checklist Instrumen</h3>
                    <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-y">
                                    <th className="px-1 py-1 text-left w-[40px]">#</th>
                                    <th className="px-1 py-1 text-left">Nama</th>
                                    <th className="px-1 py-1 text-left bg-amber-100">Dalam Set</th>
                                    <th className="px-1 py-1 text-left">No Katalog</th>
                                    <th className="px-1 py-1 text-left">Brand</th>
                                    <th className="px-1 py-1 text-right w-[100px]">Jml Pinjam</th>
                                    <th className="px-1 py-1 text-right w-[100px]">Jml Kembali</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    modelPinjam.detail.length > 0 ? <>
                                        {
                                            modelPinjam.detail
                                                .filter((v) => {
                                                    return (v.nama.toLowerCase().indexOf(state.input.filter_list.toLowerCase()) >= 0)
                                                        || (v.no_katalog.toLowerCase().indexOf(state.input.filter_list.toLowerCase()) >= 0)
                                                        || (v.brand.toLowerCase().indexOf(state.input.filter_list.toLowerCase()) >= 0)
                                                })
                                                .map((v, k) => {
                                                    return <>
                                                        <tr className="border-y" key={k}>
                                                            <td className="px-1 py-1">{k + 1}</td>
                                                            <td className="px-1 py-1">{v.nama}</td>
                                                            <td className={["px-1 py-1", (v.set_nama) ? 'bg-amber-100' : ''].join(" ")}> {v.set_nama}</td>
                                                            <td className="px-1 py-1">{v.no_katalog}</td>
                                                            <td className="px-1 py-1">{v.brand}</td>
                                                            <td className="px-1 py-1 text-end">{v.amt}</td>
                                                            <td className="px-1 py-1 flex gap-2 items-center">
                                                                {
                                                                    state.errors[`list-${k}-amt_return`] && <>
                                                                        <Tooltip content={state.errors[`list-${k}-amt_return`]}>
                                                                            <button className="text-red-500"><HiExclamation /></button>
                                                                        </Tooltip>
                                                                    </>
                                                                }
                                                                <input className={["border px-2 rounded w-full py-1 px-1 text-xs text-right", (state.errors[`list-${k}-amt_return`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={v.amt_return} onChange={handleChangeAmt(v.id)} />

                                                            </td>
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
                                    <td colSpan={4}></td>
                                    <td className="px-1 py-1 font-bold">Total</td>
                                    <td className="px-1 py-1 text-right">
                                        <input type="number" className={["border px-2 border-gray-200 rounded w-full text-right text-sm py-1 px-1"].join(" ")} value={totalPinjam} readOnly />
                                    </td>
                                    <td className="px-1 py-1 text-right">
                                        <input type="number" className={["border px-2 border-gray-200 rounded w-full text-right text-sm py-1 px-1", (totalCekList)].join(" ")} value={totalCekList} readOnly />
                                    </td>
                                </tr>
                                {
                                    (totalCekList < totalPinjam) && <tr>
                                        <td colSpan={4}></td>
                                        <td colSpan={4} className="px-2 py-1 font-bold text-end"><span className="text-red-500">Jumlah kembali kurang</span></td>
                                    </tr>
                                }
                            </tfoot>
                        </table>
                        {
                            state.errors[`list`] && <div className="text-red-500 text-xs block text-sm my-2">
                                {state.errors[`list`]}
                            </div>
                        }
                    </div>
                </div>
                <hr className="my-3" />
                <div className="flex flex-col gap-2">
                    <div>
                        <button type="submit" className="rounded-full py-2 px-4 bg-blue-800 text-white flex gap-3 items-center"><span><HiSave /></span>Simpan</button>
                    </div>
                </div>
            </form >
        </>

    )
}