'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import { success } from "@/lib/store/features/messageSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiSave } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function InstrumenForm(props) {
    const router = useRouter();
    const [state, setState] = useState({
        input: {
            idt: '',
            nama: '',
            satuan: '',
            no_katalog: '',
            brand: '',
            reuse: ''
        },
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)
    const { id, loadData, setOpenModal, setSelectedId } = props

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

    const submit = async () => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        const payloads = state.input

        const method = state.input.id ? 'PUT' : 'POST'
        const result = await dispatch(LoggedAxios({ method:method, endpoint: `/instrumen`,  params:{},payloads:payloads }))
        .then((resp) => {
          return {...resp.payload}
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
    const dispatch = useDispatch()
    const loadDetail = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen/detail/${id}`,  params:{},payloads:{} }))
        .then((resp) => {
          return {...resp.payload}
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
                    ...data.data.instrumen
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

    return (

        <form onSubmit={handleSubmit} className="">
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Kode Barang</label>
                    <div className="flex flex-col gap-1 grow">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.idt) ? "border-red-800" : "border-gray-200"].join(" ")} name="idt" type="text" onChange={handleChange} value={state.input.idt} />
                        {
                            state.errors.idt && <div className="text-red-500 block">
                                {state.errors.idt}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Nama Barang</label>
                    <div className="flex flex-col gap-1 grow">
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
                    <div className="flex flex-col gap-1 grow">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.no_katalog) ? "border-red-800" : "border-gray-200"].join(" ")} name="no_katalog" type="text" onChange={handleChange} value={state.input.no_katalog} />
                        {
                            state.errors.no_katalog && <div className="text-red-500 block">
                                {state.errors.no_katalog}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Nama Brand</label>
                    <div className="flex flex-col gap-1 grow">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.brand) ? "border-red-800" : "border-gray-200"].join(" ")} name="brand" type="text" onChange={handleChange} value={state.input.brand} />
                        {
                            state.errors.brand && <div className="text-red-500 block">
                                {state.errors.brand}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Expired Date</label>
                    <div className="flex flex-col gap-1 grow">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.brand) ? "border-red-800" : "border-gray-200"].join(" ")} name="tgl_expired" type="datetime-local" onChange={handleChange} value={state.input.brand} />
                        {
                            state.errors.tgl_expired && <div className="text-red-500 block">
                                {state.errors.tgl_expired}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Satuan</label>
                    <div className="flex flex-col gap-1 grow">
                        <select className={["lg:w-5/12 py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.satuan) ? "border-red-800" : "border-gray-200"].join(" ")} name="satuan" type="text" onChange={handleChange} value={state.input.satuan}>
                            <option value="">- pilih satuan -</option>
                            <option value="pcs">pcs</option>
                            <option value="chk">chk</option>
                            <option value="pack">pack</option>
                        </select>
                        {
                            state.errors.satuan && <div className="text-red-500 block">
                                {state.errors.satuan}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Reuse Maks</label>
                    <div className="flex flex-col gap-1 grow">
                        <input className={["lg:w-5/12 py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.reuse) ? "border-red-800" : "border-gray-200"].join(" ")} name="reuse" type="text" onChange={handleChange} value={state.input.reuse} />
                        {
                            state.errors.reuse && <div className="text-red-500 block">
                                {state.errors.reuse}
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