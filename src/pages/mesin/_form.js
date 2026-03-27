'use client'

import { BasicAxios } from "@/app/_bekaya/AxiosHelper"
import { LoggedAxios } from "@/lib/store/features/authAction"
import { success } from "@/lib/store/features/messageSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiSave } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function MesinForm(props) {
    const router = useRouter();
    const [state, setState] = useState({
        input: {},
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

    const dispatch = useDispatch()

    const submit = async () => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        const payloads = state.input

        const method = state.input.id ? 'PUT' : 'POST'
        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/mesin`, params: {}, payloads: payloads }))
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

    const loadDetail = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/mesin/detail/${id}`, params: {}, payloads: {} }))
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
                    ...data.data.mesin
                }
            }))
        }
    }
    useEffect(() => {
        if (id) {
            loadDetail(id)
        }
    }, [id])

    return (
        <form onSubmit={handleSubmit} className=" ">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Nama Mesin</label>
                    <div className="flex flex-col gap-1">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nama) ? "border-red-800" : "border-gray-200"].join(" ")} name="nama" type="text" onChange={handleChange} value={state.input.nama} />
                        {
                            state.errors.nama && <div className="text-red-500 block">
                                {state.errors.nama}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">No Katalog</label>
                    <div className="flex flex-col gap-1">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nomor) ? "border-red-800" : "border-gray-200"].join(" ")} name="nomor" type="text" onChange={handleChange} value={state.input.nomor} />
                        {
                            state.errors.nomor && <div className="text-red-500 block">
                                {state.errors.nomor}
                            </div>
                        }
                    </div>
                </div>
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