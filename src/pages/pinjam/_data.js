import { LabelJenisPinjam, LabelStatusPinjam } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import { Tooltip } from "flowbite-react";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { HiPlus, HiSearch } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function PinjamData(props) {

    const { show } = props

    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const dispatch = useDispatch()
    const [state, setState] = useState({
        input: {
            jenis_pj: '',
            key: '',
            status: '',
        },
        errors: {},
    })

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

    const loadData = async () => {
        setLoading(true)
        const params = { show: show, key: state.input.key, jenis_pj: state.input.jenis_pj, status: state.input.status }
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/pinjam`, params: params, payloads: {} }))
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        loadData();
    }

    useEffect(() => {
        loadData()
    }, [])

    return (
        <>
            <Head>
                <title>Data Peminjaman/Pengembalian</title>
            </Head>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Data Peminjaman/Pengembalian</h1>
                        <div>
                            <Link className="rounded-xl bg-green-800 text-white px-4 py-2 items-center flex flex-row gap-2" href={`/pinjam/new`}><span><HiPlus /></span> Tambah</Link>
                        </div>
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2" onSubmit={handleSubmit}>
                        <select className={["p-2 border rounded-lg bg-transparent", (state.errors.jenis_pj) ? "border-red-800" : "border-gray-200"].join(" ")} name="jenis_pj" type="text" onChange={handleChange} value={state.input.jenis_pj}>
                            <option value="">- pilih jenis -</option>
                            <option value="IRU">Insrumental</option>
                            <option value="AHP">AHP & Linen</option>
                        </select>
                        <select className={["w-56 p-2 border rounded-lg bg-transparent", (state.errors.status) ? "border-red-800" : "border-gray-200"].join(" ")} name="status" type="text" onChange={handleChange} value={state.input.status}>
                            <option value="">- pilih status -</option>
                            <option value="1">Permintaan Baru</option>
                            <option value="2">Dipacking</option>
                            <option value="3">Selesai Packing A1</option>
                            <option value="4">Diverifikasi B1/ Selesai (AHP)</option>
                            <option value="5">Dikembalikan B2</option>
                            {
                                show === 'all' && <option value="6">Selesai A2</option>
                            }                            
                        </select>
                        <input type="text" className="p-2 border rounded-lg" placeholder="Cari..." name="key" onChange={handleChange} value={state.input.key} />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200"><FaFilter /></button>
                    </form>
                    <div className="overflow-auto">
                        <table className="table-fixed w-100 lg:table-auto lg:w-full text-xs">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="px-1 py-2 text-left bg-gray-50 w-[60px]">#</th>
                                    <th className="px-1 py-2 text-left bg-gray-50 w-[80px]">Jenis</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Kode Regist</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Tgl Pakai</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Ruangan</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Kamar / Nomor</th>
                                    <th className="px-1 py-2 text-left bg-gray-50 w-[100px]">Instrumen</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Status</th>
                                    <th className="px-1 py-2 text-left bg-gray-50">Aksi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.length ? <>
                                        {
                                            datas.map((v, k) => {
                                                return <tr className="border-t border-b" key={k}>
                                                    <td className="p-1">{k + 1}</td>
                                                    <td className="p-1"><LabelJenisPinjam jenis={v.jenis_pj} /></td>
                                                    <td className="p-1">{v.trans_kode}</td>
                                                    <td className="p-1">{v.tgl}</td>
                                                    <td className="p-1">{v.ruang_nama} / {v.institusi_nama}</td>
                                                    <td className="p-1">{v.kamar} / {v.no}</td>
                                                    <td className="p-1 truncate overflow-hidden ...">
                                                        <Tooltip content={v?.list_instrument.join(", ")} placement="top" animation="duration-150" trigger="click" arrow={false}
                                                            theme={
                                                                {
                                                                    content: "max-w-[400px] break-all whitespace-normal"
                                                                }
                                                            }
                                                        >
                                                            <button className="w-24"><span className="">{v?.list_instrument.join(", ")}</span></button>
                                                        </Tooltip>
                                                    </td>
                                                    <td className="p-1 px-1"><LabelStatusPinjam jenis={v.jenis_pj} status={v.status} /></td>
                                                    <td className="p-1 flex gap-1">
                                                        <Link className="bg-green-500 text-white rounded p-1" href={{
                                                            pathname: `/pinjam/view`,
                                                            query: { id: v.trans_kode }
                                                        }}><HiSearch style={{ display: 'inline' }} /></Link>
                                                    </td>
                                                </tr>
                                            })
                                        }
                                    </> : <>
                                        <tr><td colSpan="9" width="100%" className="text-center py-2">- no data -</td></tr>
                                    </>
                                }

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}