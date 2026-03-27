import { LabelStatusInstrumen } from "@/app/_bekaya/SeblakHelper";
import Loading from "@/components/loading";
import { LoggedAxios } from "@/lib/store/features/authAction";
import dayjs from "dayjs";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { HiBookmarkAlt, HiHeart } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function DashboardStok(props) {

    const [datas, setDatas] = useState([])
    const [stats, setStats] = useState({})
    const dispatch = useDispatch()
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    const [state, setState] = useState({
        input: {}
    })

    const handleChange = (e) => {
        const { name, value } = e.target
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                [name]: value
            }
        }))
    }

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen/stok_dashboard`, params: state.input }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setDatas(data.data.data)
            setStats(data.data.stats)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        loadData();
    }

    return (
        <>
            <Head>
                <title>Dashboard Stok Instrumen</title>
            </Head>
            <div className="p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                    <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-row gap-3 items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-gray-500 text-sm min-h-[60px] lg:min-h-[unset]">In Use</p>
                            <p className="text-2xl font-bold">{stats.inUse}</p>
                            <p className="text-xs"></p>
                        </div>
                        <div className="text-gray-500 flex content-center">
                            <div className="bg-red-100 rounded-xl p-3">
                                <HiHeart size={'2em'} />
                            </div>
                        </div>
                    </div>
                    <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-row gap-3 items-center justify-between">
                        <div className="flex flex-col">
                            <p className="text-gray-500 text-sm min-h-[60px] lg:min-h-[unset]">Available</p>
                            <p className="text-2xl font-bold">{stats.avb}</p>
                            <p className="text-xs"></p>
                        </div>
                        <div className="text-gray-500 flex content-center">
                            <div className="bg-green-100 rounded-xl p-3">
                                <HiBookmarkAlt size={'2em'} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="p-4">
                <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
                    <select className="p-2 border rounded-lg bg-white" name="status" onChange={handleChange} value={state.input.status}>
                        <option value={''}>- status -</option>
                        <option value={'in-use'}>In Use</option>
                        <option value={'available'}>Available</option>
                    </select>
                    <select className="p-2 border rounded-lg bg-white" name="jenis" onChange={handleChange} value={state.input.jenis}>
                        <option value={''}>- jenis -</option>
                        <option value={'pcs'}>Pcs</option>
                        <option value={'set'}>Set</option>
                        <option value={'pack'}>Pack</option>
                    </select>
                    <input name="key" value={state.input.key} onChange={handleChange} type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." />
                    <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200"><FaFilter /></button>
                </form>
            </div>
            <div className="p-4">
                {
                    loading ? <Loading />
                        : (datas.length) ? <div className="flex flex-col gap-y-8 bg-white min-h-screen">
                            <div className="overflow-x-auto max-h-[calc(100%-100px)]">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-t border-b">
                                            <th className="py-1 text-left">#</th>
                                            <th className="py-1 text-left">Nama</th>
                                            <th className="py-1 text-left">Jenis</th>
                                            <th className="py-1 text-left">Exp Date</th>
                                            <th className="py-1 text-left">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            datas.map((v, k) => {
                                                return <tr className="border-t border-b text-xs" key={k}>
                                                    <td className="py-1">{k + 1}</td>
                                                    <td className="py-1">{v.nama}</td>
                                                    <td className="py-1">{v.jenis}</td>
                                                    <td className="py-1">{v.tgl_expired ? dayjs(v.tgl_expired).format('DD MMM YYYY, HH:mm') : '-'}</td>
                                                    <td className="py-1"><LabelStatusInstrumen status={v.status} /></td>
                                                </tr>
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                            : <div>- no data -</div>
                }

            </div>
        </>
    )
}