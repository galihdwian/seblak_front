'use client'

import { CalcuDuration, StripEmpty } from "@/app/_bekaya/BekayaHelper";
import { LabelStatusCleaning } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import dayjs from "dayjs";
import { Label, Modal, ModalBody, ModalHeader, Select, TextInput } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiBeaker, HiCheck, HiSave, HiSearch } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function CleaningView() {

    const router = useRouter()
    const { id } = router.query

    const dispatch = useDispatch()

    const [state, setState] = useState({
        input: { receiver: '', time_receive: new Date().toDateString(), status: '' },
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)

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

    const [model, setModel] = useState([])
    const [modelPinjam, setModelPinjam] = useState([])
    const [retModel, setRetModel] = useState({})
    const [loading, setLoading] = useState(false)

    const loadModel = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/cleaning/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setModel(data.data.cleaning)
            // const pinjam = await loadPinjam(data.data.cleaning?.pj_trans_kode);
            // if (pinjam) {
            //     setModelPinjam(pinjam)
            // }
            document.title = `Detail Pencucian ${data.data.cleaning?.trans_kode}`
        }
        setLoading(false)
    }

    const loadPinjam = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/pinjam/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            return data.data
        }
        return false
    }

    useEffect(() => {
        loadModel()
    }, [id])

    const [openModel, setOpenModal] = useState(false)

    const setOpenModalStatus = async (status) => {
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                status: status
            }
        }))
        loadMesin()
    }

    const setCloseModalStatus = () => {
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                status: ''
            }
        }))
        setOpenModal(false)
    }

    useEffect(() => {
        if (state.input.status) {
            setOpenModal(true)
        }
    }, [state.input.status])

    const submitStatus = async () => {
        setSubmitting(true)
        const payload = {
            mesin: state.input.mesin,
            clean_man: state.input.clean_man,
            start_time: state.input.start_time,
            end_time: state.input.end_time,
            status: state.input.status
        }
        const result = await dispatch(LoggedAxios({ method: 'put', endpoint: `/cleaning/status/${id}`, params: {}, payloads: payload }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            await loadModel()
            setCloseModalStatus()
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

    const handleSubmitDiterima = async () => {
        await submitStatus();
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

    return (
        <>

            <Modal show={openModel} size="md" onClose={() => setCloseModalStatus()} popup>
                <ModalHeader />
                <ModalBody>
                    {
                        (model.status === 0) && <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Cleaning</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="mesin">Mesin Pencucian</Label>
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
                                    <Label htmlFor="receiver">Waktu start mencuci</Label>
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
                            <div className="w-full">
                                {
                                    submitting ? <button type="button" className="rounded-xl bg-violet-300 text-white px-4 py-2 items-center flex flex-row gap-2" disabled><HiBeaker style={{ display: 'inline' }} /> Submitting...</button>
                                        : <button onClick={() => handleSubmitDiterima()} type="button" className="rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2"><HiSave style={{ display: 'inline' }} /> Update</button>
                                }

                            </div>
                        </div>
                    }
                    {
                        (model.status === 1) && <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Selesai Mencuci</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="receiver">Waktu selesai mencuci</Label>
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
                            <div className="w-full">
                                {
                                    submitting ? <button type="button" className="rounded-xl bg-violet-300 text-white px-4 py-2 items-center flex flex-row gap-2" disabled><HiBeaker style={{ display: 'inline' }} /> Submitting...</button>
                                        : <button onClick={() => handleSubmitDiterima()} type="button" className="rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2"><HiSave style={{ display: 'inline' }} /> Update</button>
                                }

                            </div>
                        </div>
                    }

                </ModalBody>
            </Modal>

            <Head>
                <title>Detail Peminjaman {model.pinjam?.trans_kode}</title>
            </Head>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-row justify-between items-center min-h-10">
                        <h1 className="font-bold text-2xl">Detail Pencucian {model.trans_kode}</h1>
                        <LabelStatusCleaning status={model.status} />
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-4">

                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row justify-end">
                            {
                                model.status === 0 && <button onClick={() => setOpenModalStatus(1)} className="rounded-xl bg-blue-600 text-white px-4 py-2 items-center flex flex-row gap-2"><HiCheck /> Mulai Pencucian</button>
                            }
                            {
                                model.status === 1 && <button onClick={() => setOpenModalStatus(2)} className="rounded-xl bg-blue-600 text-white px-4 py-2 items-center flex flex-row gap-2"><HiCheck /> Set Selesai Pencucian</button>
                            }
                        </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4" >
                        <div className="rounded-xl bg-white p-4 flex flex-col gap-1">
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Nama Instrumen</label>
                                <span className="font-bold">{model.iru_nama}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Mesin</label>
                                <span><StripEmpty value={model.msn_nama} /> (<StripEmpty value={model.msn_no} />)</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Waktu Mulai Pencucian</label>
                                <span><StripEmpty value={model.start} type="datetime" format="DD MMMM YYYY HH:mm" /></span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Waktu Akhir Pencucian</label>
                                <span><StripEmpty value={model.end} type="datetime" format="DD MMMM YYYY HH:mm" /></span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Durasi</label>
                                <span>{CalcuDuration({ start: model.start, end: model.end, format: 'HH [menit] : m [detik]' })}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Petugas Pencuci</label>
                                <span><StripEmpty value={model.clean_man} /></span>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white p-4  flex flex-col gap-1">
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Kode Pinjam</label>
                                <span><Link href={{
                                    pathname: `/pinjam/view`,
                                    query: { id: model.pj_trans_kode }
                                }} className="text-blue-600 flex gap-1 items-center" target="_blank">{model.pj_trans_kode} <HiSearch /></Link></span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Tanggal Pakai</label>
                                <span>{dayjs(model.pj_tgl).format('DD MMMM YYYY')}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Ruangan</label>
                                <span>{model.pj_ruang_nama} - {model.pj_institusi_nama}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Kamar</label>
                                <span>{model.pj_kamar}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Nomor</label>
                                <span><StripEmpty value={model.pj_nomor} /></span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Pasien</label>
                                <span><StripEmpty value={model.pj_pasien} /></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>

    )
}