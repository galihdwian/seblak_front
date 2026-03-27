import { LoggedAxios } from "@/lib/store/features/authAction";
import { error, success } from "@/lib/store/features/messageSlice";
import { useAppSelector } from "@/lib/store/hooks";
import Head from "next/head";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { FaSpinner } from "react-icons/fa6";
import { HiSave } from "react-icons/hi";
import { useDispatch } from "react-redux";

export default function Profile(props) {

    const router = useRouter()
    const [state, setState] = useState({
        input: {
            id: '',
            nama: '',
            institusi: '',
        },
        errors: {},
    })
    const [submitting, setSubmitting] = useState(false)
    const { } = props

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

    const dispatch = useDispatch()
    const { userdata } = useAppSelector((state) => state.auth);

    const submit = async () => {
        setSubmitting(true)
        setState((prevState) => ({
            ...prevState,
            errors: {}
        }))

        const payloads = state.input
        
        
        const result = await dispatch(LoggedAxios({ method: 'put', endpoint: `/user/profile`, params: {}, payloads: payloads }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            loadDetail()
            dispatch(success(data.responseMessage))
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        submit();
    }

    const loadDetail = async (id) => {
        const result = await dispatch(LoggedAxios({ method: 'get', endpoint: `/user/detail/${id}`, params: {}, payloads: {} }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data, errors } = result
        if (data?.responseCode == '000') {
            setState(prevState => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    ...data.data.user,
                }
            }))
        }
    }
    useEffect(() => {
        if (userdata && userdata.id) {
            loadDetail(userdata.id)
        }
    }, [userdata])

    const handleChangeChk = (e) => {
        const { name, checked } = e.target

        setState(prevState => ({
            ...prevState,
            input: {
                ...prevState.input,
                [name]: (checked * 1)
            }
        }))
    }

    useEffect(() => {
        document.title = 'My Profile'
    }, [])

    const [onUploadTempImage, setOnUploadTempImage] = useState(false)
    const handleUploadImage = async ({ name, file }) => {
        setOnUploadTempImage(false)
        const formData = new FormData()
        formData.append(name, file)
        const result = await dispatch(LoggedAxios({ method: 'post', endpoint: `/user/avatar`, payloads: formData }))
            .then((resp) => {
                return { ...resp.payload }
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })

        const { data, errors } = result
        if (data?.responseCode == '000') {
            setState(prevState => ({
                ...prevState,
                input: {
                    ...prevState.input,
                    [name]: data.data.last_uploaded
                }
            }))
            setOnUploadTempImage(false)
        } else {
            dispatch(error(data.responseMessage))
        }
        setOnUploadTempImage(false)
    }

    return (
        <>
            <Head>
                <title>My Profile</title>
            </Head>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">My Profile</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="w-1/2 flex flex-col gap-3 p-4">
                                <div className="rounded-lg bg-white p-8 flex flex-col gap-4">
                                    <div className="flex flex-col gap-x-3 gap-y-1">
                                        <label className="font-bold text-xs">Email</label>
                                        <div className="flex flex-col gap-2 grow">
                                            <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nama) ? "border-red-800" : "border-gray-200"].join(" ")} name="email" placeholder="you@example.com" type="text" onChange={handleChange} value={state.input.email} />
                                            {
                                                state.errors.email && <div className="text-red-500 block text-xs">
                                                    {state.errors.email}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-x-3 gap-y-1">
                                        <label className="font-bold text-xs">Nama Lengkap</label>
                                        <div className="flex flex-col gap-2 grow">
                                            <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.full_name) ? "border-red-800" : "border-gray-200", (state.errors.full_name) ? "border border-red-500" : ''].join(" ")} name="full_name" placeholder="Enter your name" type="text" onChange={handleChange} value={state.input.full_name} />
                                            {
                                                state.errors.full_name && <div className="text-red-500 block text-xs">
                                                    {state.errors.full_name}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-x-3 gap-y-1">
                                        <label className="font-bold text-xs">No HP</label>
                                        <div className="flex flex-col gap-2 grow">
                                            <input type="tel" name="phone" value={state.input.phone} onChange={handleChange} className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.phone) ? "border-red-800" : "border-gray-200", (state.errors.phone) ? "border border-red-500" : ''].join(" ")} placeholder={``} />
                                            {
                                                state.errors.phone && <div className="text-red-500 block text-xs">
                                                    {state.errors.phone}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="flex flex-col gap-3 p-4 items-center">
                                <label className="font-bold text-xs">Avatar</label>
                                {
                                    onUploadTempImage ? <span><i className="fa fa-spinner fa-spin"></i> Uploading...</span> : <>
                                        {
                                            state.input.avatar && <div>
                                                <img src={`${state.input.avatar}`} className="w-56 h-56 rounded-full" />
                                            </div>
                                        }
                                        <div className="flex flex-row gap-4 items-center">
                                            <FileUploader name="avatar" types={["JPG", "PNG"]} handleChange={(file) => handleUploadImage({ name: 'avatar', file: file })} />
                                        </div>
                                    </>
                                }
                            </div>
                        </div>

                        <div className="p-4">
                            <div className="flex flex-col gap-2">
                                <div>
                                    <button type="submit" className="rounded-full py-2 px-4 bg-blue-800 text-white flex gap-3 items-center icon-spin" disabled={submitting} onClick={handleSubmit}>
                                        {
                                            submitting ? <><FaSpinner className="icon-spin" /> Submitting...</>
                                                : <><span><HiSave /></span> Simpan</>
                                        }
                                    </button>
                                </div>
                                {
                                    state.errors.length > 0 && <div className="text-red-500">
                                        Perbaiki Inputan
                                    </div>
                                }
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}