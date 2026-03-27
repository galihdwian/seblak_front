'use client'

import { LoggedAxios } from "@/lib/store/features/authAction";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaSpinner } from "react-icons/fa6";
import { HiPencil, HiPlus, HiSwitchHorizontal, HiTrash } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import RuanganForm from "./_form";
import RuanganKamarForm from "./_form_kamar";

export default function Ruangan() {
    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: '', endpoint: `/ruangan`, params: {}, payloads: {} }))
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
            console.log(data.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const [showSweet, setShowSweet] = useState(false)
    const [swalProps, setSwalProps] = useState({
        title: '',
        text: '',
    })

    const submitDelete = async (id) => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'delete', endpoint: `/ruangan/${id}`, params: {}, payloads: {} }))
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

    const showSwal = (props) => {
        return withReactContent(Swal).fire({
            ...props
        })
    }

    const [openModal, setOpenModal] = useState(false)
    const [selectedId, setSelectedId] = useState(null)

    const handleOpenModalEdit = (id) => {
        setSelectedId(id)
        setOpenModal(true)
    }

    const [state, setState] = useState({
        input: {
            key: ''
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

    const [openModalKamar, setOpenModalKamar] = useState(false)

    const handleOpenModalKamar = (id) => {
        setSelectedId(id)
        setOpenModalKamar(true)
    }

    return (
        <>

            <Head>
                <title>Data Ruangan</title>
            </Head>

            <Modal size="lg" show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader><div className="text-xl font-medium text-gray-900 dark:text-white">Form Input</div></ModalHeader>
                <ModalBody>
                    <RuanganForm id={selectedId} loadData={loadData} setOpenModal={setOpenModal} />
                </ModalBody>
            </Modal>
            <Modal size="lg" show={openModalKamar} onClose={() => setOpenModalKamar(false)}>
                <ModalHeader><div className="text-xl font-medium text-gray-900 dark:text-white">Form Input</div></ModalHeader>
                <ModalBody>
                    <RuanganKamarForm id={selectedId} setOpenModal={setOpenModalKamar} />
                </ModalBody>
            </Modal>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-2xl">Data Ruangan</h1>
                        <div>
                            <button className="rounded-xl bg-green-800 text-white px-4 py-2 items-center flex flex-row gap-2" onClick={() => setOpenModal(true)}><span><HiPlus /></span> Tambah</button>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2">
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." name="key" onChange={handleChange} value={state.input.key} />
                    </form>
                    <div className="overflow-auto max-h-screen">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Nama</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Institusi</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas
                                        .filter((v) => {
                                            return ((v.nama + "").toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0)
                                                || ((v.institusi_nama + "").toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0)
                                        })
                                        .map((v, k) => {
                                            return <tr className="border-t border-b text-xs" key={k}>
                                                <td className="py-1">{k + 1}</td>
                                                <td className="py-1">{v.nama}</td>
                                                <td className="py-1">{v.institusi_nama}</td>
                                                <td className="py-1 flex gap-1 items-center">
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
                                                    <button className="bg-blue-500 text-white rounded p-1 flex items-center gap-1" onClick={() => handleOpenModalEdit(v.id)}><HiPencil /></button>
                                                    <button className="bg-yellow-500 text-white rounded p-1 flex items-center gap-1" onClick={() => handleOpenModalKamar(v.id)}><HiSwitchHorizontal /> Kamar</button>
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