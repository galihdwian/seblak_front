'use client'

import { StripEmpty } from "@/app/_bekaya/BekayaHelper";
import { LabelStatusSetting } from "@/app/_bekaya/SeblakHelper";
import { LoggedAxios } from "@/lib/store/features/authAction";
import { error, success } from "@/lib/store/features/messageSlice";
import PinjamFormIruPacking from "@/pages/pinjam/_form_daftar_iru_packing";
import dayjs from "dayjs";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FaCheckDouble, FaSpinner } from "react-icons/fa6";
import { HiCheck } from "react-icons/hi";
import { useDispatch } from "react-redux";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

export default function SettingView() {

    const router = useRouter()
    const { id } = router.query

    const [state, setState] = useState({
        input: { receiver: '', time_receive: new Date().toDateString(), status: '', filter: '' },
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)

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

    const [model, setModel] = useState([])
    const [modelPinjam, setModelPinjam] = useState([])
    const [retModel, setRetModel] = useState({})
    const [loading, setLoading] = useState(false)
    const [instrumen, setInstrumen] = useState([])
    const [swalProps, setSwalProps] = useState({
        title: '',
        text: '',
    })

    const loadModel = async () => {
        setLoading(true)
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/setting/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setModel(data.data.setting)
            const pinjam = await loadPinjam(data.data.setting?.pj_trans_kode);
            if (pinjam) {
                setModelPinjam(pinjam)
            }
        }
        setLoading(false)
    }

    const loadPinjam = async (id) => {
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
            let newData = []
            data.data.detail.map((v, k) => {
                let item = { ...v }
                item.flag = 'list'
                item.amt_sett = v.amt_b2
                newData.push(item)
            })
            setInstrumen(newData)
            return data.data
        }
        return false
    }

    useEffect(() => {
        if (id) {
            loadModel()
        }
    }, [id])

    const [openModel, setOpenModal] = useState(false)

    const setOpenModalStatus = async (status) => {
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                status: status
            }
        }))
        loadMesin()
    }

    const setCloseModalStatus = () => {
        setState((prevState) => ({
            ...prevState,
            input: {
                ...prevState.input,
                status: ''
            }
        }))
        setOpenModal(false)
    }

    useEffect(() => {
        if (state.input.status) {
            setOpenModal(true)
        }
    }, [state.input.status])

    const submitStatus = async () => {
        setSubmitting(true)
        const payload = {
            mesin: state.input.mesin,
            clean_man: state.input.clean_man,
            start_time: state.input.start_time,
            end_time: state.input.end_time,
            status: state.input.status
        }

        const result = await dispatch(LoggedAxios({ method: 'put', endpoint: `/setting/status/${id}`, params: {}, payloads: payload }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            await loadModel()
            setCloseModalStatus()
        } else {

            if (errors) {
                setState((prevState) => ({
                    ...prevState,
                    errors: errors
                }))
            }

        }
        setSubmitting(false)
    }

    const handleSubmitDiterima = async () => {
        await submitStatus();
    }

    const [mesins, setMesins] = useState([])
    const loadMesin = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/mesin`, params: { status: '1' }, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setMesins(data.data)
        } else {
            setMesins([])
        }

    }

    const handleChangeAmt = (id, ptgs) => (e) => {
        let { name, value } = e.target
        let lastState = { ...listAmt }
        if (ptgs) {
            name = `amt_${ptgs}`
        } else {
            name = 'amt'
        }
        lastState[id] = {
            ...lastState[id],
            [name]: parseInt(value)
        }
        setListAmt({ ...lastState })
        CalcuTotalCL([])
    }


    const [totalCekList, setTotalCekList] = useState(0)
    const CalcuTotalCL = async (instrumen) => {
        let totalCL = 0
        await Promise.all(
            instrumen.map((v, k) => {
                if (v.flag === 'list') {
                    totalCL += (v.amt * 1)
                }
            })
        )
        setTotalCekList(totalCL)
        return totalCL

    }

    const dispatch = useDispatch()

    const submit = async (payload) => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        const payloads = { ...state.input, ...payload }
        delete payloads['filter_list']
        delete payloads['filter_pick']

        let list = Object.keys(listAmt).map((key) => {
            return listAmt[key]
        })

        payloads.list = list

        let method = 'PUT'
        let endpoint = `/setting/status/${model.trans_kode}`

        const result = await dispatch(LoggedAxios({ method: method, endpoint: endpoint, params: {}, payloads: payloads }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            dispatch(success(data.responseMessage))
            loadModel()
        } else {


            if (errors) {

                let newErrors = {}

                Object.keys(errors).map((key) => {
                    if (key.indexOf('list') >= 0) {
                        const splitKey = key.split("-")
                        const addedKey = [splitKey[0], list[splitKey[1]].instrumen, splitKey[2]].join("-")
                        newErrors = {
                            ...newErrors,
                            [addedKey]: errors[key]
                        }
                    } else {
                        newErrors = {
                            ...newErrors,
                            [key]: errors[key]
                        }
                    }
                })

                setState((prevState) => ({
                    ...prevState,
                    errors: newErrors
                }))

            }
            dispatch(error(data.responseMessage))
        }
        setSubmitting(false)
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        submit();
    }
    const showSwal = (props) => {
        return withReactContent(Swal).fire({
            ...props
        })
    }



    const handleUpdateStatus = async (status) => {
        showSwal({
            ...swalProps,
            title: 'Please wait',
            html: <div>
                <FaSpinner className="animate-spin mr-2" style={{ display: 'inline' }} />
                Submitting
            </div>,
            showConfirmButton: false,
        })

        const payload = {
            status: status
        }
        const data = await submit(payload)
        withReactContent(Swal).close()
    }

    const [listAmt, setListAmt] = useState({})
    useEffect(() => {
        if (instrumen) {
            let list = {}

            instrumen.map((v, k) => {
                if (v.jenis === 'pcs') {
                    list[v.id] = ({
                        instrumen: v.id,
                        amt: v.amt,
                        amt_a1: v.amt_a1,
                        amt_b1: v.amt_b1,
                        amt_b2: v.amt_b2,
                        amt_a2: v.amt_a2,
                        nama: v.nama,
                        set_nama: v.set_nama,
                    })
                } else {
                    Object.keys(v.set_list.instrumen).map((keyObj) => {
                        v.set_list.instrumen[keyObj].map((vv, kk) => {
                            list[vv.id] = ({
                                instrumen: vv.id,
                                amt: vv.amt,
                                amt_a1: vv.amt_a1,
                                amt_b1: vv.amt_b1,
                                amt_b2: vv.amt_b2,
                                amt_a2: vv.amt_a2,
                                nama: vv.nama,
                                set_nama: vv.set_nama,
                            })
                        })
                    })
                }
            })
            setListAmt(list)
        }
    }, [instrumen])



    const handleAutoFill = () => {
        const lastState = { ...listAmt }
        Object.keys(lastState).map((key) => {
            lastState[key]['amt_sett'] = lastState[key]['amt_a2'] * 1
        })
        setListAmt(lastState)
    }

    return (
        <>
            <Head>
                <title>Setting {model.trans_kode}</title>
            </Head>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-row justify-between items-center min-h-10">
                        <h1 className="font-bold text-2xl">Detail Setting {model.trans_kode}</h1>
                        <LabelStatusSetting status={model.status} />
                    </div>
                </div>
                <div className="flex flex-col gap-4 p-4">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 my-8" >
                        <div className="rounded-xl bg-white p-4">
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-5/12 text-xs font-bold">Petugas Setting</label>
                                <span><StripEmpty value={model.clean_man} /></span>
                            </div>
                        </div>
                        <div className="rounded-2xl bg-white p-4">
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Tanggal Pakai</label>
                                <span>{dayjs(modelPinjam.pinjam?.tgl).format('DD MMMM YYYY')}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Ruangan</label>
                                <span>{modelPinjam.pinjam?.ruang_nama} - {modelPinjam.pinjam?.institusi_nama}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Kamar</label>
                                <span>{modelPinjam.pinjam?.kamar}</span>
                            </div>
                            <div className="flex flex-row gap-x-3 gap-y-1">
                                <label className="lg:w-4/12 text-xs font-bold">Nomor</label>
                                <span>{modelPinjam.pinjam?.nomor}</span>
                            </div>
                        </div>
                    </div>


                    <div className="rounded-lg bg-white p-4">
                        <div className="flex flex-row justify-between items-center mb-1">
                            <h3 className="font-bold text-xl mb-3">Daftar Instrumen</h3>
                        </div>
                        <PinjamFormIruPacking action={"setting"} model={modelPinjam} instrumen={instrumen} listAmt={listAmt} state={state} totalCekList={totalCekList} handleChangeAmt={handleChangeAmt} handleCheckItem={null} />
                    </div>

                    {
                        model.status === 0 && <div className="sticky bottom-0 bg-gray-100 py-4 px-2">
                            <div className="flex flex-col gap-2">
                                <div className="lg:hidden">
                                    {
                                        (Object.keys(state.errors).length > 0) && <div className="text-red-500 block text-center">
                                            Invalid input
                                        </div>
                                    }
                                </div>
                                <div className="flex flex-col lg:flex-row lg:justify-between gap-2 items-center">
                                    <button onClick={() => {
                                        showSwal({
                                            icon: 'warning',
                                            title: 'Yakin sudah disetting?',
                                            text: 'Aksi ini tidak dapat dikembalikan',
                                            showConfirmButton: true,
                                            showCancelButton: true,
                                            confirmButtonColor: "#3085d6",
                                            cancelButtonColor: "#d33",
                                            cancelButtonText: "Batal",
                                            confirmButtonText: "Ya, Sudah Sesuai",
                                        }).then((res) => {
                                            if (res.isConfirmed) {
                                                handleUpdateStatus(1)
                                            }
                                        })
                                    }} className="rounded-xl bg-blue-600 text-white px-4 py-2 items-center flex flex-row gap-2"><HiCheck /> Selesai Setting</button>
                                    <button type="button" className="rounded-full py-2 px-4 bg-yellow-800 text-white flex gap-3 items-center icon-spin" disabled={submitting} onClick={() => handleAutoFill()}>
                                        <FaCheckDouble />
                                        Auto Fill
                                    </button>

                                </div>
                            </div>
                        </div>


                    }


                </div>
            </div>


        </>

    )
}