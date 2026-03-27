'use client'
import { LabelStatusReturn } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import Link from "next/link";
import { useEffect, useState } from "react";
import { HiSearch } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function ReturnData() {
    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/return`, params: {}, payloads: {} }))
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
        <div className="flex flex-col gap-4 my-8">
            <div className="my-3 rounded-lg bg-white p-4">
                <h1 className="font-bold text-2xl mb-3">Data Pengembalian</h1>
            </div>

            <div className="rounded-2xl bg-white p-4">
                <table className="w-full">
                    <thead>
                        <tr className="border-t border-b">
                            <th className="py-1 text-left">#</th>
                            <th className="py-1 text-left">Trans Kode</th>
                            <th className="py-1 text-left">Peminjaman</th>
                            <th className="py-1 text-left">Pengembalian</th>
                            <th className="py-1 text-left">Ruangan</th>
                            <th className="py-1 text-left">Kamar/Nomor</th>
                            <th className="py-1 text-left">Jml Pinjam</th>
                            <th className="py-1 text-left">Jml Kembali</th>
                            <th className="py-1 text-left">Status</th>
                            <th className="py-1 text-left">Aksi</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            datas.map((v, k) => {
                                return <tr className="border-t border-b text-xs" key={k}>
                                    <td className="py-1">{k + 1}</td>
                                    <td className="py-1">{v.trans_kode}</td>
                                    <td className="py-1">
                                        <div className="flex flex-col gap-1">
                                            <span>Tgl: {v.tgl}</span>
                                            <span>Packer: {v.packer}</span>
                                            <span>Receiver: {v.receiver}</span>
                                        </div>
                                    </td>
                                    <td className="py-1">
                                        <div className="flex flex-col gap-1">
                                            <span>Tgl: {v.tgl_return}</span>
                                            <span>Submitter: {v.submitter}</span>
                                            <span>Verifikator: {v.receiver_return}</span>
                                        </div>
                                    </td>
                                    <td className="py-1">
                                        {v.ruang_nama}-{v.institusi_nama}</td>
                                    <td className="py-1">{v.kamar}/{v.no}</td>
                                    <td className={["p-2"].join(" ")}>
                                        <div className={["flex flex-col gap-1", ((v.total_jns !== v.total_jns_return) || (v.total_itm !== v.total_itm_return)) && 'bg-red-500 text-white p-2 rounded'].join(" ")}>
                                            <span>Jns: {v.total_jns}</span>
                                            <span>Items: {v.total_itm}</span>
                                        </div>
                                    </td>
                                    <td className="py-1">
                                        <div className="flex flex-col gap-1">
                                            <span>Jns: {v.total_jns_return}</span>
                                            <span>Items: {v.total_itm_return}</span>
                                        </div>
                                    </td>
                                    <td className="py-1">
                                        <LabelStatusReturn status={v.status} />
                                    </td>
                                    <td className="py-1">
                                        <Link className="bg-green-500 text-white rounded p-1" href={{
                                            pathname: `/return/view`,
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
    )
}