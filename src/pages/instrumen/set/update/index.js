'use client'
import { LoggedAxios } from "@/lib/store/features/authAction"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import InstrumenSetForm from "../_form"

export default function InstrumenSetUpdate() {
    const router = useRouter()
    const { id } = router.query

    const [model, setModel] = useState()
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loadModel = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen/set/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setModel(data.data)
        }
    }

    useEffect(() => {
        if (id) {
            loadModel()
        }
    }, [id])

    useEffect(() => {
        if (model) {
            setLoading(false)
        }
    }, [model])

    return (
        <>
            <Head>
                <title>Update Set Instrumen</title>               
            </Head>
            <div className="flex flex-col gap-4 my-8">
                <div className="rounded-2xl  p-4">
                    <h1 className="font-bold text-xl">Update Set Instrumen</h1>
                </div>
                <div className="">
                    {
                        loading ? 'Loading data...'
                            : <InstrumenSetForm model={model} />
                    }
                </div>
            </div>
        </>
    )
}