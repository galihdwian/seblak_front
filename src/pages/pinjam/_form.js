'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import { success } from "@/lib/store/features/messageSlice"
import dayjs from "dayjs"
import { Datepicker, Modal, ModalBody, ModalFooter, ModalHeader } from "flowbite-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { FaSpinner } from "react-icons/fa6"
import { HiPlus, HiSave, HiTrash } from "react-icons/hi"
import { useDispatch } from "react-redux"
import PinjamFormIruNew from "./_form_daftar_iru_new"
import PinjamFormIruPacking from "./_form_daftar_iru_packing"

export default function PinjamForm(props) {

    const { id, model, action } = props
    const router = useRouter();
    const [state, setState] = useState({
        input: {
            id: '',
            jenis_pj: 'IRU',
            dt_pakai: new Date(),
            ruang_id: '',
            kamar: '',
            nomor: '',
            pasien: '',
            a1: '',
            receiver: '',
            items: [],
            filter_list: '',
            filter_pick: '',
            jenis: ''
        },
        list: [],
        pick: [],
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)
    const [instrumen, setInstrumen] = useState([])

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
        }
    }, [model])

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

        let list = [...instrumen].filter((v) => (v.flag === 'list')).map((v, k) => {
            return {
                instrumen: v.id,
                amt: v.amt,
                nama: v.nama,
                set_nama: v.set_nama,
            }
        })
        payloads.list = list

        let method = state.input.id ? 'PUT' : 'POST'
        let endpoint = `/pinjam/request`

        if (action !== 'new') {
            endpoint = `/pinjam/packing`
            method = `put`
        }

        const result = await dispatch(LoggedAxios({ method: method, endpoint: endpoint, params: {}, payloads: payloads }))
            .then((resp) => {
                return resp.payload
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data && data?.responseCode == '000') {
            if (method === 'POST') {
            } else {
            }
            router.push(`/pinjam/`)
            dispatch(success(data.responseMessage))
        } else {

            console.log(result)

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

    const handleChangeAmt = (id, ptgs) => (e) => {
        const { name, value } = e.target
        let idx = -1
        let lastState = [...instrumen]
        lastState.map((v, k) => {
            if (v.id === id) {
                idx = k
            }
        })
        if (ptgs) {
            lastState[idx][`amt_${ptgs}`] = value
        } else {
            lastState[idx].amt = value
        }
        setState((prevState) => ({
            ...prevState,
            list: lastState
        }))
        CalcuTotalCL(lastState)
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
        loadInstrumen()
    }, [])

    const [kamars, setKamars] = useState([])
    const loadKamarRuangan = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/ruangan/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            const { metadata } = data.data.ruangan
            if (metadata.kamar) {
                setKamars(metadata.kamar)
            }
        }

    }

    useEffect(() => {
        loadRuangan()
        loadInstrumen()
    }, [])

    const [selectedRuangan, setSelectedRuangan] = useState({})
    useEffect(() => {
        if (state.input.ruang_id) {
            ruangan.forEach((v) => {
                if (v.id.toString() === state.input.ruang_id) {
                    setSelectedRuangan({ ...v })
                }
            })
        }
    }, [state.input.ruang_id])

    useEffect(() => {
        if (selectedRuangan) {
            loadKamarRuangan(state.input.ruang_id)
        }
    }, [selectedRuangan])

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

    const handlePickInstrumenList = (id) => async (e) => {
        e.preventDefault();
        const data = await loadModelInstrumenSet(id)
        const newData = [...instrumen]

        newData.map((v, k) => {
            data.list.map((vv, kk) => {
                if (v.id === vv.id) {
                    newData[k].flag = 'list'
                    newData[k].amt = vv.amt
                }
            })
        })

        setInstrumen(newData)
        setShowModalSet(false)
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

    const [showModalCariItems, setShowModalCariItems] = useState(false)
    const handleOpenModalCariItems = async (e) => {
        e.preventDefault()
        setShowModalCariItems(true)
    }

    const loadInstrumen = async () => {
        setLoading(true)
        if (model?.pinjam?.trans_kode) {
            let newData = []
            model.detail.map((v, k) => {
                let item = { ...v }
                item.flag = 'list'
                item.amt = 0
                newData.push(item)
            })
            setInstrumen(newData)
        } else {
            let params = { action: 'new' }

            if (action === 'packing') {
                params = { action: 'packing' }
            }

            const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen`, params: params, payloads: {} }))
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
                    setState((prevState) => ({
                        ...prevState,
                        input: {
                            ...prevState.input,
                            ...model.set
                        }
                    }))
                }

                setInstrumen(newData)
            }
        }


        setLoading(false)
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
        setShowModalCariItems(close)
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

    const handleAutoFill = () => {
        const lastState = [...instrumen]
        lastState
            .map((v, k) => {
                if (v.flag === 'list') {
                    lastState[k]['amt'] = 1
                }
            })
        setInstrumen([...lastState])
    }

    return (
        <>
            <Modal show={showModalSet} popup onClose={() => setShowModalSet(false)} size="md">
                <ModalHeader>
                    Instrumen List : {instrumenSet.set?.nama}
                </ModalHeader>
                <ModalBody>
                    {
                        loading ? <>
                            <span>loading data...</span>
                        </> : <div className="flex flex-col gap-3">
                            <div className="max-h-[400px] overflow-auto">
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-y">
                                            <th className="px-1 py-1">Nama</th>
                                            <th className="px-1 py-1">No Katalog</th>
                                            <th className="px-1 py-1">Brand</th>
                                            <th className="px-1 py-1 text-end">Jumlah</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            instrumenSet?.list?.map((v, k) => {
                                                return <tr className="border-y" key={k}>
                                                    <td className="px-1 py-1">{v.nama}</td>
                                                    <td className="px-1 py-1">{v.no_katalog}</td>
                                                    <td className="px-1 py-1">{v.brand}</td>
                                                    <td className="px-1 py-1 text-end">{v.amt}</td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>

                            </div>

                        </div>
                    }
                </ModalBody>
            </Modal>
            <Modal show={showModalCariItems} popup onClose={() => setShowModalCariItems(false)}>
                <ModalHeader>
                    <div className="p-2 font-bold">Tambahkan Items</div>
                </ModalHeader>
                <ModalBody>
                    {
                        loading ? <>
                            <span>loading data...</span>
                        </> : <div className="flex flex-col gap-3">
                            {
                                <div className="flex flex-col gap-2 max-h-[400px] overflow-auto p-2">
                                    <div className="flex flex-row gap-2 my-2">
                                        <select className="p-2 border rounded-lg bg-white" name="jenis" onChange={handleChange} value={state.input.jenis}>
                                            <option value={''}>- jenis -</option>
                                            {
                                                state.input.jenis_pj === 'AHP' ? <>
                                                    <option value={'pack'}>Pack</option>
                                                </> : <>
                                                    <option value={'pcs'}>Pcs</option>
                                                    <option value={'set'}>Set</option>
                                                </>
                                            }
                                        </select>
                                        <input className="p-2 border rounded-lg bg-white grow" placeholder="cari item..." type="text" name="filter_pick" value={state.input.filter_pick} onChange={handleChange} />
                                    </div>
                                    <div className="max-h-[400px] overflow-auto">
                                        <table className="w-full text-xs">
                                            <thead>
                                                <tr className="border-y">
                                                    <th className="px-1 py-1 w-[20px]">#</th>
                                                    <th className="px-1 py-1">Nama</th>
                                                    <th className="px-1 py-1">Jenis</th>
                                                    <th className="px-1 py-1">No Katalog</th>
                                                    <th className="px-1 py-1">Brand</th>
                                                    <th className="px-1 py-1">Expired Date</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {
                                                    instrumen
                                                        .filter((v) => (v.flag === 'pick'))
                                                        .filter((v) => {
                                                            if (state.input.jenis_pj === 'AHP') {
                                                                return ((v.jenis + "").toLowerCase().indexOf('pack') >= 0)
                                                            } else {
                                                                return ((v.jenis + "").toLowerCase().indexOf('pcs') >= 0)
                                                                    || ((v.jenis + "").toLowerCase().indexOf('set') >= 0)
                                                            }
                                                        })
                                                        .filter((v) => {
                                                            return ((v.jenis + "").toLowerCase().indexOf(state.input.jenis.toLowerCase()) >= 0)
                                                        })
                                                        .filter((v) => {
                                                            return ((v.nama + "").toLowerCase().indexOf(state.input.filter_pick.toString().toLowerCase()) >= 0)
                                                                || ((v.no_katalog + "").toLowerCase().indexOf(state.input.filter_pick.toString().toLowerCase()) >= 0)
                                                                || ((v.brand + "").toLowerCase().indexOf(state.input.filter_pick.toString().toLowerCase()) >= 0)
                                                        })
                                                        .map((v, k) => {
                                                            return <tr className="border-y" key={k}>
                                                                <td className="px-1 py-1 text-center"><input type="checkbox" name="chk_pick" onChange={handleCheckItem('pick', v.id)} /></td>
                                                                <td className="px-1 py-1">{v.nama}</td>
                                                                <td className="px-1 py-1">{v.jenis}</td>
                                                                <td className="px-1 py-1">{v.no_katalog}</td>
                                                                <td className="px-1 py-1">{v.brand}</td>
                                                                <td className="px-1 py-1">{v.tgl_expired ? dayjs(v.tgl_expired).format('DD-MM-YYYY HH:mm') : '-'}</td>
                                                            </tr>
                                                        })
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            }
                        </div>
                    }
                </ModalBody>
                <ModalFooter>
                    <div className="flex flex-row gap-2 justify-end">
                        <button className="px-3 py-2 bg-blue-700 text-white rounded-xl" type="button" onClick={() => handleAdd()}><HiPlus style={{ display: 'inline' }} />Tambahkan</button>
                        <button className="px-3 py-2 bg-red-500 text-white rounded-xl" type="button" onClick={() => setShowModalCariItems(false)}>Batal</button>
                    </div>

                </ModalFooter>
            </Modal>
            <form onSubmit={handleSubmit}>
                <div className="flex flex-col gap-4 p-4">
                    <div className="rounded-lg bg-white p-4">
                        <h3 className="font-bold text-xl mb-3">Form Input</h3>
                        <div className="flex flex-col gap-2">
                            <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-3/12">Jenis Pinjam</label>
                                <div className="flex flex-row gap-3 items-center">
                                    <button type="button" onClick={() => {
                                        handleChange({
                                            target: {
                                                name: 'jenis_pj',
                                                value: 'IRU'
                                            }
                                        })
                                    }} className={["px-4 py-1 rounded-lg", (state.input.jenis_pj === 'IRU') ? 'border border-blue-600 bg-blue-600 text-white' : 'border border-blue-200 text-blue-200'].join(" ")}>Instrumen</button>
                                    <button type="button" onClick={() => {
                                        handleChange({
                                            target: {
                                                name: 'jenis_pj',
                                                value: 'AHP'
                                            }
                                        })
                                    }} className={["px-4 py-1 rounded-lg", (state.input.jenis_pj === 'AHP') ? 'border border-orange-600 bg-orange-600 text-white' : 'border border-orange-200 text-orange-200'].join(" ")}>AHP & Linen</button>
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
                                <select className={["lg:w-4/12 py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.kamar) ? "border-red-800" : "border-gray-200"].join(" ")} name="kamar" type="text" onChange={handleChange} value={state.input.kamar}>
                                    <option value="">- pilih -</option>
                                    {
                                        kamars.map((v) => {
                                            return <option key={v} value={v}>{v}</option>
                                        })
                                    }
                                </select>
                                {/* <input className={["lg:w-4/12 py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.kamar) ? "border-red-800" : "border-gray-200"].join(" ")} name="kamar" type="text" onChange={handleChange} value={state.input.kamar} /> */}
                                {
                                    state.errors.kamar && <div className="text-red-500 block">
                                        {state.errors.kamar}
                                    </div>
                                }
                            </div>
                            {
                                ((selectedRuangan?.pinjam_form_full) && (state.input.jenis_pj === 'IRU')) && <>

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
                    {
                        state.input.jenis_pj && <>
                            <div className="rounded-lg bg-white p-4">
                                <div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center mb-1">
                                    <h3 className="font-bold text-xl mb-3">Daftar Instrumen</h3>
                                    {
                                        (action === 'new') && <div className="flex gap-2">
                                            <button onClick={handleOpenModalCariItems} type="button" className="text-sm rounded-full bg-green-500 text-white border-gray-400 py-1 px-2"><HiPlus style={{ display: 'inline' }} /> Add Instrumen</button>
                                        </div>
                                    }
                                </div>
                                {
                                    (action === 'new') && <>
                                        <div className="flex flex-row gap-3 mb-2">
                                            <button className="bg-red-500 text-white text-sm  py-1 px-2 rounded-full flex gap-2 items-center" onClick={() => handleRem()} type="button"><HiTrash /> Hapus Instrumen</button>
                                        </div>
                                        <PinjamFormIruNew action={action} model={model} instrumen={instrumen} state={state} totalCekList={totalCekList} handleChangeAmt={handleChangeAmt} handleCheckItem={handleCheckItem} handleChangeSetNama={handleChangeSetNama} handleOpenModalSet={handleOpenModalSet} handleAutoFill={handleAutoFill} />
                                    </>
                                }
                                {
                                    (action !== 'new') && <>
                                        <PinjamFormIruPacking action={action} model={model} instrumen={instrumen} state={state} totalCekList={totalCekList} handleChangeAmt={handleChangeAmt} handleCheckItem={handleCheckItem} handleChangeSetNama={handleChangeSetNama} />
                                    </>
                                }


                            </div>

                            {
                                ((model?.pinjam?.trans_kode)) && <div className="">
                                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                        <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                            <label className="font-bold">Petugas A1</label>
                                            <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.a1) ? "border-red-800" : "border-gray-200"].join(" ")} name="a1" type="text" onChange={handleChange} value={state.input.a1} />
                                            {
                                                state.errors.a1 && <div className="text-red-500 block">
                                                    {state.errors.a1}
                                                </div>
                                            }
                                        </div>
                                        <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                            <label className="font-bold">Petugas B1</label>
                                            <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.b1) ? "border-red-800" : "border-gray-200"].join(" ")} name="b1" type="text" onChange={handleChange} value={state.input.b1} />
                                            {
                                                state.errors.b1 && <div className="text-red-500 block">
                                                    {state.errors.b1}
                                                </div>
                                            }
                                        </div>
                                        <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                            <label className="font-bold">Petugas B2</label>
                                            <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.b2) ? "border-red-800" : "border-gray-200"].join(" ")} name="b2" type="text" onChange={handleChange} value={state.input.b2} />
                                            {
                                                state.errors.b2 && <div className="text-red-500 block">
                                                    {state.errors.b2}
                                                </div>
                                            }
                                        </div>
                                        <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                            <label className="font-bold">Petugas A2</label>
                                            <input className={["py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4", (state.errors.a2) ? "border-red-800" : "border-gray-200"].join(" ")} name="a2" type="text" onChange={handleChange} value={state.input.a2} />
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
                                    <div>
                                        <button type="submit" className="rounded-full py-2 px-4 bg-blue-800 text-white flex gap-3 items-center icon-spin" disabled={submitting}>
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
                                    </div>
                                    {
                                        state.errors.length > 0 && <div className="text-red-500">
                                            Perbaiki Inputan
                                        </div>
                                    }
                                </div>
                            </div>

                        </>
                    }
                </div>
            </form >
        </>

    )
}