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

export default function Changepassword(props) {

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


        const result = await dispatch(LoggedAxios({ method: 'put', endpoint: `/user/changepassword`, params: {}, payloads: payloads }))
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

    useEffect(() => {
        document.title = 'Ganti Password'
    }, []) 

    return (
        <>
            <Head>
                <title>Ganti Password</title>
            </Head>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Ganti Password</h1>
                    </div>
                </div>
                <div className="flex flex-col gap-4">
                    <form onSubmit={handleSubmit}>
                        <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                            <div className="w-1/2 flex flex-col gap-3 p-4">
                                <div className="rounded-lg bg-white p-8 flex flex-col gap-4">
                                    <div className="flex flex-col gap-x-3 gap-y-1">
                                        <label className="font-bold text-xs">Password</label>
                                        <div className="flex flex-col gap-2 grow">
                                            <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nama) ? "border-red-800" : "border-gray-200"].join(" ")} name="password" placeholder="your password" type="password" onChange={handleChange} value={state.input.password} />
                                            {
                                                state.errors.password && <div className="text-red-500 block text-xs">
                                                    {state.errors.password}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-x-3 gap-y-1">
                                        <label className="font-bold text-xs">Konfirmasi Password</label>
                                        <div className="flex flex-col gap-2 grow">
                                            <input className={["grow py-2 px-4 border rounded-full placeholder:text-[#A0AEC0] col-span-4", (state.errors.nama) ? "border-red-800" : "border-gray-200"].join(" ")} name="repassword" placeholder="retype your password" type="password" onChange={handleChange} value={state.input.repassword} />
                                            {
                                                state.errors.repassword && <div className="text-red-500 block text-xs">
                                                    {state.errors.repassword}
                                                </div>
                                            }
                                        </div>
                                    </div>
                                </div>
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