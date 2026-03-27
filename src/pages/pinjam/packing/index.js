import { LabelStatusPinjam } from "@/app/_bekaya/SeblakHelper";
import Loading from "@/components/loading";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import PinjamForm_Packing from "../_form_packing";
import { LoggedAxios } from "@/lib/store/features/authAction";

export default function PinjamPacking() {
    const router = useRouter()
    const { id } = router.query
    const [model, setModel] = useState([])
    const [loading, setLoading] = useState(true)
    const dispatch = useDispatch()

    const loadModel = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/pinjam/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setModel({...data.data})
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
            <Head>
                <title>Detail Peminjaman {model.pinjam?.trans_kode}</title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-row justify-between items-center min-h-10">
                        <h1 className="font-bold text-2xl">Packing Peminjaman - {model.pinjam?.trans_kode}</h1>
                        <LabelStatusPinjam status={model.pinjam?.status} />
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-4">
                    {
                        loading ? <Loading />
                            : <PinjamForm_Packing model={model} action="packing" />
                    }
                </div>
            </div>
        </>
    )
}