'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import { error, success } from "@/lib/store/features/messageSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiPlus, HiSave, HiTrash } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function RuanganKamarForm(props) {
    const router = useRouter()
    const [state, setState] = useState({
        input: {
            id: '',
            nama: '',
            institusi: '',
        },
        errors: {},
    })
    const [kamars, setKamars] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const { id, loadData, setOpenModal } = props

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

        const payloads = { kamar: kamars }

        const method = 'PUT'
        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/ruangan/kamar/${id}`, params: {}, payloads: payloads }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result 
        if (data?.responseCode === '000') { 
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
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/ruangan/detail/${id}`, params: {}, payloads: {} }))
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
                    ...data.data.ruangan,
                }
            }))
            const { metadata } = data.data.ruangan
            if (metadata.kamar) {
                setKamars(metadata.kamar)
            }
        }
    }
    useEffect(() => {
        if (id) {
            loadDetail(id)
        }
    }, [id])

    const handleAddKamar = (e) => {
        e.preventDefault()
        if (state.input.kamar) {
            setKamars((prevState) => ([
                ...prevState,
                state.input.kamar
            ]))
            setState((prevState) => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    kamar: ''
                }
            }))
        }
    }

    const handleRemKamar = (v) => (e) => {
        e.preventDefault()
        const idx = kamars.indexOf(v)
        if (idx >= 0) {
            const lastState = [...kamars]
            lastState.splice(idx,1)
            setKamars(lastState)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1 items-center">
                    <label className="lg:w-3/12">Nama Ruangan</label>
                    <div className="flex flex-col gap-1">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4"].join(" ")} placeholder="" type="text" readOnly value={state.input.nama} />
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1 items-center">
                    <label className="lg:w-3/12">Tambah Kamar</label>
                    <div className="flex flex-col gap-1">
                        <div className="flex flex-row items-center gap-1">
                            <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4"].join(" ")} placeholder="" type="text" value={state.input.kamar} name="kamar" onChange={handleChange} />
                            <div><button className="rounded-full py-2 px-4 bg-blue-800 text-white flex gap-3 items-center" onClick={handleAddKamar}><HiPlus /></button></div>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1 items-center">
                    <label className="lg:w-3/12"></label>
                    <div className="flex flex-col gap-1">
                        <ul className="list-disc list-inside max-h-[200px] overflow-auto grid grid-cols-2 grid-flow-row gap-x-4">
                            {
                                kamars.map((v) => {
                                    return <li className="">{v} <button type="button" onClick={handleRemKamar(v)} className="text-red-500"><HiTrash /></button></li>
                                })
                            }
                        </ul>
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