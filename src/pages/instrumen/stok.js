'use client'

import { LoggedAxios } from "@/lib/store/features/authAction";
import Head from "next/head";
import { useEffect, useState } from "react";
import { FaFilter } from "react-icons/fa6";
import { useDispatch } from "react-redux";

export default function InstrumenStok(props) {

    const dispatch = useDispatch()
    const [datas, setDatas] = useState([])
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)
    const [institusi, setInstitusi] = useState([
        { institusi: 1, institusi_nama: 'RSMS' },
        { institusi: 2, institusi_nama: 'Griyatri' }
    ])

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/instrumen/stok`,  params:{},payloads:{} }))
        .then((resp) => {
          return {...resp.payload}
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

    const handleChangeAmt = (idx, institusi) => (e) => {
        const { name, value } = e.target
        let lastState = [...datas]
        if (idx >= 0) {
            if (!lastState[idx].amt) {
                lastState[idx].amt = {}
            }
            lastState[idx].amt[institusi] = value
        }
        setDatas(lastState)
    }

    const submit = async () => {
        setSubmitting(true)
        let payloads = []

        datas.map((v, k) => {
            let row = { ...v }
            delete row.nama
            delete row.no_katalog
            delete row.brand
            delete row.reuse
            payloads.push(row)
        })

        const result = await dispatch(LoggedAxios({ method: 'PUT', endpoint: `/instrumen/stok`,  params:{},payloads:{stok: payloads} }))
        .then((resp) => {
          return {...resp.payload}
        }, (error) => {
          if (error.response) {
          }
          return error.response
        })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            loadData();
        } else {
             
            if (errors) {
            }
        }
        setSubmitting(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        submit();
    }

    return (
        <>

            <Head>
                <title>Stok Instrumen</title>
            </Head>
            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Stok Instrumen</h1> 
                    </div>
                </div>
                <div className="p-4 flex flex-col gap-y-8 bg-white min-h-screen">
                    <form className="flex flex-wrap gap-2">
                        <input type="text" className="p-2 border rounded-lg grow" placeholder="Cari..." />
                        <button type="submit" className="px-4 py-2 rounded-lg bg-gray-200"><FaFilter /></button>
                    </form>
                    <div className="overflow-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-t border-b">
                                    <th className="py-1 text-left">#</th>
                                    <th className="py-1 text-left">Nama</th>
                                    <th className="py-1 text-left">No Katalog</th>
                                    <th className="py-1 text-left">Brand</th>
                                    {
                                        institusi.map((v, k) => {
                                            return <th key={k} className="py-1 text-left">{v.institusi_nama}</th>
                                        })
                                    }
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    datas.map((v, k) => {
                                        return <tr className="border-t border-b text-xs" key={k}>
                                            <td className="py-1">{k + 1}</td>
                                            <td className="py-1">{v.nama}</td>
                                            <td className="py-1">{v.no_katalog}</td>
                                            <td className="py-1">{v.brand}</td>
                                            {
                                                institusi.map((vv, kk) => {
                                                    return <td className="py-1 px-1" width="100" key={kk}>
                                                        <input className="w-full text-right py-1 border-gray-200 rounded-xl text-xs" type="number" min="0" step="1" value={v.amt?.[vv.institusi]} onChange={handleChangeAmt(k, vv.institusi)} />
                                                    </td>
                                                })
                                            }
                                        </tr>
                                    })
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className="w-3/12">
                        <button type="submit" onClick={handleSubmit} className="w-full gap-x-2 px-4 py-2 rounded-lg bg-blue-800 text-white focus:outline-0 focus:border-0" disabled={submitting}>
                            {
                                submitting ? <>Submitting...</>
                                    : <>Submit</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}