'use client'

import { LoggedAxios } from "@/lib/store/features/authAction"
import { error, success } from "@/lib/store/features/messageSlice"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { HiSave } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function BiologicaltestForm() {
    const router = useRouter();
    const [state, setState] = useState({
        input: {},
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)
    const dispatch = useDispatch()

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
        const result = await dispatch(LoggedAxios({ method: method, endpoint: `/biologicaltest`,  params:{},payloads:payloads }))
        .then((resp) => {
          return {...resp.payload}
        }, (error) => {
          if (error.response) {
          }
          return error.response
        })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            dispatch(success(data.responseMessage))
            router.push(`/biologicaltest`)
        } else {
             
            if (errors) {
                setState((prevState) => ({
                    ...prevState,
                    errors: errors
                }))
                dispatch(error(data.responseMessage))
            }
        }
        setSubmitting(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        submit();
    }

    const [mesins, setMesins] = useState([])
    const loadMesin = async (id) => { 
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/mesin`,  params:{status: '1'},payloads:{} }))
        .then((resp) => {
          return {...resp.payload}
        }, (error) => {
          if (error.response) {
          }
          return error.response
        })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setMesins(data.data)
        } else {
            setMesins([])
        }
    }

    useEffect(() => {
        loadMesin()
    }, [])

    return (
        <>
            <div className="lg:w-1/2 p-4">
                <div className="bg-white rounded-xl">
                    <form onSubmit={handleSubmit} className="flex flex-col divide-y">
                        <h5 className="my-4 font-bold text-md px-4">Form Input</h5>
                        <div className="flex flex-col gap-4 px-4 py-8">
                            <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 lg:shrink-0">Pilih Mesin</label>
                                <div className="flex flex-col gap-1 grow">
                                    <select className={["w-full py-1 px-2 border rounded-lg placeholder:text-[#A0AEC0]", (state.errors.mesin) ? "border-red-800" : "border-gray-200"].join(" ")} name="mesin" type="text" onChange={handleChange} value={state.input.mesin} >
                                        <option value={""}>- pilih mesin -</option>
                                        {
                                            mesins.map((v, k) => {
                                                return <option value={v.id}>{v.nama} {v.nomor}</option>
                                            })
                                        }
                                    </select>
                                    {
                                        state.errors.mesin && <div className="text-red-500 block">
                                            {state.errors.mesin}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12">Nomor Kertas Test</label>
                                <div className="flex flex-col gap-1 grow">
                                    <input className={["py-1 px-2 border rounded-lg placeholder:text-[#A0AEC0] col-span-4", (state.errors.paper) ? "border-red-800" : "border-gray-200"].join(" ")} name="paper" type="text" onChange={handleChange} value={state.input.paper} />
                                    {
                                        state.errors.paper && <div className="text-red-500 block">
                                            {state.errors.paper}
                                        </div>
                                    }
                                </div>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12">Waktu Start</label>
                                <div className="flex flex-col gap-1 grow">
                                    <input className={["py-1 px-2 border rounded-lg placeholder:text-[#A0AEC0] col-span-4", (state.errors.start) ? "border-red-800" : "border-gray-200"].join(" ")} name="start" type="datetime-local" onChange={handleChange} value={state.input.start} />
                                    {
                                        state.errors.start && <div className="text-red-500 block">
                                            {state.errors.start}
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col lg:flex-row gap-x-3 p-4">
                            <div className="lg:w-4/12"></div>
                            <div>
                                <button type="submit" className="rounded-lg py-2 px-4 bg-blue-800 text-white flex gap-3 items-center"><span><HiSave /></span>Simpan</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

        </>
    )
}