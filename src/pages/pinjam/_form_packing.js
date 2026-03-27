'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import { error, success } from "@/lib/store/features/messageSlice"
import { Datepicker } from "flowbite-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaCheckDouble, FaSpinner } from "react-icons/fa6"
import { HiSave } from "react-icons/hi"
import { useDispatch } from "react-redux"
import PinjamFormIruPacking from "./_form_daftar_iru_packing"

export default function PinjamForm_Packing(props) {

    const { id, model, action } = props
    const router = useRouter();
    const [state, setState] = useState({
        input: {
            id: '',
            dt_pakai: new Date(),
            ruang_id: '',
            kamar: '',
            nomor: '',
            pasien: '',
            a1: '',
            receiver: '',
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
    const [listAmt, setListAmt] = useState({})
    const [naList, setNaList] = useState([])

    const dispatch = useDispatch()

    useEffect(() => {
        if (model) {
            setState((prevState) => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    ...model.pinjam
                }
            }))
            setInstrumen([...model.detail])
        }
    }, [model])

    useEffect(() => {
        if (instrumen) {
            let list = {}

            instrumen.map((v, k) => {
                if (v.jenis === 'pcs') {
                    list[v.id] = ({
                        instrumen: v.id,
                        amt: v.amt,
                        amt_a1: v.amt_a1,
                        amt_b1: v.amt_b1,
                        amt_b2: v.amt_b2,
                        amt_a2: v.amt_a2,
                        nama: v.nama,
                        set_nama: v.set_nama,
                    })
                } else {
                    Object.keys(v.set_list.instrumen).map((keyObj) => {
                        v.set_list.instrumen[keyObj].map((vv, kk) => {
                            list[vv.id] = ({
                                instrumen: vv.id,
                                amt: vv.amt,
                                amt_a1: vv.amt_a1,
                                amt_b1: vv.amt_b1,
                                amt_b2: vv.amt_b2,
                                amt_a2: vv.amt_a2,
                                nama: vv.nama,
                                set_nama: vv.set_nama,
                            })
                        })
                    })
                }
            })
            setListAmt(list)
        }
    }, [instrumen])

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

        let list = Object.keys(listAmt).map((key) => {
            return listAmt[key]
        })

        payloads.list = list
        payloads.status = (payloads.status + 1)

        let method = 'PUT'
        let endpoint = `/pinjam/packing`

        switch (model.pinjam?.status) {
            case 2:
                payloads.status = 3
                break;
            default:
                break;
        }

        const result = await dispatch(LoggedAxios({ method: method, endpoint: endpoint, params: {}, payloads: payloads }))
            .then((resp) => {
                return resp.payload
            }, (error) => {
                if (error.response) {
                }
                return error.response.payload
            })
        const { data, errors } = result
        if (data && data?.responseCode == '000') {
            router.push(`/pinjam/`)
            dispatch(success(data.responseMessage))
        } else {
            if (errors) { 
                let newErrors = {}

                Object.keys(errors).map((key) => {
                    if (key.indexOf('list') >= 0) {
                        const splitKey = key.split("-")
                        const addedKey = [splitKey[0], list[splitKey[1]].instrumen, splitKey[2]].join("-")
                        newErrors = {
                            ...newErrors,
                            [addedKey]: errors[key]
                        }
                    } else {
                        newErrors = {
                            ...newErrors,
                            [key]: errors[key]
                        }
                    }
                })

                setState((prevState) => ({
                    ...prevState,
                    errors: newErrors
                }))

            } else {
                dispatch(error(result.responseMessage))
            }
            

        }
        setSubmitting(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        submit();
    }

    const handleChangeAmt = (id, ptgs) => (e) => {

        let { name, value } = e.target
        let lastState = { ...listAmt }
        if (ptgs) {
            name = `amt_${ptgs}`
        } else {
            name = 'amt'
        }
        lastState[id] = {
            ...lastState[id],
            [name]: parseInt(value)
        }
        setListAmt({ ...lastState })

        CalcuTotalCL([])
    }

    const handleChangeNaList = (id) => (e) => {
        const lastList = [...naList]
        let idx = lastList.indexOf(id)
        if (idx >= 0) {
            lastList.splice(idx)
        } else {
            lastList.push(id)
        }
        setNaList(lastList)
    }

    const handleChangeSetNama = (id) => (e) => {
        const { name, value } = e.target
        let idx = -1
        let lastState = [...instrumen]
        lastState.map((v, k) => {
            if (v.id === id) {
                idx = k
            }
        })
        lastState[idx].set_nama = value
        setState((prevState) => ({
            ...prevState,
            list: lastState
        }))
        CalcuTotalCL(lastState)
    }

    const [totalCekList, setTotalCekList] = useState(0)
    const CalcuTotalCL = async (instrumen) => {
        let totalCL = 0
        await Promise.all(
            instrumen.map((v, k) => {
                if (v.flag === 'list') {
                    totalCL += (v.amt * 1)
                }
            })
        )
        setTotalCekList(totalCL)
        return totalCL

    }
    useEffect(() => {
        if (instrumen) {
            CalcuTotalCL(instrumen)
        }
    }, [instrumen])

    const [loading, setLoading] = useState(false)
    const [ruangan, setRuangan] = useState([])
    const loadRuangan = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/ruangan`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setRuangan(data.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadRuangan()
    }, [])

    const [showModalSet, setShowModalSet] = useState(false)
    const handleOpenModalSet = async (id) => {
        setShowModalSet(true)
        await loadSetInstrumen(id)
    }

    const [instrumenSet, setInstrumenSet] = useState([])
    const loadSetInstrumen = async (id) => {
        setLoading(true)
        const new_id = id.toString().replace("set-", "")
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen/set/${new_id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setInstrumenSet(data.data)
        }
        setLoading(false)
    }

    const loadModelInstrumenSet = async (id) => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen/set/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setLoading(false)
            return (data.data)
        }
        setLoading(false)
        return []
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

    const handleAutoFill = () => {
        const lastState = { ...listAmt }
        if (action !== 'setting') {
            Object.keys(lastState).map((key) => {
                switch (model.pinjam?.status) {
                    case 2:
                        lastState[key]['amt_a1'] = lastState[key]['amt'] * 1
                        break;
                    case 3:
                        lastState[key]['amt_b1'] = lastState[key]['amt_a1'] * 1
                        break;
                    case 4:
                        lastState[key]['amt_b2'] = lastState[key]['amt_b1'] * 1
                        break;
                    case 5:
                        lastState[key]['amt_a2'] = lastState[key]['amt_b2'] * 1
                        break;
                    default:
                        break;
                }
            })
        } else {
            Object.keys(lastState).map((key) => {
                lastState[key]['amt_sett'] = lastState[key]['amt_a2'] * 1
            })
        }

        setListAmt(lastState)
    }

    const handleDeleteIruFromList = async (id) => {
        const explode = id.split("-")
        console.log(explode)
        const lastInstrumen = [...instrumen]
        let foundIdx = -1
        await Promise.all(
            lastInstrumen.map((v, k) => {
                if (explode[0] === 'pcs') {
                    if ((v.jenis === 'pcs') && (v.id === (explode[1] * 1))) {
                        foundIdx = k
                    }
                } else {
                    if ((v.jenis === 'set') && (v.set_list.id === (explode[1] * 1))) {
                        foundIdx = k
                    }
                }
            })
        )
        if (foundIdx >= 0) {
            lastInstrumen.splice(foundIdx, 1)
        }
        setInstrumen(lastInstrumen)
    }

    return (
        <>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="rounded-lg bg-white p-4">
                    <h3 className="font-bold text-xl mb-3">Form Input</h3>
                    <div className="flex flex-col gap-2">
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-3/12">Jenis Pinjam</label>
                            <div className="flex flex-row gap-3 items-center">
                                {
                                    state.input.jenis_pj === 'IRU' && <button type="button" className={"px-4 py-1 rounded-lg border border-blue-400 bg-blue-400 text-white"}>Instrumental</button>
                                }
                                {
                                    state.input.jenis_pj === 'AHP' && <button type="button" className={"px-4 py-1 rounded-lg border border-orange-400 bg-orange-400 text-white"}>AHP & Linen</button>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-3/12">Tanggal Pakai</label>
                            <Datepicker className="lg:w-4/12" value={state.input.dt_pakai} onChange={(e) => {
                                handleChange({ target: { name: 'dt_pakai', value: e } })
                            }} placeholder="Pilih tanggal" defaultValue={new Date()} name="dt_pakai" />
                            {
                                state.errors.dt_pakai && <div className="text-red-500 block">
                                    {state.errors.dt_pakai}
                                </div>
                            }
                        </div>
                        {
                            state.input.jenis_pj === 'IRU' && <>
                                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                    <label className="lg:w-3/12">Ruangan</label>
                                    <select className={["lg:w-4/12 py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.ruang_id) ? "border-red-800" : "border-gray-200"].join(" ")} name="ruang_id" type="text" onChange={handleChange} value={state.input.ruang_id}>
                                        <option value="">- pilih -</option>
                                        {
                                            ruangan.map((v, k) => {
                                                return <option key={k} value={v.id}>{v.nama} - {v.institusi_nama}</option>
                                            })
                                        }
                                    </select>
                                    {
                                        state.errors.ruang_id && <div className="text-red-500 block">
                                            {state.errors.ruang_id}
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                    <label className="lg:w-3/12">Kamar</label>
                                    <input className={["lg:w-4/12 py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.kamar) ? "border-red-800" : "border-gray-200"].join(" ")} name="kamar" type="text" onChange={handleChange} value={state.input.kamar} />
                                    {
                                        state.errors.kamar && <div className="text-red-500 block">
                                            {state.errors.kamar}
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                    <label className="lg:w-3/12">Nomor</label>
                                    <input className={["lg:w-1/12 py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.nomor) ? "border-red-800" : "border-gray-200"].join(" ")} name="nomor" type="text" onChange={handleChange} value={state.input.nomor} />
                                    {
                                        state.errors.nomor && <div className="text-red-500 block">
                                            {state.errors.nomor}
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                    <label className="lg:w-3/12">Nama Pasien</label>
                                    <input className={["lg:w-4/12 py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.pasien) ? "border-red-800" : "border-gray-200"].join(" ")} name="pasien" type="text" onChange={handleChange} value={state.input.pasien} />
                                    {
                                        state.errors.pasien && <div className="text-red-500 block">
                                            {state.errors.pasien}
                                        </div>
                                    }
                                </div>
                            </>
                        }
                    </div>
                </div>
                <div className="rounded-lg bg-white p-4">
                    <div className="flex flex-row justify-between items-center mb-1">
                        <h3 className="font-bold text-xl mb-3">Daftar Instrumen</h3>
                    </div>
                    <PinjamFormIruPacking action={action} model={model} instrumen={instrumen} handleDeleteIruFromList={handleDeleteIruFromList} listAmt={listAmt} state={state} totalCekList={totalCekList} handleChangeAmt={handleChangeAmt} handleCheckItem={handleCheckItem} handleChangeSetNama={handleChangeSetNama} naList={naList} handleChangeNaList={handleChangeNaList} />
                </div>

                {
                    ((model?.pinjam?.trans_kode)) && <div className="">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                <label className="font-bold">Petugas A1</label>
                                <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.a1) ? "border-red-800" : "border-gray-200"].join(" ")} name="a1" type="text" onChange={handleChange} value={state.input.a1} readOnly />
                                {
                                    state.errors.a1 && <div className="text-red-500 block">
                                        {state.errors.a1}
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                <label className="font-bold">Petugas B1</label>
                                <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.b1) ? "border-red-800" : "border-gray-200"].join(" ")} name="b1" type="text" onChange={handleChange} value={state.input.b1} readOnly />
                                {
                                    state.errors.b1 && <div className="text-red-500 block">
                                        {state.errors.b1}
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                <label className="font-bold">Petugas B2</label>
                                <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.b2) ? "border-red-800" : "border-gray-200"].join(" ")} name="b2" type="text" onChange={handleChange} value={state.input.b2} readOnly />
                                {
                                    state.errors.b2 && <div className="text-red-500 block">
                                        {state.errors.b2}
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                <label className="font-bold">Petugas A2</label>
                                <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.a2) ? "border-red-800" : "border-gray-200"].join(" ")} name="a2" type="text" onChange={handleChange} value={state.input.a2} readOnly />
                                {
                                    state.errors.a2 && <div className="text-red-500 block">
                                        {state.errors.a2}
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                }
                <div className="sticky bottom-0 bg-gray-100 py-4 px-2">
                    <div className="flex flex-col gap-2">
                        <div className="lg:hidden">
                            {
                                (Object.keys(state.errors).length > 0) && <div className="text-red-500 block text-center">
                                    Invalid input
                                </div>
                            }
                        </div>
                        <div className="flex flex-col lg:flex-row lg:justify-between gap-2 items-center">
                            <button type="submit" className="rounded-full py-2 px-4 bg-blue-800 text-white flex gap-3 items-center icon-spin" disabled={submitting} onClick={handleSubmit}>
                                {
                                    submitting ? <><FaSpinner className="icon-spin" /> Submitting...</>
                                        : <><span><HiSave /></span>
                                            {
                                                (model?.pinjam?.status === 2) ? 'Set Sudah Dipacking'
                                                    : (action === 'new') ? 'Ajukan Peminjaman' : 'Simpan'
                                            }
                                        </>
                                }
                            </button>
                            <button type="button" className="rounded-full py-2 px-4 bg-yellow-800 text-white flex gap-3 items-center icon-spin" disabled={submitting} onClick={() => handleAutoFill()}>
                                <FaCheckDouble />
                                Auto Fill
                            </button>

                        </div>
                    </div>
                </div>
            </form >
        </>

    )
}