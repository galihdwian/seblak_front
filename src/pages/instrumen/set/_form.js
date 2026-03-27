'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import { error, success } from "@/lib/store/features/messageSlice"
import { Tooltip } from "flowbite-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaSpinner } from "react-icons/fa6"
import { HiArrowCircleLeft, HiArrowCircleRight, HiExclamation, HiSave } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function InstrumenSetForm(props) {

    const { id, model } = props
    const dispatch = useDispatch()
    const router = useRouter()
    const [state, setState] = useState({
        input: {
            id: '',
            nama: '',
            institusi: '',
            filter_list: '',
            filter_pick: ''
        },
        list: [],
        pick: [],
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)

    const [loading, setLoading] = useState(false)
    const [instrumen, setInstrumen] = useState([])

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen`, params: { jenis: 'chk' }, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            let newData = []
            data.data.map((v, k) => {
                let item = { ...v }
                item.flag = 'pick'
                item.amt = 0
                newData.push(item)
            })

            if (model) {
                await Promise.all(
                    newData.map((v, k) => {
                        model.list.map((vv, kk) => {
                            if (v.id === `chk-${vv.id}`) {
                                newData[k].flag = 'list'
                                newData[k].amt = vv.amt
                            }
                        })
                    })
                )
                setState((prevState) => ({
                    ...prevState,
                    input: {
                        ...prevState.input,
                        ...model.set
                    }
                }))
            }
            setInstrumen(newData)
        } else {
            dispatch(error(data.responseMessage))
        }
        setLoading(false)
    }

    useEffect(() => {
        const aaa = async () => {
            await loadData()
        }
        aaa()
    }, [])

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

        const payloads = {
            id: state.input.id,
            nama: state.input.nama,
            tgl_expired: state.input.tgl_expired,
            list: []
        }

        instrumen.map((v, k) => {
            if (v.flag === 'list') {
                payloads.list.push({
                    instrumen: v.id,
                    amt: v.amt
                })
            }
        })

        if (payloads.list.length === 0) {
            // OpenSwal({
            //     title:'Inputan Tidak Valid',
            //     html: 'Tidak ada list instrumen dipilih',
            //     icon: 'exclamation'
            // })
        }


        const method = state.input.id ? 'PUT' : 'POST'
        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/instrumen/set`, params: {}, payloads: payloads }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            dispatch(success(data.responseMessage))
            let id = data.data?.id
            if (id) {
                router.push(`/instrumen/set/update?id=${id}`)
            } else {
                router.push(`/instrumen/set`)
            }

        } else {
            dispatch(error(result.responseMessage))
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

    const handleAdd = () => {
        let lastState = [...instrumen]
        lastState.map((v, k) => {
            state.pick.forEach((id) => {
                if (id === v.id) {
                    lastState[k].flag = 'list'
                    lastState[k].amt = 0
                }
            })
        })
        setInstrumen(lastState)
        setState((prevState) => ({
            ...prevState,
            pick: [],
        }))
        document.querySelectorAll('input[name="chk_pick"]').forEach((el) => {
            el.checked = false
        })
    }

    const handleRem = () => {
        let lastState = [...instrumen]
        lastState.map((v, k) => {
            state.list.forEach((id) => {
                if (id === v.id) {
                    lastState[k].flag = 'pick'
                }
            })
        })
        setInstrumen(lastState)
        setState((prevState) => ({
            ...prevState,
            list: [],
        }))
        document.querySelectorAll('input[name="chk_list"]').forEach((el) => {
            el.checked = false
        })
    }

    const handleCheckItem = (option, selected) => (e) => {
        const { checked, name } = e.target

        let idx = -1

        if (option === 'list') {
            idx = state.list.indexOf(selected)
        } else {
            idx = state.pick.indexOf(selected)
        }

        if (checked) {
            if (option === 'list') {
                setState((prevState) => ({
                    ...prevState,
                    list: [
                        ...prevState.list,
                        selected
                    ]
                }))
            } else {
                setState((prevState) => ({
                    ...prevState,
                    pick: [
                        ...prevState.pick,
                        selected
                    ]
                }))
            }
        } else {
            if (option === 'list') {
                let lastState = [...state.list]
                lastState.splice(idx, 1)
                setState((prevState) => ({
                    ...prevState,
                    list: lastState
                }))
            } else {
                let lastState = [...state.pick]
                lastState.splice(idx, 1)
                setState((prevState) => ({
                    ...prevState,
                    pick: lastState
                }))
            }
        }
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
        lastState[idx].amt = value
        setInstrumen(lastState)
    }

    const [totalCekList, setTotalCekList] = useState(0)
    useEffect(() => {
        let totalCL = 0
        if (instrumen) {
            instrumen.map((v, k) => {
                if (v.flag === 'list') {
                    totalCL += (v.amt * 1)
                }
            })
        }
        setTotalCekList(totalCL)
    }, [instrumen])

    return (
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-3 lg:w-2/3 py-4">
                    <div className="flex flex-col lg:flex-row gap-1">
                        <label className="lg:w-3/12">Nama Instrumen</label>
                        <div className="flex flex-col gap-2 grow">
                            <input className={["py-1 px-2 border border-grey-200 rounded-xl lg:grow lg:grow"].join(" ")} name="nama" placeholder="" type="text" onChange={handleChange} value={state.input.nama} />
                            {
                                state.errors.nama && <div className="text-red-500 block text-xs">
                                    {state.errors.nama}
                                </div>
                            }
                        </div>
                    </div>
                    <div className="flex flex-col lg:flex-row gap-1">
                        <label className="lg:w-3/12">Tgl Expired</label>
                        <div className="flex flex-col gap-2 grow">
                            <input className={["py-1 px-2 border border-grey-200 rounded-xl lg:grow lg:grow"].join(" ")} name="tgl_expired" placeholder="" type="datetime-local" onChange={handleChange} value={state.input.tgl_expired} />
                            {
                                state.errors.tgl_expired && <div className="text-red-500 block text-xs">
                                    {state.errors.tgl_expired}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="overflow-auto w-full p-4 bg-white rounded-xl">
                        <div className="flex flex-row justify-between items-center">
                            <h3 className="font-bold my-3">Ceklist Item</h3>
                            <div>
                                <button type="button" onClick={() => handleRem()} className="flex gap-3 items-center py-1 px-3 bg-red-500 rounded-xl text-white">Rem (-) <HiArrowCircleRight /> </button>
                            </div>
                        </div>
                        <div className="flex flex-row my-2">
                            <input className="rounded-xl px-2 py-1 border border-gray-200 grow" placeholder="cari item..." type="text" name="filter_list" value={state.input.filter_list} onChange={handleChange} />
                        </div>
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-y">
                                    <th className="px-1 py-1">Cek</th>
                                    <th className="px-1 py-1">Nama</th>
                                    <th className="px-1 py-1">No Katalog</th>
                                    <th className="px-1 py-1">Brand</th>
                                    <th className="px-1 py-1">Jumlah</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    instrumen
                                        .filter((v) => (v.flag === 'list'))
                                        .filter((v) => {
                                            return ((v.nama + "").toLowerCase().indexOf(state.input.filter_list.toLowerCase()) >= 0)
                                                || ((v.no_katalog + "").toLowerCase().indexOf(state.input.filter_list.toLowerCase()) >= 0)
                                                || ((v.brand + "").toLowerCase().indexOf(state.input.filter_list.toLowerCase()) >= 0)
                                        })
                                        .map((v, k) => {
                                            return <tr className="border-y" key={k}>
                                                <td className="px-1 py-1 text-center"><input type="checkbox" name="chk_list" onChange={handleCheckItem('list', v.id)} /></td>
                                                <td className="px-1 py-1">{v.nama}</td>
                                                <td className="px-1 py-1">{v.no_katalog}</td>
                                                <td className="px-1 py-1">{v.brand}</td>
                                                <td className="px-1 py-1">
                                                    <div className="max-w-[80px] flex gap-2 items-center">
                                                        {
                                                            state.errors[`list-${k}-amt`] && <>
                                                                <Tooltip content={state.errors[`list-${k}-amt`]}>
                                                                    <button className="text-red-500"><HiExclamation /></button>
                                                                </Tooltip>
                                                            </>
                                                        }
                                                        <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${k}-amt`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={v.amt} onChange={handleChangeAmt(v.id)} />
                                                    </div>
                                                </td>
                                            </tr>
                                        })
                                }
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={4} className="px-1 py-1 text-center font-bold">Total</td>
                                    <td className="px-1 py-1 text-right">
                                        <div className="max-w-[80px] flex">
                                            <input type="number" className="w-full text-right text-xs p-1" value={totalCekList} readOnly />
                                        </div>
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                    <div className="overflow-auto w-full p-4 bg-white rounded-xl">
                        <div className="flex flex-row justify-between items-center">
                            <div>
                                <button onClick={() => handleAdd()} type="button" className="flex gap-3 items-center py-1 px-3 bg-green-500 rounded-xl text-white"><HiArrowCircleLeft /> (+) Add</button>
                            </div>
                            <h3 className="font-bold my-3">Pilih Item</h3>
                        </div>
                        <div className="flex flex-row my-2">
                            <input className="rounded-xl px-2 py-1 border border-gray-200 grow" placeholder="cari item..." type="text" name="filter_pick" value={state.input.filter_pick} onChange={handleChange} />
                        </div>
                        <div className="max-h-[400px] overflow-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-y">
                                        <th className="px-1 py-1 w-[20px]">Cek</th>
                                        <th className="px-1 py-1">Nama</th>
                                        <th className="px-1 py-1">No Katalog</th>
                                        <th className="px-1 py-1">Brand</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        instrumen
                                            .filter((v) => (v.flag === 'pick'))
                                            .filter((v) => {
                                                return ((v.nama + "").toLowerCase().indexOf(state.input.filter_pick.toLowerCase()) >= 0)
                                                    || ((v.no_katalog + "").toLowerCase().indexOf(state.input.filter_pick.toLowerCase()) >= 0)
                                                    || ((v.brand + "").toLowerCase().indexOf(state.input.filter_pick.toLowerCase()) >= 0)
                                            })
                                            .map((v, k) => {
                                                return <tr className="border-y" key={k}>
                                                    <td className="px-1 py-1 text-center"><input type="checkbox" name="chk_pick" onChange={handleCheckItem('pick', v.id)} /></td>
                                                    <td className="px-1 py-1">{v.nama}</td>
                                                    <td className="px-1 py-1">{v.no_katalog}</td>
                                                    <td className="px-1 py-1">{v.brand}</td>
                                                </tr>
                                            })
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                <div className="sticky bottom-0 bg-gray-100 py-4 px-2">
                    <button type="submit" className="rounded-full py-2 px-4 bg-blue-800 text-white flex gap-3 items-center icon-spin" disabled={submitting}>
                        {
                            submitting ? <><FaSpinner className="icon-spin" /> Submitting...</>
                                : <><span><HiSave /></span> Submit
                                </>
                        }
                    </button>
                </div>
            </div>

        </form>
    )
}