'use client'

import { LoggedAxios } from "@/lib/store/features/authAction";
import dayjs from "dayjs";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import InstrumenForm from "./_form";

export default function InstrumenData(props) {
    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen`, params: state.input, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setDatas([...data.data])
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const [state, setState] = useState({
        input: {
            key: '',
            jenis: ''
        },
        errors: {},
    })
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

    const handleSubmit = (e) => {
        e.preventDefault()
        loadData()
    }

    const [showSweet, setShowSweet] = useState(false)
    const [swalProps, setSwalProps] = useState({
        title: '',
        text: '',
    })

    const submitDelete = async (id) => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'delete', endpoint: `/instrumen/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            loadData()
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
        const splits = id.split("-")
        showSwal({
            ...swalProps,
            title: 'Please wait',
            html: <div>
                <FaSpinner className="animate-spin mr-2" style={{ display: 'inline' }} />
                Submitting
            </div>,
            showConfirmButton: false,
        })
        await submitDelete(splits[1])
    }

    const showSwal = (props) => {
        return withReactContent(Swal).fire({
            ...props
        })
    }

    const [openModal, setOpenModal] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const handleOpenModalEdit = (id) => {
        const splits = id.split("-")
        setSelectedId(splits[1])
        setOpenModal(true)
    }

    return (
        <>

            <Modal size="2xl" show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader><div className="text-lg font-bold text-gray-900 dark:text-white">Form Input</div></ModalHeader>
                <ModalBody>
                    <InstrumenForm id={selectedId} setSelectedId={setSelectedId} loadData={loadData} setOpenModal={setOpenModal} />
                </ModalBody>
            </Modal>

            <Head>
                <title>Data Instrumen</title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-2xl">Data Instrumen</h1>
                        <div>
                            <button className="rounded-xl bg-green-800 text-white px-4 py-2 items-center flex flex-row gap-2" onClick={() => setOpenModal(true)}><span><HiPlus /></span> Tambah</button>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2">
                        <select className={["p-2 border rounded-lg bg-transparent", (state.errors.jenis) ? "border-red-800" : "border-gray-200"].join(" ")} name="jenis" type="text" onChange={handleChange} value={state.input.jenis}>
                            <option value="">- pilih jenis -</option>
                            <option value="pcs">pcs</option>
                            <option value="chk">chk</option>
                            <option value="pack">pack</option>
                        </select>
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." name="key" value={state.input.key} onChange={handleChange} />
                    </form>
                    <div className="overflow-auto max-h-screen">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Nama</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">No Katalog</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Brand</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Tgl Expired</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Jenis</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas
                                        // .sort((a,b) => {
                                        //     if (a.jenis === 'pcs') {
                                        //         return 
                                        //     } else if (a.jenis === 'set') {
                                        //         return 0
                                        //     } else {
                                        //         return -1
                                        //     }
                                        // })
                                        .filter((v) => {
                                            return ((v.jenis + "").toLowerCase().indexOf(state.input?.jenis.toLowerCase()) >= 0)
                                        })
                                        .filter((v) => {
                                            return ((v.nama + "").toLowerCase().indexOf(state.input?.key.toLowerCase()) >= 0)
                                                || ((v.no_katalog + "").toLowerCase().indexOf(state.input?.key.toLowerCase()) >= 0)
                                                || ((v.brand + "").toLowerCase().indexOf(state.input?.key.toLowerCase()) >= 0)
                                        })
                                        .map((v, k) => {
                                            return <tr className="border-t border-b text-xs" key={k}>
                                                <td className="py-1">{k + 1}</td>
                                                <td className="py-1">{v.nama}</td>
                                                <td className="py-1">{v.no_katalog}</td>
                                                <td className="py-1">{v.brand}</td>
                                                <td className="py-1">{v.tgl_expired ? dayjs(v.tgl_expired).format('DD MMM YYYY, HH:mm') : '-'}</td>
                                                <td className="py-1">{v.jenis}</td>
                                                <td className="py-1 flex gap-1 items-center">
                                                    <button className="bg-blue-500 text-white rounded p-1 flex items-center gap-1" onClick={() => handleOpenModalEdit(v.id)}><HiPencil /></button>
                                                    <button type="button" className="bg-red-500 text-white rounded p-1 flex items-center gap-1" onClick={() => {
                                                        showSwal({
                                                            icon: 'warning',
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
                                                                handleDelete(v.id)
                                                            }
                                                        })
                                                    }}><HiTrash /></button>
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