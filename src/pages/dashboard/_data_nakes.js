'use client'

import { makeKilo, StripEmpty } from "@/app/_bekaya/BekayaHelper"
import { LabelStatusPinjam } from "@/app/_bekaya/SeblakHelper"
import Loading from "@/components/loading"
import { LoggedAxios } from "@/lib/store/features/authAction"
import Link from "next/link"
import { useEffect, useState } from "react"
import { HiBookOpen, HiClipboardCheck } from "react-icons/hi"
import { useDispatch } from "react-redux"

export default function DashboardDataNakes() {

    const [dashboard, setDashboard] = useState({})
    const [submitting, setSubmitting] = useState(false)
    const [loading, setLoading] = useState(false)

    const dispatch = useDispatch()

    const loadData = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: '/dashboard' }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })

        if (result) {
            const { data, errors } = result
            if (data?.responseCode == '000') {
                setDashboard(data.data)
            }
            setLoading(false)
        }

    }

    useEffect(() => {
        loadData()
    }, [])


    const [trafficLogs, setTrafficLogs] = useState({})
    const [totalTraffic, setTotalTraffic] = useState(0)

    const loadTrafficCounter = () => {
        if (dashboard.pinjam_komp) {

            let keys = []
            let amts = []
            let percs = []
            let composed = {}
            let total = 0

            Object.keys(dashboard.pinjam_komp).forEach((k) => {
                const amt = dashboard.pinjam_komp[k]['jml']
                amts.push(amt)
                keys.push(k)
                total += amt
            })

            Object.keys(dashboard.pinjam_komp).forEach((k) => {
                const perc = dashboard.pinjam_komp[k]['jml'] / total * 100
                percs.push(perc)
            })

            let rounded = RoundPercentages(percs)
            rounded.forEach((v, k) => {
                composed[keys[k]] = {
                    amt: amts[k],
                    rounded: rounded[k]
                }
            })
            setTrafficLogs(composed)
            setTotalTraffic(total)
        }
    }
    useEffect(() => {
        loadTrafficCounter()
    }, [dashboard?.pinjam_komp])

    const PercentTraffic = (source) => {
        if (trafficLogs[source]) {
            return trafficLogs[source].rounded
        } else {
            return "0"
        }
    }

    const RoundPercentages = (dataset) => {

        const originIndex = []

        const before = [...dataset]

        // Calculate the difference from 100
        const diff = 100 - dataset.reduce((sum, value) => sum + Math.floor(value), 0);

        // Sort the dataset by the fractional part of each number in descending order, 
        // then round each number based on the difference
        const roundedPercentagesSorted = dataset
            .sort((a, b) => (a - Math.floor(a)) - (b - Math.floor(b)))

        const roundedPercentages = roundedPercentagesSorted.map((value, index) => index < diff ? Math.floor(value) + 1 : Math.floor(value));

        before.forEach((vv, kk) => {
            roundedPercentagesSorted.forEach((v, k) => {
                if (vv === v) {
                    originIndex.push(k)
                }
            })
        })

        const backRoundedPerc = []

        originIndex.forEach((k) => {
            backRoundedPerc.push(roundedPercentages[k])
        })
        return backRoundedPerc;
    }

    const AmountTraffic = (source) => {
        let amt = (trafficLogs[source]?.amt) * 1
        let total = totalTraffic * 1

        let amtK = makeKilo(amt)
        let totalK = makeKilo(total)

        amtK = amtK ? amtK : 0
        totalK = totalK ? totalK : 0

        return <span>{amtK} of {totalK}</span>
    }

    const LabelProgress = (props) => {
        let perc, className, className2, icon

        perc = Math.floor(props.progress)
        if (perc < 0) {
            className = "text-red-600"
            className2 = "bg-red-200 text-red-600"
            icon = "fas fa-arrow-down"
        } else if (perc === 0) {
            className = "text-gray-600"
            className2 = "bg-gray-200 text-gray-600"
        } else {
            className = "text-green-600"
            className2 = "bg-green-200 text-green-600"
            icon = "fas fa-arrow-up"
        }

        return <span className={[className].join(" ")}><span className={['px-1 rounded', className2].join(' ')}><i className={icon}></i> {perc}%</span> {props.label}</span>
    }

    useEffect(() => {
    })

    return (
        <>

            {
                loading ? <Loading />
                    : <div className="flex flex-col min-h-screen">
                        <div className="p-4">
                            <div className="grid grid-cols-2 gap-3">
                                <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-row gap-3 items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-gray-500 text-sm min-h-[60px] lg:min-h-[unset]">Total Peminjaman</p>
                                        <p className="text-2xl font-bold">{dashboard.pinjam_tot}</p>
                                        <p className="text-xs"></p>
                                    </div>
                                    <div className="text-gray-500 flex content-center">
                                        <div className="bg-orange-100 rounded-xl p-3">
                                            <HiBookOpen size={'2em'} />
                                        </div>
                                    </div>
                                </div>
                                <div className="p-3 bg-white border border-gray-100 rounded-2xl shadow-lg flex flex-row gap-3 items-center justify-between">
                                    <div className="flex flex-col">
                                        <p className="text-gray-500 text-sm min-h-[60px] lg:min-h-[unset]">Sedang Peminjaman</p>
                                        <p className="text-2xl font-bold">{dashboard.pinjam_trx}</p>
                                        <p className="text-xs"></p>
                                    </div>
                                    <div className="text-gray-500 flex content-center">
                                        <div className="bg-red-100 rounded-xl p-3">
                                            <HiClipboardCheck size={'2em'} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-1 gap-3">
                                <div className="bg-white p-6 rounded-2xl shadow-lg">
                                    <div className="flex flex-row gap-3 justify-between mb-4">
                                        <h3 className="text-xl font-semibold">Last 10 Peminjaman</h3>
                                        <Link className="border border-grey-800 hover:bg-gray-200 rounded-lg px-2" href={`/pinjam`}>See All</Link>
                                    </div>
                                    <table className="w-100 lg:w-full  text-xs">
                                        <thead>
                                            <tr className="border-t border-b">
                                                <th className="px-1 py-2 text-left bg-gray-50">#</th>
                                                <th className="px-1 py-2 text-left bg-gray-50">Trans Kode</th>
                                                <th className="px-1 py-2 text-left bg-gray-50">Tgl Pakai</th>
                                                <th className="px-1 py-2 text-left bg-gray-50">Ruangan</th>
                                                <th className="px-1 py-2 text-left bg-gray-50">Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                dashboard.pinjam?.length ? <>
                                                    {
                                                        dashboard.pinjam?.map((v, k) => {
                                                            return <tr className="border-t border-b" key={k}>
                                                                <td className="p-1">{k + 1}</td>
                                                                <td className="p-1">{v.trans_kode}</td>
                                                                <td className="p-1"><StripEmpty value={v.tgl} type="date" format="DD MMM YYYY" /></td>
                                                                <td className="p-1">{v.ruang_nama}-{v.institusi_nama}</td>
                                                                <td className="p-1 px-1"><LabelStatusPinjam status={v.status} /></td>
                                                            </tr>
                                                        })
                                                    }
                                                </> : <>
                                                    <tr><td colSpan="5" width="100%" className="text-center py-2">- no data -</td></tr>
                                                </>
                                            }

                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
            }



        </>
    )
}