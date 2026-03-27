'use client'
import { LabelStatusSetting } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { HiSearch } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function SettingData(props) {
    const { show } = props

    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/setting`, params: { show: show }, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setDatas(data.data)
        }
        setLoading(false)
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <>
            <Head>
                <title></title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Data Setting</h1>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2">
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200"><FaFilter /></button>
                    </form>
                    <div className="overflow-auto">
                        <table className="w-100 lg:w-full text-xs">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Trans Kode</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Tgl Pakai</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Ruangan</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Kamar/Nomor</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">No Pinjam</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Instrumen</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Status</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.map((v, k) => {
                                        return <tr className="border-t border-b text-xs" key={k}>
                                            <td className="p-1">{k + 1}</td>
                                            <td className="p-1">{v.trans_kode}</td>
                                            <td className="p-1">{v.tgl}</td>
                                            <td className="p-1">{v.ruang_nama}-{v.institusi_nama}</td>
                                            <td className="p-1">{v.kamar}/{v.no}</td>
                                            <td className="p-1"><Link href={{
                                                pathname: `/pinjam/view`,
                                                query: { id: v.pj_trans_kode }
                                            }} className="text-blue-600 flex gap-1 items-center" target="_blank">{v.pj_trans_kode} <HiSearch /></Link></td>
                                            <td className="p-1">
                                                <div className="flex flex-col gap-1">
                                                    <span>Jns: {v.total_jns_return}</span>
                                                    <span>Items: {v.total_itm_return}</span>
                                                </div>
                                            </td>
                                            <td className="p-1 px-1"><LabelStatusSetting status={v.status} /></td>
                                            <td className="p-1">
                                                <Link className="bg-green-500 text-white rounded p-1" href={{
                                                    pathname: `/setting/view`,
                                                    query: { id: v.trans_kode }
                                                }}><HiSearch style={{ display: 'inline' }} /></Link>
                                            </td>
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}