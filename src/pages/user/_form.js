'use client'

import { LoggedAxios } from "@/lib/store/features/authAction";
import { success } from "@/lib/store/features/messageSlice";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiSave } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function UserForm(props) {
    const router = useRouter();
    const [state, setState] = useState({
        input: {
            id: '',
            email: '',
            password: '',
            repassword: '',
            full_name: '',
            user_name: '',
            phone: '',
            level: '',
        },
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)
    const { id, loadData, setSelectedId, setOpenModal } = props

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

    const loadDetail = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/user/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setState(prevState => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    ...data.data.user
                }
            }))
        }
        setSelectedId(null)
    }
    useEffect(() => {
        if (id) {
            loadDetail(id)
        }
    }, [id])

    const dispatch = useDispatch()
    const submit = async () => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        const payloads = state.input

        const method = state.input.id ? 'PUT' : 'POST'
        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/user`, params: {}, payloads: payloads }))
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
            dispatch(success(data.responseMessage))
            setOpenModal(false)
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        submit();
    }

    const [ruangan, setRuangan] = useState([])
    const [loading, setLoading] = useState(false)
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
    }, [])

    return (
        <form onSubmit={handleSubmit} className="">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Username</label>
                    <div className="flex flex-col gap-2 grow">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.user_name) ? "border-red-800" : "border-gray-200"].join(" ")} name="user_name" placeholder="you@example.com" type="text" onChange={handleChange} value={state.input.user_name} />
                        {
                            state.errors.user_name && <div className="text-red-500 block text-xs">
                                {state.errors.user_name}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Email</label>
                    <div className="flex flex-col gap-2 grow">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.email) ? "border-red-800" : "border-gray-200"].join(" ")} name="email" placeholder="you@example.com" type="text" onChange={handleChange} value={state.input.email} />
                        {
                            state.errors.email && <div className="text-red-500 block text-xs">
                                {state.errors.email}
                            </div>
                        }
                    </div>
                </div>
                {
                    !(state.input.id) && <>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-3/12">Password</label>
                            <div className="flex flex-col gap-2 grow">
                                <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nama) ? "border-red-800" : "border-gray-200"].join(" ")} name="password" placeholder="your password" type="password" onChange={handleChange} value={state.input.password} />
                                {
                                    state.errors.password && <div className="text-red-500 block text-xs">
                                        {state.errors.password}
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                            <label className="lg:w-3/12">Re-Password</label>
                            <div className="flex flex-col gap-2 grow">
                                <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nama) ? "border-red-800" : "border-gray-200"].join(" ")} name="repassword" placeholder="retype your password" type="password" onChange={handleChange} value={state.input.repassword} />
                                {
                                    state.errors.repassword && <div className="text-red-500 block text-xs">
                                        {state.errors.repassword}
                                    </div>
                                }
                            </div>
                        </div>
                    </>
                }
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Nama Lengkap</label>
                    <div className="flex flex-col gap-2 grow">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.full_name) ? "border-red-800" : "border-gray-200", (state.errors.full_name) ? "border border-red-500" : ''].join(" ")} name="full_name" placeholder="Enter your name" type="text" onChange={handleChange} value={state.input.full_name} />
                        {
                            state.errors.full_name && <div className="text-red-500 block text-xs">
                                {state.errors.full_name}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">No HP</label>
                    <div className="flex flex-col gap-2 grow">
                        <input type="tel" name="phone" value={state.input.phone} onChange={handleChange} className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.phone) ? "border-red-800" : "border-gray-200", (state.errors.phone) ? "border border-red-500" : ''].join(" ")} placeholder={``} />
                        {
                            state.errors.phone && <div className="text-red-500 block text-xs">
                                {state.errors.phone}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Level</label>
                    <div className="flex flex-col gap-2 grow">
                        <select className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nama) ? "border-red-800" : "border-gray-200", (state.errors.level) ? "border border-red-500" : ''].join(" ")} name="level" value={state.input.level} onChange={handleChange} >
                            <option value={''}>- choose level -</option>
                            <option value={1}>Superadmin</option>
                            <option value={2}>Admin</option>
                            <option value={3}>Petugas CSSD</option>
                            <option value={4}>Nakes</option>
                        </select>
                        {
                            state.errors.level && <div className="text-red-500 block text-xs">
                                {state.errors.level}
                            </div>
                        }
                    </div>
                </div>
                {
                    ((state.input.level + "") === "4") && <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                        <label className="lg:w-3/12">Ruangan</label>
                        <div className="flex flex-col gap-2 grow">
                            <select className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.ruang_id) ? "border-red-800" : "border-gray-200"].join(" ")} name="ruang_id" type="text" onChange={handleChange} value={state.input.ruang_id}>
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
                    </div>
                }
                <hr />
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <div className="lg:w-3/12"></div>
                    <div>
                        <button type="submit" className="rounded-full py-2 px-4 bg-blue-800 text-white flex gap-3 items-center"><span><HiSave /></span>Simpan</button>
                    </div>
                </div>
            </div>
        </form>
    )
}