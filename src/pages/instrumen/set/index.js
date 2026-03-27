'use client'

import { LoggedAxios } from "@/lib/store/features/authAction";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFilter, FaSpinner } from "react-icons/fa6";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function InstrumenSet() {
    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen/set`, params: state.input, payloads: {} }))
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
        const result = await dispatch(LoggedAxios({ method: 'delete', endpoint: `/instrumen/set/${id}`, params: {}, payloads: {} }))
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

    return (
        <>
            <Head>
                <title>Data Set Instrumen</title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-2xl">Data Set Instrumen</h1>
                        <div>
                            <Link className="rounded-xl bg-green-800 text-white px-4 py-2 items-center flex flex-row gap-2" href={`/instrumen/set/add`}><span><HiPlus /></span> Tambah</Link>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2">
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." name="key" value={state.input.key} onChange={handleChange} />
                    </form>
                    <div className="overflow-auto max-h-screen">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Nama</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Total Instrumen</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.length ? <>
                                        {
                                            datas
                                            .filter((v) => {
                                                return ((v.nama + "").toLowerCase().indexOf(state.input.key.toLowerCase()) >= 0)
                                            })
                                            .map((v, k) => {
                                                return <tr className="border-t border-b text-xs" key={k}>
                                                    <td className="py-1">{k + 1}</td>
                                                    <td className="py-1">{v.nama}</td>
                                                    <td className="py-1">{v.item_total}</td>
                                                    <td className="py-1 flex gap-1 items-center">

                                                        <Link href={{
                                                            pathname: `/instrumen/set/update`,
                                                            query: { id: v.id }
                                                        }} className="bg-blue-500 text-white rounded p-1 flex items-center gap-1" ><HiPencil /></Link>
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
                                    </> : <>
                                        <tr>
                                            <td colSpan={4}> - no data - </td>
                                        </tr>
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