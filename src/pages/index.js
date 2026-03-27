'use client'

import Loading from "@/components/loading"
import { login, saveUserdata } from "@/lib/store/features/authAction"
import { success } from "@/lib/store/features/messageSlice"
import { useAppSelector } from "@/lib/store/hooks"
import { Plus_Jakarta_Sans } from "next/font/google"
import Head from "next/head"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"

const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['300', '600','800'],
})
export default function Login() {

  const [state, setState] = useState({
    input: {
      email: '',
      password: ''
    },
    errors: {}
  })
  const [submitting, setSubmitting] = useState(false)

  const router = useRouter()

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

  const { loading, isLoggedIn, isInitState } = useAppSelector((state) => state.auth)
  const dispatch = useDispatch()

  const submit = async () => {

    setSubmitting(loading)
    setState((prevState) => ({
      ...prevState,
      errors: {}
    }))

    const payloads = { ...state.input }
    dispatch(login(payloads)).then((data) => {
      const { payload } = data
      if (payload.responseCode === '000') {
        dispatch(success(payload.responseMessage))
        dispatch(saveUserdata(payload.data)).then(() => {
          router.push(`/dashboard`)
        })        
      } else {
        if (payload.errors) {
          setState((prevState) => ({
            ...prevState,
            errors: payload.errors
          }))
        }
      }
    })
    setSubmitting(loading)

  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    submit()
  }

  useEffect(() => {
    if (isLoggedIn) {
      router.push(`/dashboard`)
    }
  }, [isLoggedIn])

  return (
    <>
      {
        isInitState ? <Loading />
          : <>
            <Head>
              <title>Login - Mangan Seblak</title>
            </Head>
            <div className={["bg-stone-600/30 bg-blend-multiply bg-center bg-cover", plusJakarta.className].join(" ")} style={{backgroundImage: `url('${process.env.NEXT_PUBLIC_BASE_PATH}/images/cssd_checklist.jpg')`}}>
              <div className="px-8 lg:px-0 lg:w-4/12 mx-auto min-h-screen content-center">
                <div className="flex flex-col gap-4 bg-white/80 p-8 lg:px-[3.2rem] rounded-2xl">
                  <div className="">
                    <h1 className="text-blue-600 font-bold text-[24pt] leading-none text-center uppercase tracking-[4px]">Login</h1>
                    <h2 className="text-[20pt] text-center uppercase tracking-[4px] leading-none">Mangan Seblak</h2>
                  </div>
                  <form onSubmit={handleSubmit}>
                    <div className="flex flex-col gap-y-1 my-4">
                      <label>Username/Email</label>
                      <input className={["p-2 border border-grey-200 rounded-lg"].join(" ")} name="email" placeholder="you@example.com" type="text" onChange={handleChange} value={state.input.email} />
                      {
                        state.errors.email && <div className="text-red-500 block">
                          {state.errors.email}
                        </div>
                      }
                    </div>
                    <div className="flex flex-col gap-y-1 my-4">
                      <label>Password</label>
                      <input className={["p-2 border border-grey-200 rounded-lg"].join(" ")} name="password" placeholder="Enter your password" type="password" onChange={handleChange} value={state.input.password} />
                      {
                        state.errors.password && <div className="text-red-500 block">
                          {state.errors.password}
                        </div>
                      }
                    </div>
                    <div className="my-8">
                      <button type="submit" className="py-2 px-3 w-full bg-blue-600 text-white rounded-2xl" disabled={submitting} >
                        {
                          submitting ? <><i className="fi fi-sr-loading fi-spin"></i> Submitting...</>
                            : <>Login</>
                        }
                      </button>
                    </div>
                    <p className="text-center text-xs font-bold">Manajemen Pengawasan dan Penanganan Sistem Elektronik Sterilisasi Bersih, Logis, Akurat, dan Konsisten</p>
                  </form>
                </div>
              </div>
            </div>
          </>
      }
    </>
  )
}

Login.getLayout = function getLayout(page) {
  return <>
    <main>{page}</main>
  </>
}