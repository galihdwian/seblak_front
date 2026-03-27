import { StripEmpty } from "@/app/_bekaya/BekayaHelper"
import { LabelStatusUjibowie } from "@/app/_bekaya/SeblakHelper"
import { LoggedAxios } from "@/lib/store/features/authAction"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

export default function BiologicaltestView(props) {
    const router = useRouter()
    const { id } = router.query



    const [model, setModel] = useState([])
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()


    const loadModel = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/biologicaltest/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setModel(data.data.biological_ind_test)
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
                <title>Detail Uji Biological Indicator {model.mesin_nama}</title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Detail Uji Biological Indicator {model.mesin_nama}</h1>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-gray-200 min-h-screen">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className="flex flex-col rounded-xl bg-white p-4">
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Nama Mesin</div>
                                <div>{model.mesin_nama}</div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Nomor Mesin</div>
                                <div>{model.mesin_nomor}</div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Waktu Mulai</div>
                                <div><StripEmpty value={model.start} type="datetime" format={"DD-MMM-YYYY HH:mm"} /></div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Waktu Selesai</div>
                                <div><StripEmpty value={model.end} type="datetime" format={"DD-MMM-YYYY HH:mm"} /></div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Hasil</div>
                                <div>{model.hasil}</div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Kertas Uji</div>
                                <div>{model.paper}</div>
                            </div>
                        </div>
                        <div className="flex flex-col rounded-xl bg-white p-4">
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Status</div>
                                <div><LabelStatusUjibowie status={model.status} /></div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Petugas Uji</div>
                                <div><StripEmpty value={model.petugas} /></div>
                            </div>
                            <div className="flex flex-row gap-2 items-center">
                                <div className="text-xs font-bold lg:w-3/12">Ins Time</div>
                                <div><StripEmpty value={model.ins_time} type="datetime" format={"DD-MMM-YYYY HH:mm"} /></div>
                            </div>
                        </div>
                    </div>


                </div>
            </div>
        </>
    )
}