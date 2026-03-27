'use client'

import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { HiDatabase } from "react-icons/hi";
import { useDispatch } from "react-redux";
import ReturnForm from "../../_form";
import { LoggedAxios } from "@/lib/store/features/authAction";

export default function ReturnCreate() {
    const route = useRouter()
    const { id } = route.query
    const [model, setModel] = useState({})
    const [modelPinjam, setModelPinjam] = useState({})
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loadModel = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/return/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return {...resp.payload}
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        if (result.data?.responseCode == '000') {
            setModel(result.data.data)
            const result_pinjam = await dispatch(LoggedAxios({ method: 'get', endpoint: `/pinjam/detail/${result.data.data.return.pj_trans_kode}`, params: {}, payloads: {} }))
                .then((resp) => {
                    return {...resp.payload}
                }, (error) => {
                    if (error.response) {
                    }
                    return error.response
                })
            if (result_pinjam.data?.responseCode === '000') {
                setModelPinjam(result_pinjam.data.data)
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        if (id) {
            loadModel()
        }
    }, [id])

    return (
        <>
            <div className="flex flex-col gap-4 my-8">
                <div className="rounded-2xl bg-white p-4 flex justify-between items-center">
                    <h1 className="font-bold text-xl">Pengembalian</h1>
                    <Link className="rounded-xl bg-orange-500 text-white px-4 py-2 items-center flex flex-row gap-2" href={`/pinjam`}><span><HiDatabase /></span> Data</Link>
                </div>

                <div className="">
                    {
                        loading ? <div>Loading...</div>
                            : <>
                                {modelPinjam.pinjam?.trans_kode && <ReturnForm model={model} modelPinjam={modelPinjam} />}
                            </>
                    }

                </div>
            </div>
        </>
    )
}