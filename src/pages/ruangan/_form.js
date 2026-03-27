'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import { success } from "@/lib/store/features/messageSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiSave } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function RuanganForm(props) {
    const router = useRouter()
    const [state, setState] = useState({
        input: {
            id: '',
            nama: '',
            institusi: '',
        },
        errors: {},
    })
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

        const payloads = state.input
        payloads.institusi = payloads.institusi * 1

        const method = state.input.id ? 'PUT' : 'POST'
        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/ruangan`,  params:{},payloads:payloads }))
        .then((resp) => {
          return {...resp.payload}
        }, (error) => {
          if (error.response) {
          }
          return error.response
        })
        const { data, errors } = result
        if (data?.responseCode === '000') {
            loadData()
            setOpenModal(false)
            dispatch(success(data.responseMessage))
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
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/ruangan/detail/${id}`,  params:{},payloads:{} }))
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
                    ...data.data.ruangan,
                }
            }))
        }
    }
    useEffect(() => {
        if (id) {
            loadDetail(id)
        }
    }, [id])

    const handleChangeChk = (e) => {
        const { name, checked } = e.target

        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                [name]: (checked*1)
            }
        }))
    }

    return (
        <form onSubmit={handleSubmit} className="">
            <div className="flex flex-col gap-3">
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Nama</label>
                    <div className="flex flex-col gap-1">
                        <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4"].join(" ")} name="nama" placeholder="" type="text" onChange={handleChange} value={state.input.nama} />
                        {
                            state.errors.nama && <div className="text-red-500 block text-xs">
                                {state.errors.nama}
                            </div>
                        }
                    </div>

                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Institusi</label>
                    <div className="flex flex-col gap-1">
                        <select className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.institusi) ? "border border-red-500" : ''].join(" ")} name="institusi" value={state.input.institusi} onChange={handleChange} >
                            <option value={''}>- choose institusi -</option>
                            <option value={'1'}>RSMS</option>
                            <option value={'2'}>Griyatri</option>
                        </select>
                        {
                            state.errors.institusi && <div className="text-red-500 block text-xs">
                                {state.errors.institusi}
                            </div>
                        }
                    </div>
                </div>
                <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                    <label className="lg:w-3/12">Setting</label>
                    <div className="flex flex-col gap-1 items-center">
                        <label className="">
                            <input className="mr-3" type="checkbox" name="pinjam_form_full" onChange={handleChangeChk} checked={state.input?.pinjam_form_full} />
                            Form Pinjam Input Full
                        </label>
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