'use client'

import { LabelStatusReturn } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import dayjs from "dayjs";
import { Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { HiBeaker, HiCheck, HiSave } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function ReturnView() {

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

    const loadModel = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/return/detail/${id}`,  params:{},payloads:{} }))
        .then((resp) => {
          return {...resp.payload}
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
                    receiver: data.data.return.receiver,
                    time_receive: data.data.return.tgl + 'T' + '00:00:00'
                }
            }))
            document.title = `Detail Pengembalian ${data.data.return.trans_kode}`
        }
        setLoading(false)
    }

    useEffect(() => {
        loadModel()
    }, [id])

    useEffect(() => {
        if (model.detail) {
            // CalcuTotalCL()
        }
    }, [model.detail])

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

    const submitDelete = async (id) => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'delete', endpoint: `/pinjam/${id}`,  params:{},payloads:{} }))
        .then((resp) => {
          return {...resp.payload}
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

    const submitStatus = async () => {
        setSubmitting(true)
        const payload = {
            receiver: state.input.receiver,
            time_receive: state.input.time_receive,
            status: state.input.status
        }
        const result = await dispatch(LoggedAxios({ method: 'put', endpoint: `/pinjam/status/${id}`,  params:{},payloads:payload }))
        .then((resp) => {
          return {...resp.payload}
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

    return (
        <>

            <Modal show={openModel} size="md" onClose={() => setCloseModalStatus()} popup>
                <ModalHeader />
                <ModalBody>
                    {
                        (model.return?.status === 1) && <div className="space-y-6">
                            <h3 className="text-xl font-medium text-gray-900 dark:text-white">Set Sudah Diterima</h3>
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="receiver">Nama penerima</Label>
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

                </ModalBody>
            </Modal>

            <div className="flex flex-col gap-4 my-8">
                <div className="rounded-2xl bg-white p-4 flex justify-between items-center">
                    <h1 className="font-bold text-xl">Detail Pengembalian {model.return?.trans_kode}</h1>
                    <LabelStatusReturn status={model.return?.status} />
                </div>
                <div className="flex flex-row justify-end">
                    {
                        model.return?.status === 1 && <Link href={`/return/verifikasi/${model.return?.trans_kode}`} className="rounded-xl bg-blue-600 text-white px-4 py-2 items-center flex flex-row gap-2"><HiCheck /> Verifikasi Pengembalian</Link>
                    }
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-xl">Data Pengembalian</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white rounded-2xl">
                                <span className="text-xs">Total Item</span>
                                <h3 className="font-bold">{model.return?.total_itm_return}</h3>
                            </div>
                            <div className="p-4 bg-white rounded-2xl">
                                <span className="text-xs">Total Instrumen</span>
                                <h3 className="font-bold">{model.return?.total_jns_return}</h3>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-4">
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Tanggal Pengembalian</label>
                                <span>{dayjs(model.return?.tgl_return).format('DD MMMM YYYY')}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Petugas Pengembali</label>
                                <span>{model.return?.submitter}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Petugas Verifikator</label>
                                <span>{model.return?.receiver_return}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col gap-4">
                        <h3 className="font-bold text-xl">Data Peminjaman</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-white rounded-2xl">
                                <span className="text-xs">Total Item</span>
                                <h3 className="font-bold">{model.return?.total_itm}</h3>
                            </div>
                            <div className="p-4 bg-white rounded-2xl">
                                <span className="text-xs">Total Instrumen</span>
                                <h3 className="font-bold">{model.return?.total_jns}</h3>
                            </div>
                        </div>
                        <div className="rounded-xl bg-white p-4">
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Tanggal Pakai</label>
                                <span>{dayjs(model.return?.tgl).format('DD MMMM YYYY')}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Petugas Pengepakan</label>
                                <span>{model.return?.packer}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Petugas Penerima</label>
                                <span>{model.return?.receiver}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Ruangan</label>
                                <span>{model.return?.ruang_nama} - {model.return?.institusi_nama}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Kamar</label>
                                <span>{model.return?.kamar}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Nomor</label>
                                <span>{model.return?.no}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {
                    model.detail?.length > 0 && <div className="rounded-2xl bg-white p-4">
                        <h3 className="my-3 font-bold">Detail Instrumen</h3>
                        <div className="flex flex-col gap-2 max-h-[400px] overflow-auto">
                            <table className="w-full text-xs">
                                <thead>
                                    <tr className="border-y">
                                        <th className="px-1 py-1 text-left">#</th>
                                        <th className="px-1 py-1 text-left">Nama</th>
                                        <th className="px-1 py-1 text-left">No Katalog</th>
                                        <th className="px-1 py-1 text-left">Brand</th>
                                        <th className="px-1 py-1 text-right w-[100px]">Jml Pinjam</th>
                                        <th className="px-1 py-1 text-right w-[100px]">Jml Kembali</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        model.detail?.length > 0 ? <>
                                            {
                                                model.detail
                                                    .map((v, k) => {
                                                        return <>
                                                            <tr className="border-y" key={k}>
                                                                <td className="px-1 py-1">{k + 1}</td>
                                                                <td className="px-1 py-1">{v.nama}</td>
                                                                <td className="px-1 py-1">{v.no_katalog}</td>
                                                                <td className="px-1 py-1">{v.brand}</td>
                                                                <td className="px-1 py-1 text-right">{v.amt}</td>
                                                                <td className="px-1 py-1 text-right">{v.amt_return}</td>
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
                                            {model.return?.total_itm}
                                        </td>
                                        <td className="px-1 py-1 text-right">
                                            {model.return?.total_itm}
                                        </td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                }
            </div>
        </>

    )
}