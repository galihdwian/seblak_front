import { StripEmpty } from "@/app/_bekaya/BekayaHelper";
import { LabelStatusUjibowie } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import { error, success } from "@/lib/store/features/messageSlice";
import { Label, Modal, ModalBody, ModalHeader, TextInput, Select } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCheck, FaFileExcel, FaFilter } from "react-icons/fa6";
import { HiBeaker, HiPlus, HiSave, HiSearch } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function BiologicaltestData(props) {
    const { show } = props
    const [datas, setDatas] = useState([])
    const [loading, setLoading] = useState(false)

    const loadData = async () => {
        setLoading(true)

        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: '/biologicaltest', params: { show: show } }))
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
    }, [])
    const [state, setState] = useState({
        input: {},
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)
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

        const payloads = state.input
        payloads['status'] = 2

        const method = 'PUT'

        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/biologicaltest/status/${state.input.selected_id}`, params: {}, payloads: payloads }))
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
            setOpenModalStatus(false)
            loadData()
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

    const handleSubmitSelesai = async (e) => {
        e.preventDefault();
        submit();
    }

    const handleOpenModalSelesai = (id) => {
        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                selected_id: id,
            }
        }))
        setOpenModalStatus(true)
    }

    const [openModalStatus, setOpenModalStatus] = useState(false)

    const [mesins, setMesins] = useState([])
    const loadMesin = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/mesin`, params: {}, payloads: {} }))
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

    useEffect(() => {
        loadMesin()
    }, [])

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

        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/biologicaltest/export`, params: {}, payloads: payloads, config: { responseType: 'blob' } }))
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

            <Modal show={openModalStatus} onClose={() => { setOpenModalStatus(false) }} size="md">
                <ModalHeader><div className="text-xl font-medium text-gray-900 dark:text-white">Set Sudah Selesai</div></ModalHeader>
                <ModalBody>
                    <div className="space-y-6">
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="receiver">Waktu Selesai</Label>
                            </div>
                            <TextInput
                                id="time"
                                value={state.input?.end}
                                name="end"
                                type="datetime-local"
                                onChange={handleChange}
                                required
                            />
                            {
                                state.errors.end && <div className="text-red-500 block">
                                    {state.errors.end}
                                </div>
                            }
                        </div>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="receiver">Hasil</Label>
                            </div>
                            <select
                                className="w-full py-1 px-2 rounded-xl border placeholder:text-[#A0AEC0] col-span-4"
                                id="result"
                                placeholder="input hasil"
                                value={state.input?.result}
                                name="result"
                                onChange={handleChange}
                                required>
                                <option value={''}>- pilih -</option>
                                <option value={'Negatif'}>Negatif</option>
                                <option value={'Positif'}>Positif</option>
                            </select>
                            {
                                state.errors.result && <div className="text-red-500 block">
                                    {state.errors.result}
                                </div>
                            }
                        </div>
                        <div className="w-full">
                            {
                                submitting ? <button type="button" className="rounded-xl bg-violet-300 text-white px-4 py-2 items-center flex flex-row gap-2" disabled><HiBeaker style={{ display: 'inline' }} /> Submitting...</button>
                                    : <button onClick={handleSubmitSelesai} type="button" className="rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2"><HiSave style={{ display: 'inline' }} /> Update</button>
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


            <Head>
                <title>Data Uji Biological Indicator</title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col sm:flex-row gap-2 sm:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Data Uji Biological Indicator</h1>
                        <div>
                            <Link className="rounded-xl bg-green-800 text-white px-4 py-2 items-center flex flex-row gap-2" href={`/biologicaltest/new`}><span><HiPlus /></span> Tambah</Link>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2">
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200"><FaFilter /></button>
                        {
                            show === 'all' && <button type="button" className="flex items-center gap-1 px-4 py-2 rounded-lg bg-green-200" onClick={() => setOpenModalExport(true)}>Export <FaFileExcel className="text-green-700" /></button>
                        }
                    </form>
                    <div className="overflow-auto">
                        <table className="w-full  text-xs">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Tgl Uji</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Mesin</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Hasil</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Status</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.length ? <>
                                        {
                                            datas.map((v, k) => {
                                                return <tr className="border-t border-b" key={k}>
                                                    <td className="p-1">{k + 1}</td>
                                                    <td className="p-1"><StripEmpty value={v.start} type="datetime" format="DD MMM YYYY HH:mm" /></td>
                                                    <td className="p-1">{v.mesin_nama}-{v.mesin_nomor}</td>
                                                    <td className="p-1">{v.hasil}</td>
                                                    <td className="p-1 px-1"><LabelStatusUjibowie status={v.status} /></td>
                                                    <td className="p-1 flex gap-1">
                                                        {
                                                            (v.status === 1) && <button className="bg-blue-500 text-white rounded px-2 flex gap-1 items-center" onClick={() => handleOpenModalSelesai(v.id)}><FaCheck />Set Selesai</button>
                                                        }
                                                        <Link className="bg-green-500 text-white rounded p-1" href={{
                                                            pathname: `/biologicaltest/view`,
                                                            query: { id: v.id }
                                                        }}><HiSearch style={{ display: 'inline' }} /></Link>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </> : <>
                                        <tr><td colSpan="9" width="100%" className="text-center py-2">- no data -</td></tr>
                                    </>
                                }

                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </>
    )
}