'use client'

import { StripEmpty } from "@/app/_bekaya/BekayaHelper";
import { LabelJenisPinjam, LabelStatusPinjam } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import { useAppSelector } from "@/lib/store/hooks";
import dayjs from "dayjs";
import { Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { HiBadgeCheck, HiBeaker, HiClipboardCheck, HiClock, HiSave, HiShoppingBag, HiTrash } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import TableDetailDefault from "../_table_detail_default";
import TableDetailRequest from "../_table_detail_request";

export default function PinjamView() {

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
    const [loading, setLoading] = useState(false)

    const { userdata } = useAppSelector((state) => state.auth)

    const loadModel = async () => {
        setLoading(true)
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
            setModel(data.data)
            setState((prevState) => ({
                ...prevState,
                input: {
                    receiver: data.data.pinjam.receiver,
                    time_receive: data.data.pinjam.tgl + 'T' + '00:00:00'
                }
            }))

            document.title = 'Detail Peminjaman ' + data.data.pinjam.trans_kode
        }
        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            loadModel()
        }
    }, [id])

    useEffect(() => {
        if (model.detail) {
            CalcuTotalCL()
        }
    }, [model.detail])

    const [totalCekList, setTotalCekList] = useState(0)
    const CalcuTotalCL = async (instrumen) => {
        let totalCL = 0
        if (instrumen) {
            await Promise.all(
                instrumen.map((v, k) => {
                    if (v.flag === 'list') {
                        totalCL += (v.amt * 1)
                    }
                })
            )
        }
        setTotalCekList(totalCL)
        return totalCL

    }

    const submitDelete = async (id) => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'delete', endpoint: `/pinjam/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            loadModel()
        }
        setLoading(false)
        setTimeout(() => {
            showSwal({
                ...swalProps,
                title: 'Info',
                icon: 'info',
                html: data.responseMessage,
                showConfirmButton: true,
            })
        }, 1000);


    }

    const handleDelete = async (id) => {
        showSwal({
            ...swalProps,
            title: 'Please wait',
            html: <div>
                <FaSpinner className="animate-spin mr-2" style={{ display: 'inline' }} />
                Submitting
            </div>,
            showConfirmButton: false,
        })
        await submitDelete(id)
    }

    const [swalProps, setSwalProps] = useState({
        title: '',
        text: '',
    })
    const showSwal = (props) => {
        return withReactContent(Swal).fire({
            ...props
        })
    }

    const [openModel, setOpenModal] = useState(false)

    const setOpenModalStatus = (status) => {
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                status: status
            }
        }))
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

    const submitStatus = async (payload) => {
        setSubmitting(true)
        const result = await dispatch(LoggedAxios({ method: 'put', endpoint: `/pinjam/status/${id}`, params: {}, payloads: payload }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        setSubmitting(false)
        return data
    }

    const handleSubmitDiterima = async () => {

        const payload = {
            receiver: state.input.receiver,
            time_receive: state.input.time_receive,
            status: 4
        }
        const data = await submitStatus(payload);

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
    }

    const handleUpdateStatus = async (id, status) => {
        showSwal({
            ...swalProps,
            title: 'Please wait',
            html: <div>
                <FaSpinner className="animate-spin mr-2" style={{ display: 'inline' }} />
                Submitting
            </div>,
            showConfirmButton: false,
        })

        const payload = {
            id: id,
            status: status
        }
        const data = await submitStatus(payload)

        if (data?.responseCode == '000') {
            loadModel()
        }
        setLoading(false)
        setTimeout(() => {
            showSwal({
                ...swalProps,
                title: 'Info',
                icon: 'info',
                html: data.responseMessage,
                showConfirmButton: true,
            })
        }, 1000);
    }

    const handleSubmitSetKembali = async () => {

        const payload = {
            submitter: state.input.submitter,
            status: 5
        }
        const data = await submitStatus(payload);

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
    }

    return (
        <>

            <Modal show={openModel} size="md" onClose={() => setCloseModalStatus()} popup>
                <ModalHeader />
                <ModalBody>
                    {
                        (model.pinjam?.status === 1) && <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Telah Diterima</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="receiver">Nama Pengambil</Label>
                                </div>
                                <TextInput
                                    id="receiver"
                                    placeholder="nama penerima"
                                    value={state.input?.receiver}
                                    name="receiver"
                                    onChange={handleChange}
                                    required
                                />
                                {
                                    state.errors.receiver && <div className="text-red-500 block">
                                        {state.errors.receiver}
                                    </div>
                                }
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="receiver">Waktu penerimaan</Label>
                                </div>
                                <TextInput
                                    id="time"
                                    placeholder="nama penerima"
                                    value={state.input?.time_receive}
                                    name="time_receive"
                                    type="datetime-local"
                                    onChange={handleChange}
                                    required
                                />
                                {
                                    state.errors.time_receive && <div className="text-red-500 block">
                                        {state.errors.time_receive}
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
                        model?.pinjam?.status === 3 && <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Sudah Diambil</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="receiver">Nama</Label>
                                </div>
                                <TextInput
                                    id="receiver"
                                    placeholder="nama penerima"
                                    value={state.input?.receiver}
                                    name="receiver"
                                    onChange={handleChange}
                                    required
                                />
                                {
                                    state.errors.receiver && <div className="text-red-500 block">
                                        {state.errors.receiver}
                                    </div>
                                }
                            </div>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="receiver">Waktu</Label>
                                </div>
                                <TextInput
                                    id="time"
                                    placeholder="nama penerima"
                                    value={state.input?.time_receive}
                                    name="time_receive"
                                    type="datetime-local"
                                    onChange={handleChange}
                                    required
                                />
                                {
                                    state.errors.time_receive && <div className="text-red-500 block">
                                        {state.errors.time_receive}
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
                        model?.pinjam?.status === 4 && <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleSubmitSetKembali() }}>
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Sudah Diterima</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="receiver">Nama pengembali</Label>
                                </div>
                                <TextInput
                                    id="receiver"
                                    placeholder="nama pengembali"
                                    value={state.input?.submitter}
                                    name="submitter"
                                    onChange={handleChange}
                                    required
                                />
                                {
                                    state.errors.submitter && <div className="text-red-500 block">
                                        {state.errors.submitter}
                                    </div>
                                }
                            </div>
                            <div className="w-full">
                                {
                                    submitting ? <button type="button" className="rounded-xl bg-violet-300 text-white px-4 py-2 items-center flex flex-row gap-2" disabled><HiBeaker style={{ display: 'inline' }} /> Submitting...</button>
                                        : <button type="submit" className="rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2"><HiSave style={{ display: 'inline' }} /> Update</button>
                                }
                            </div>
                        </form>
                    }

                </ModalBody>
            </Modal>
            <Head>
                <title>Detail Peminjaman {model.pinjam?.trans_kode}</title>
            </Head>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between lg:items-center min-h-10">
                        <div className="flex flex-row gap-2 items-center">
                            <h1 className="font-bold text-2xl">Detail Peminjaman {model.pinjam?.trans_kode} </h1>
                            <LabelJenisPinjam jenis={model.pinjam?.jenis_pj} />
                        </div>
                        <LabelStatusPinjam status={model.pinjam?.status} jenis={model.pinjam?.jenis_pj} />
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-4">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                        <div className="p-4 bg-white rounded-2xl">
                            <span className="text-xs">Total Instrumen</span>
                            <h3 className="font-bold">{model.pinjam?.total_itm}</h3>
                        </div>
                        <div className="col-span-2 flex flex-row gap-2 items-center justify-between lg:justify-end">
                            {
                                model.pinjam?.status === 1 && <>
                                    {
                                        ([0, 1, 3].indexOf(userdata.level) >= 0) && <>
                                            <button type="button" className="h-full rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2" onClick={() => {
                                                showSwal({
                                                    icon: 'warning',
                                                    title: 'Yakin akan dipacking?',
                                                    text: 'Aksi ini tidak dapat dikembalikan',
                                                    showConfirmButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    cancelButtonText: "Batal",
                                                    confirmButtonText: "Ya, Dipacking!",
                                                }).then((res) => {
                                                    if (res.isConfirmed) {
                                                        handleUpdateStatus(model.pinjam?.id, 2)
                                                    }
                                                })
                                            }}><HiClipboardCheck /> Set Dipacking</button>
                                        </>
                                    }
                                    <button type="button" className="h-full rounded-xl bg-red-500 text-white px-4 py-2 items-center flex flex-row gap-2" onClick={() => {
                                        showSwal({
                                            icon: 'warning',
                                            title: 'Yakin akan dibatalkan?',
                                            text: 'Aksi ini tidak dapat dikembalikan',
                                            showConfirmButton: true,
                                            showCancelButton: true,
                                            confirmButtonColor: "#3085d6",
                                            cancelButtonColor: "#d33",
                                            cancelButtonText: "Batal",
                                            confirmButtonText: "Ya, Batalkan!",
                                        }).then((res) => {
                                            if (res.isConfirmed) {
                                                handleDelete(model.pinjam?.id)
                                            }
                                        })
                                    }}><HiTrash style={{ display: 'inline' }} /> Batalkan</button>
                                </>
                            }
                            {
                                ([0, 1, 3].indexOf(userdata.level) >= 0) && <>
                                    {
                                        model.pinjam?.status === 2 && <><Link href={{
                                            pathname: `/pinjam/packing`,
                                            query: { id: model.pinjam?.trans_kode }
                                        }} className="h-full rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2"><HiShoppingBag /> Packing Permintaan</Link>

                                            <button type="button" className="h-full rounded-xl bg-red-500 text-white px-4 py-2 items-center flex flex-row gap-2" onClick={() => {
                                                showSwal({
                                                    icon: 'warning',
                                                    title: 'Yakin akan dibatalkan?',
                                                    text: 'Aksi ini tidak dapat dikembalikan',
                                                    showConfirmButton: true,
                                                    showCancelButton: true,
                                                    confirmButtonColor: "#3085d6",
                                                    cancelButtonColor: "#d33",
                                                    cancelButtonText: "Batal",
                                                    confirmButtonText: "Ya, Batalkan!",
                                                }).then((res) => {
                                                    if (res.isConfirmed) {
                                                        handleDelete(model.pinjam?.id)
                                                    }
                                                })
                                            }}><HiTrash style={{ display: 'inline' }} /> Batalkan</button>
                                        </>
                                    }
                                </>
                            }

                            {
                                ([0, 1, 4].indexOf(userdata.level) >= 0) && <>
                                    {
                                        model.pinjam?.status === 3 && <>
                                            <Link href={{
                                                pathname: `/pinjam/packing`,
                                                query: { id: model.pinjam?.trans_kode }
                                            }} className="rounded-xl bg-green-500 text-white px-4 py-2 items-center flex flex-row gap-2" ><HiBadgeCheck style={{ display: 'inline' }} /> Verifikasi B1</Link>
                                        </>
                                    }
                                </>
                            }
                            {
                                (['AHP'].indexOf(model.pinjam?.jenis_pj) < 0) && <>

                                    {
                                        ([0, 1, 4].indexOf(userdata.level) >= 0) && <>
                                            {
                                                model.pinjam?.status === 4 && <>
                                                    <Link href={{
                                                        pathname: `/pinjam/packing`,
                                                        query: { id: model.pinjam?.trans_kode }
                                                    }} className="rounded-xl bg-amber-500 text-white px-4 py-2 items-center flex flex-row gap-2" ><HiBadgeCheck style={{ display: 'inline' }} /> Verifikasi Pengembalian B2</Link>


                                                </>
                                            } </>
                                    }
                                    {
                                        ([0, 1, 3].indexOf(userdata.level) >= 0) && <>
                                            {
                                                model.pinjam?.status === 5 && <>
                                                    <Link href={{
                                                        pathname: `/pinjam/packing`,
                                                        query: { id: model.pinjam?.trans_kode }
                                                    }} className="rounded-xl bg-blue-500 text-white px-4 py-2 items-center flex flex-row gap-2" ><HiBadgeCheck style={{ display: 'inline' }} /> Verifikasi Pengembalian A2</Link>
                                                </>
                                            }
                                        </>
                                    }

                                </>
                            }


                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2">
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Tanggal Pakai</label>
                                    <span>{dayjs(model.pinjam?.tgl).format('DD MMMM YYYY')}</span>
                                </div>
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Ruangan</label>
                                    <span>{model.pinjam?.ruang_nama} - {model.pinjam?.institusi_nama}</span>

                                </div>
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Kamar</label>
                                    <span>{model.pinjam?.kamar}</span>
                                </div>
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Nomor</label>
                                    <span>{model.pinjam?.nomor}</span>
                                </div>
                                {
                                    (model.set_list?.nama) &&
                                    <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                        <label className="w-4/12 text-xs font-bold">Set Nama</label>
                                        <span className="bg-amber-200 text-red-700 rounded-lg px-4 py-1">{model.set_list?.nama}</span>
                                    </div>
                                }
                            </div>
                            <div className="flex flex-col gap-2">
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Dibuat Pada</label>
                                    <span><StripEmpty value={model.pinjam?.ins_time} type="datetime" format="DD MMM YYYY HH:mm" /></span>
                                </div>
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Dibuat Oleh</label>
                                    <span><StripEmpty value={model.pinjam?.ins_by_nama} /></span>
                                </div>
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Update Terakhir</label>
                                    <span><StripEmpty value={model.pinjam?.upd_time} type="datetime" format="DD MMM YYYY HH:mm" /></span>
                                </div>
                                <div className="flex flex-row gap-x-3 gap-y-1 items-center">
                                    <label className="w-4/12 text-xs font-bold">Update Oleh</label>
                                    <span><StripEmpty value={model.pinjam?.upd_by_nama} /></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {
                        (model.pinjam?.status === 1) ? <>
                            <TableDetailRequest model={model} />
                        </> : <>
                            <TableDetailDefault model={model} />
                        </>
                    }

                    {
                        ((model?.pinjam?.trans_kode)) && <div className="">
                            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
                                <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                    <label className="font-bold">Petugas A1</label>
                                    <input defaultValue={model.pinjam.a1} className="py-1 px-2 rounded-xl bg-gray-200 border placeholder:text-[#A0AEC0] col-span-4" readOnly />
                                    <span className="text-xs font-bold flex items-center gap-2 text-gray-600 px-2"><HiClock/> <StripEmpty value={model.log_action?.a1?.log_time} type="datetime" format="DD MMM YYYY HH:mm" /></span>
                                </div>
                                <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                    <label className="font-bold">Petugas B1</label>
                                    <input defaultValue={model.pinjam.b1} className="py-1 px-2 rounded-xl bg-gray-200 border placeholder:text-[#A0AEC0] col-span-4" readOnly />
                                    <span className="text-xs font-bold flex items-center gap-2 text-gray-600 px-2"><HiClock/> <StripEmpty value={model.log_action?.b1?.log_time} type="datetime" format="DD MMM YYYY HH:mm" /></span>
                                </div>
                                <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                    <label className="font-bold">Petugas B2</label>
                                    <input defaultValue={model.pinjam.b2} className="py-1 px-2 rounded-xl bg-gray-200 border placeholder:text-[#A0AEC0] col-span-4" readOnly />
                                    <span className="text-xs font-bold flex items-center gap-2 text-gray-600 px-2"><HiClock/> <StripEmpty value={model.log_action?.b2?.log_time} type="datetime" format="DD MMM YYYY HH:mm" /></span>
                                </div>
                                <div className="flex flex-col gap-x-3 gap-y-1 bg-white px-4 py-2 rounded-lg">
                                    <label className="font-bold">Petugas A2</label>
                                    <input defaultValue={model.pinjam.a2} className="py-1 px-2 rounded-xl bg-gray-200 border placeholder:text-[#A0AEC0] col-span-4" readOnly />
                                    <span className="text-xs font-bold flex items-center gap-2 text-gray-600 px-2"><HiClock/> <StripEmpty value={model.log_action?.a2?.log_time} type="datetime" format="DD MMM YYYY HH:mm" /></span>
                                </div>
                            </div>
                        </div>
                    }



                </div>
            </div>

        </>

    )
}