
import { StripEmpty } from "@/app/_bekaya/BekayaHelper";
import { LabelLevelUser, LabelStatusUser } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import { Modal, ModalBody, ModalHeader } from "flowbite-react";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaFilter, FaSpinner } from "react-icons/fa6";
import { HiPencil, HiPlus, HiTrash } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import UserForm from "./_form";

export default function UserData(props) {
    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const handleSubmit = (e) => {
        e.preventDefault()
        loadData()
    }

    const loadData = async () => {
        setLoading(true)
        const params = {
            key: state.input.key,
            level: state.input.level,
        }
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/user`, params: params, payloads: {} }))
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

    const [showSweet, setShowSweet] = useState(false)
    const [swalProps, setSwalProps] = useState({
        title: '',
        text: '',
    })

    const submitDelete = async (id) => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'delete', endpoint: `/user/${id}`, params: {}, payloads: {} }))
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
        input: {},
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

    return (
        <>

            <Modal size="xl" show={openModal} onClose={() => setOpenModal(false)}>
                <ModalHeader><div className="text-xl font-medium text-gray-900 dark:text-white">User Baru</div></ModalHeader>
                <ModalBody>
                    <UserForm id={selectedId} loadData={loadData} setOpenModal={setOpenModal} setSelectedId={setSelectedId} />
                </ModalBody>
            </Modal>

            <Head>
                <title>User</title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Data User</h1>
                        <div>
                            <button className="rounded-xl bg-green-800 text-white px-4 py-2 items-center flex flex-row gap-2" onClick={() => setOpenModal(true)}><span><HiPlus /></span> Tambah</button>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-row gap-2" onSubmit={handleSubmit}>
                        <select className={["p-2 border rounded-lg bg-transparent", (state.errors.nama) ? "border-red-800" : "border-gray-200", (state.errors.level) ? "border border-red-500" : ''].join(" ")} name="level" value={state.input.level} onChange={handleChange} >
                            <option value={''}>- choose level -</option>
                            <option value={1}>Superadmin</option>
                            <option value={2}>Admin</option>
                            <option value={3}>Petugas CSSD</option>
                            <option value={4}>Nakes</option>
                        </select>
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." name="key" value={state.input.key} onChange={handleChange} />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200"><FaFilter /></button>
                    </form>
                    <div className="overflow-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Nama</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Username</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Email</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Level</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Ruang</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Last Login</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Status</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.map((v, k) => {
                                        return <tr className="border-t border-b text-xs" key={k}>
                                            <td className="py-1">{k + 1}</td>
                                            <td className="py-1">{v.full_name}</td>
                                            <td className="py-1">{v.user_name}</td>
                                            <td className="py-1">{v.email}</td>
                                            <td className="py-1"><LabelLevelUser level={v.level} /></td>
                                            <td className="py-1"><StripEmpty value={v.ruang_nama} /> - <StripEmpty value={v.institusi_nama} /></td>
                                            <td className="py-1"><StripEmpty value={v.last_login} type="datetime" format="DD-MMM-YYYY HH:mm" /></td>
                                            <td className="py-1"><LabelStatusUser status={v.status} /></td>
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