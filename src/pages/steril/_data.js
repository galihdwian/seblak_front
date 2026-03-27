'use client'
import { CalcuDuration, StripEmpty } from "@/app/_bekaya/BekayaHelper";
import { LabelStatusSteril } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import { error, success } from "@/lib/store/features/messageSlice";
import { Label, Modal, ModalBody, ModalHeader, Select, TextInput } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck, FaFileExcel, FaFilter } from "react-icons/fa6";
import { HiBeaker, HiSave, HiSearch } from "react-icons/hi";
import { useDispatch } from "react-redux";


export default function SterilData(props) {
    const { show } = props

    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const handelSearch = (e) => {
        e.preventDefault()
        loadData()
    }

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/steril`, params: { show: show, key: state.input.key }, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setDatas(data.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
        loadMesin()
    }, [])



    const [state, setState] = useState({
        input: {},
        errors: {}
    })

    const handleOpenModalStart = (id) => {
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                selected_id: id,
            }
        }))
        setOpenModal(true)
    }

    const handleOpenModalEnd = (id) => {
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                selected_id: id,
            }
        }))
        setOpenModal(true)
    }

    const handleOpenModalStart_Multiple = () => {
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                multiple_id: checkedList,
                action: 'start',
            }
        }))
        setOpenModal(true)
    }

    const handleOpenModalEnd_Multiple = () => {
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                multiple_id: checkedList,
                action: 'end',
            }
        }))
        setOpenModal(true)
    }

    const [openModal, setOpenModal] = useState(false)

    const handleCloseModal = () => {
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                multiple_id: [],
                selected_id: '',
                action: 'start',
            }
        }))
        setCheckedList([])
        setOpenModal(false)
    }

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

    const handleSubmitStart = async (e) => {
        e.preventDefault();
        submitStart();
    }

    const submitStart = async () => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        let ids = []
        if (state.input?.multiple_id?.length) {
            ids = [...state.input.multiple_id]
        } else {
            ids.push(state.input.selected_id)
        }

        let payloads = {}

        if (state.input.action === 'start') {
            payloads = {
                id: ids,
                mesin: state.input.mesin,
                start_time: state.input.start_time,
                status: 1,
            }
        } else {
            payloads = {
                id: ids,
                end_time: state.input.end_time,
                status: 2
            }
        }
        const method = 'PUT'

        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/steril`, params: {}, payloads: payloads }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data && data?.responseCode == '000') {
            dispatch(success(data.responseMessage))
            setOpenModal(false)
            loadData()
            setCheckedList([])
            setState((prevState) => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    selected_id: '',
                    multiple_id: [],
                }
            }))
        } else {
            if (errors) {
                setState((prevState) => ({
                    ...prevState,
                    errors: errors
                }))
                dispatch(error(result.responseMessage))
            }
        }
        setSubmitting(false)
    }

    const [mesins, setMesins] = useState([])
    const loadMesin = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/mesin`, params: { status: '1' }, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setMesins(data.data)
        } else {
            setMesins([])
        }
    }

    const [checkedList, setCheckedList] = useState([])
    const [checkedFilter, setCheckedFilter] = useState('')


    useEffect(() => {
        if (checkedList?.length) {
            datas.map((v, k) => {
                if (v.id === checkedList[0]) {
                    setCheckedFilter(v.status)
                }
            })
        }
    }, [checkedList])

    useEffect(() => {
        if (datas.length) {

        }
    }, [datas])

    const handleChangeChkAll = (e) => {
        const { name, checked } = e.target
        let newList = []
        if (checked) {
            datas.map((v) => {
                newList.push(v.id)
            })
        }
        setCheckedList(newList)
    }

    const handleChangeChkItem = (k) => (e) => {
        const { name, checked } = e.target
        let newList = [...checkedList]
        if (checked) {
            newList.push(k)
        } else {
            const idx = newList.indexOf(k)
            if (idx >= 0) {
                newList.splice(idx, 1)
            }
        }
        setCheckedList(newList)
    }

    const [openModalExport, setOpenModalExport] = useState(false)
    const handleCloseModalExport = () => {
        setOpenModalExport(false)
    }

    const handleSubmitExport = async (e) => {
        e.preventDefault();
        submitExport();
    }

    const submitExport = async () => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        let payloads = {}
        payloads = {
            mesin: state.input.mesin,
            dt1: state.input.dt1,
            dt2: state.input.dt2,
        }
        const method = 'POST'

        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/steril/export`, params: {}, payloads: payloads, config: { responseType: 'blob' } }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })

        if (result.status === 200) {
            const contentDisposition = result.headers['content-disposition'];
            let filename = 'data-export.xlsx'; // Fallback

            if (contentDisposition) {
                const fileNameMatch = contentDisposition.match(/filename="?(.+)"?/);
                if (fileNameMatch && fileNameMatch.length === 2) {
                    filename = fileNameMatch[1];
                }
            }

            const url = window.URL.createObjectURL(new Blob([result.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            setSubmitting(false)
            setOpenModalExport(false)
        } else {
            result.data.text()
                .then((str) => {
                    let errors = JSON.parse(str) 
                    setState((prevState) => ({
                        ...prevState,
                        errors: errors?.errors
                    }))
                })
            setSubmitting(false)
        }


    }

    return (

        <>
            <Head>
                <title>Data Sterilisasi</title>
            </Head>

            <Modal show={openModal} onClose={() => { handleCloseModal() }} size="md">
                <ModalHeader>
                    <div className="text-xl font-medium text-gray-900 dark:text-white">{state.input.action === 'start' ? 'Set Waktu Start' : 'Set Waktu End'}</div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-2">
                        {
                            state.input.action === 'start' && <>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="mesin">Mesin</Label>
                                    </div>
                                    <Select name="mesin" value={state.input.mesin} onChange={handleChange}>
                                        <option value={""}>- pilih mesin -</option>
                                        {
                                            mesins.map((v, k) => {
                                                return <option value={v.id}>{v.nama} {v.nomor}</option>
                                            })
                                        }
                                    </Select>
                                    {
                                        state.errors.mesin && <div className="text-red-500 block">
                                            {state.errors.mesin}
                                        </div>
                                    }
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="receiver">Waktu start sterilisasi</Label>
                                    </div>
                                    <TextInput
                                        id="time"
                                        placeholder="nama penerima"
                                        value={state.input?.start_time}
                                        name="start_time"
                                        type="datetime-local"
                                        onChange={handleChange}
                                        required
                                    />
                                    {
                                        state.errors.start_time && <div className="text-red-500 block">
                                            {state.errors.start_time}
                                        </div>
                                    }
                                </div>
                            </>
                        }
                        {
                            state.input.action !== 'start' && <>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="receiver">Waktu selesai sterilisasi</Label>
                                    </div>
                                    <TextInput
                                        id="time"
                                        placeholder="nama penerima"
                                        value={state.input?.end_time}
                                        name="end_time"
                                        type="datetime-local"
                                        onChange={handleChange}
                                        required
                                    />
                                    {
                                        state.errors.end_time && <div className="text-red-500 block">
                                            {state.errors.end_time}
                                        </div>
                                    }
                                </div>
                                <div>
                                    <div className="mb-2 block">
                                        <Label htmlFor="receiver">Expired Date</Label>
                                    </div>
                                    <TextInput
                                        id="time"
                                        placeholder="nama penerima"
                                        value={state.input?.tgl_expired}
                                        name="tgl_expired"
                                        type="datetime-local"
                                        onChange={handleChange}
                                        required
                                    />
                                    {
                                        state.errors.tgl_expired && <div className="text-red-500 block">
                                            {state.errors.tgl_expired}
                                        </div>
                                    }
                                </div>
                            </>
                        }

                        <div className="w-full">
                            {
                                submitting ? <button type="button" className="rounded-xl bg-violet-300 text-white px-4 py-2 items-center flex flex-row gap-2" disabled><HiBeaker style={{ display: 'inline' }} /> Submitting...</button>
                                    : <button onClick={handleSubmitStart} type="button" className="rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2"><HiSave style={{ display: 'inline' }} /> Mulai</button>
                            }

                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <Modal show={openModalExport} onClose={() => { handleCloseModalExport() }} size="md">
                <ModalHeader>
                    <div className="text-xl font-medium text-gray-900 dark:text-white">Export to Excel</div>
                </ModalHeader>
                <ModalBody>
                    <div className="space-y-2">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="mesin">Mesin Sterilisasi</Label>
                            </div>
                            <Select name="mesin" value={state.input.mesin} onChange={handleChange}>
                                <option value={""}>- pilih mesin -</option>
                                {
                                    mesins.map((v, k) => {
                                        return <option value={v.id}>{v.nama} {v.nomor}</option>
                                    })
                                }
                            </Select>
                            {
                                state.errors.mesin && <div className="text-red-500 block">
                                    {state.errors.mesin}
                                </div>
                            }
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="receiver">Tgl Awal</Label>
                            </div>
                            <TextInput
                                id="time"
                                placeholder="nama penerima"
                                value={state.input?.dt1}
                                name="dt1"
                                type="date"
                                onChange={handleChange}
                                required
                            />
                            {
                                state.errors.dt1 && <div className="text-red-500 block">
                                    {state.errors.dt1}
                                </div>
                            }
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="receiver">Tgl Akhir</Label>
                            </div>
                            <TextInput
                                id="time"
                                placeholder="nama penerima"
                                value={state.input?.dt2}
                                name="dt2"
                                type="date"
                                onChange={handleChange}
                                required
                            />
                            {
                                state.errors.dt2 && <div className="text-red-500 block">
                                    {state.errors.dt2}
                                </div>
                            }
                        </div>


                        <div className="w-full">
                            {
                                submitting ? <button type="button" className="rounded-xl bg-violet-300 text-white px-4 py-2 items-center flex flex-row gap-2" disabled><HiBeaker style={{ display: 'inline' }} /> Submitting...</button>
                                    : <button onClick={handleSubmitExport} type="button" className="rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2"><HiSave style={{ display: 'inline' }} /> Mulai</button>
                            }

                        </div>
                    </div>
                </ModalBody>
            </Modal>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-2xl">Data Sterilisasi</h1>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2" onSubmit={handelSearch}>
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." name="key" value={state.input.key} onChange={handleChange} />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200"><FaFilter /></button>
                        {
                            show === 'all' && <button type="button" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-200" onClick={() => setOpenModalExport(true)}>Export <FaFileExcel className="text-green-700" /></button>
                        }
                    </form>
                    {
                        (checkedList.length && checkedFilter !== 1) ? <div>
                            <button className="bg-blue-500 text-white rounded px-2 py-2 flex gap-1 items-center" onClick={() => handleOpenModalStart_Multiple()}><FaCheck />Mulai Sterilisasi</button>
                        </div> : ''
                    }
                    {
                        (checkedList.length && checkedFilter === 1) ? <div>
                            <button className="bg-emerald-500 text-white rounded px-2 py-2 flex gap-1 items-center" onClick={() => handleOpenModalEnd_Multiple()}><FaCheck />Selesai Sterilisasi</button>
                        </div> : ''
                    }
                    <div className="overflow-auto">

                        <table className="w-100 lg:w-full text-xs">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50"><input type="checkbox" name="chk-all" onChange={handleChangeChkAll} /></th>
                                    <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Trans Kode</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Mesin</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Waktu Proses</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Instrumen</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Jumlah</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Ruangan</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">No Pinjam</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Status</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas
                                        .map((v, k) => {
                                            return <tr className={["border-t border-b text-xs", ((checkedList.indexOf(v.id) >= 0) || (state.input.selected_id === v.id) ? 'bg-yellow-200' : '')].join(" ")} key={k}>
                                                <td className="p-1"><input type="checkbox" name="" onChange={handleChangeChkItem(v.id)} checked={checkedList.indexOf(v.id) >= 0} disabled={checkedList.length && (v.status !== checkedFilter)} /></td>
                                                <td className="p-1">{k + 1}</td>
                                                <td className="p-1">{v.trans_kode}</td>
                                                <td className="p-1">{v.msn_nama}</td>
                                                <td className="p-1">
                                                    <div className="flex flex-col gap-1">
                                                        <span>Mulai: <StripEmpty value={v.start} type="datetime" format="YYYY-MM-DD HH:mm" /></span>
                                                        <span>Selesai: <StripEmpty value={v.end} type="datetime" format="YYYY-MM-DD HH:mm" /> </span>
                                                        <span className="text-orange-500">Durasi: {CalcuDuration({ start: v.start, end: v.end, format: 'H [j] : m [m]' })} </span>
                                                    </div>
                                                </td>
                                                <td className="p-1">{v.iru_nama}</td>
                                                <td className="p-1">{v.iru_jml}</td>
                                                <td className="p-1">
                                                    <div className="flex flex-col gap-1">
                                                        <span>Ruang: {v.ruang_nama} / {v.institusi_nama}</span>
                                                        <span>Kamar: {v.kamar} / {v.no} </span>
                                                    </div>
                                                </td>
                                                <td className="p-1">
                                                    <div className="flex flex-col gap-1">
                                                        <Link href={{
                                                            pathname: `/pinjam/view`,
                                                            query: { id: v.pj_trans_kode }
                                                        }} className="text-blue-600 flex gap-1 items-center" target="_blank">{v.pj_trans_kode} <HiSearch /></Link>
                                                        <span>{v.tgl}</span>
                                                    </div>
                                                </td>
                                                <td className="p-1 px-1">
                                                    <LabelStatusSteril status={v.status} />
                                                </td>
                                                <td className="p-1">
                                                    <div className="flex flex-col gap-2">
                                                        {
                                                            (v.status === 0) && (checkedList.length === 0) && <button className="bg-blue-500 text-white rounded px-2 flex gap-1 items-center" onClick={() => handleOpenModalStart(v.id)}><FaCheck />Mulai Sterilisasi</button>
                                                        }
                                                        <span>
                                                            <Link className="bg-green-500 text-white rounded p-1" href={{
                                                                pathname: `/cleaning/view`,
                                                                query: { id: v.trans_kode }
                                                            }}><HiSearch style={{ display: 'inline' }} /></Link>
                                                        </span>

                                                    </div>

                                                </td>
                                            </tr>
                                        })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}