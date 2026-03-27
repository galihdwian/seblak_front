import { ErrorsAdaptor } from '@/app/_bekaya/BekayaHelper';
import { clearUserdata, LoggedAxios } from '@/lib/store/features/authAction';
import { clear } from '@/lib/store/features/messageSlice';
import { useAppSelector } from '@/lib/store/hooks';
import { initFlowbite } from 'flowbite';
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { useRouter } from 'next/navigation';
import { useEffect } from "react";
import { HiAdjustments, HiBeaker, HiBookOpen, HiCalculator, HiCollection, HiDatabase, HiDesktopComputer, HiHome, HiOutlineSparkles, HiShieldCheck, HiSparkles, HiUser } from "react-icons/hi";
import { useDispatch } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';
const plusJakarta = Plus_Jakarta_Sans({
    subsets: ['latin'],
    weight: ['300', '600'],
})


export default function Layout({ children }) {

    const dispatch = useDispatch()
    useEffect(() => {
        initFlowbite()
    }, [])

    const { show, type, message } = useAppSelector((state) => state.message)
    useEffect(() => {
        if (show || message) {

            const config = {
                autoClose: 2000,
                position: 'top-right',
                pauseOnFocusLoss: false,
                theme: 'colored'
            } 

            let msgToShow = ErrorsAdaptor({ errors: message }) 

            Promise.all(msgToShow.map((v, k) => {
                setTimeout(() => {
                    switch (type) {
                        case 'success':
                            toast.success(v, config) 
                            console.log('yuhu')
                            break;
                        case 'failed':
                        case 'error':
                            toast.error(v, config)
                            console.log('yuhu')
                            break;
                        case 'warn':
                            toast.warn(v, config)
                            break;
                        default:
                            break;
                    }
                }, (k * 500))
            }))
            dispatch(clear())
        }

    }, [show, message])

    const { isLoggedIn, isInitState, level, userdata } = useAppSelector((state) => state.auth)
    // useEffect(() => {
    //     if (!isLoggedIn) {
    //         router.push(`/`)
    //     }
    // },[isLoggedIn]) 

    const router = useRouter()

    const handleLogout = (e) => {
        e.preventDefault()

        logout()
    }

    const logout = async () => {
        const result = await dispatch(LoggedAxios({ method: 'post', endpoint: '/user/logout' }))
            .then((resp) => {
                return resp.payload
            }, (error) => {
                if (error.response) {
                }
                return error.response
            })
        const { data } = result
        if (data?.responseCode == '000') {
            await dispatch(clearUserdata()).then(() => {
                router.push(`/`)
            })
        }
    }

    // useEffect(() => {
    //     if (!isInitState) {
    //         if (!isLoggedIn) {
    //             router.push(`/`)
    //         }
    //     }
    // }, [isInitState, isLoggedIn])

    return (
        <>
            <div className={[plusJakarta.className, 'min-h-screen'].join(' ')}>
                <ToastContainer />
                <nav className="fixed top-0 z-50 w-full bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <div className="px-3 py-3 lg:px-5 lg:pl-3">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center justify-start rtl:justify-end">
                                <button data-drawer-target="logo-sidebar" data-drawer-toggle="logo-sidebar" aria-controls="logo-sidebar" type="button" className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
                                    <span className="sr-only">Open sidebar</span>
                                    <span className="text-xl"><HiHome /></span>
                                </button>
                                <Link href={`/dashboard`} className="flex ms-2 md:me-24">
                                    <img src="https://flowbite.com/docs/images/logo.svg" className="h-8 me-3" alt="FlowBite Logo" />
                                    <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap dark:text-white">Seblak</span>
                                </Link>
                            </div>
                            <div className="flex items-center">
                                <div className="flex items-center ms-3">
                                    <div>
                                        <button type="button" className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600" aria-expanded="false" data-dropdown-toggle="dropdown-user">
                                            <span className="sr-only">Open user menu</span>
                                            <img className="w-8 h-8 rounded-full" src="https://flowbite.com/docs/images/people/profile-picture-5.jpg" alt="user photo" />
                                        </button>
                                    </div>
                                    <div className="z-50 hidden my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-sm shadow-sm dark:bg-gray-700 dark:divide-gray-600" id="dropdown-user">
                                        <div className="px-4 py-3" role="none">
                                            <p className="text-sm text-gray-900 dark:text-white" role="none">
                                                {userdata.full_name}
                                            </p>
                                            <p className="text-sm font-medium text-gray-900 truncate dark:text-gray-300" role="none">
                                                {userdata.email}
                                            </p>
                                        </div>
                                        <ul className="py-1" role="none">
                                            <li>
                                                <Link href={`/profile`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Profil</Link>
                                            </li>
                                            <li>
                                                <Link href={`/changepassword`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Ganti Password</Link>
                                            </li>
                                            <li>
                                                <Link href={`/dashboard`} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Dashboard</Link>
                                            </li>
                                            <li>

                                                <a href="#" onClick={handleLogout} className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white" role="menuitem">Sign out</a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </nav>

                <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-[57px] transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700" aria-label="Sidebar">
                    <div className="h-full overflow-y-auto py-4 bg-white dark:bg-gray-800">
                        <ul className="space-y-1 font-medium">
                            <li>
                                <Link href={`/dashboard`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiHome /></span>
                                    <span className="ms-3">Dashboard</span>
                                </Link>
                            </li>
                            <li>
                                <Link href={`/dashboard/stok_instrumen`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiDatabase /></span>
                                    <span className="ms-3">Stok Instrumen</span>
                                </Link>
                            </li>
                        </ul>
                        <ul className="pt-4 mt-4 space-y-1 font-medium border-t border-gray-200 dark:border-gray-700">
                            <li>
                                <span className='p-3 font-bold text-sm'>Transaksi</span>
                            </li>
                            <li>
                                <Link href={`/pinjam/transac`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiBookOpen /></span>
                                    <span className="ms-3">Peminjaman/Pengembalian</span>
                                </Link>
                            </li>
                            {
                                ([0, 1, 2, 3]).indexOf(level) >= 0 && <>
                                    <li>
                                        <Link href={`/cleaning/transac`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiSparkles /></span>
                                            <span className="ms-3">Cleaning</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/setting/transac`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiAdjustments /></span>
                                            <span className="ms-3">Setting</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/steril/transac`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiShieldCheck /></span>
                                            <span className="ms-3">Sterilisasi</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/bowiedickie/transac`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiBeaker /></span>
                                            <span className="ms-3">Uji Bowie Dickie</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/biologicaltest/transac`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiOutlineSparkles /></span>
                                            <span className="ms-3">Uji Biological</span>
                                        </Link>
                                    </li>
                                </>
                            }

                        </ul>
                        <ul className="pt-4 mt-4 space-y-1 font-medium border-t border-gray-200 dark:border-gray-700">
                            <li>
                                <span className='p-3 font-bold text-sm'>Log</span>
                            </li>
                            <li>
                                <Link href={`/pinjam`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                    <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiBookOpen /></span>
                                    <span className="ms-3">Peminjaman/Pengembalian</span>
                                </Link>
                            </li>
                            {
                                ([0, 1, 2, 3]).indexOf(level) >= 0 && <>
                                    <li>
                                        <Link href={`/cleaning`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiSparkles /></span>
                                            <span className="ms-3">Cleaning</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/setting`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiAdjustments /></span>
                                            <span className="ms-3">Setting</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/steril`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiShieldCheck /></span>
                                            <span className="ms-3">Sterilisasi</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/bowiedickie`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiBeaker /></span>
                                            <span className="ms-3">Uji Bowie Dickie</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/biologicaltest`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiOutlineSparkles /></span>
                                            <span className="ms-3">Uji Biological</span>
                                        </Link>
                                    </li>
                                </>
                            }
                        </ul>
                        {
                            ([0, 1, 2]).indexOf(level) >= 0 && <>
                                <ul className="pt-4 mt-4 space-y-1 font-medium border-t border-gray-200 dark:border-gray-700">
                                    <li>
                                        <span className='p-3 font-bold text-sm'>Master</span>
                                    </li>
                                    <li>
                                        <Link href={`/user`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiUser /></span>
                                            <span className="ms-3">User</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button type="button" className="flex items-center w-full p-2 text-base text-gray-900 transition duration-75 rounded-lg group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700" aria-controls="dropdown-example" data-collapse-toggle="dropdown-example">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiCalculator /></span>
                                            <span className="flex-1 ms-3 text-left rtl:text-right whitespace-nowrap">Instrumen</span>
                                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                            </svg>
                                        </button>
                                        <ul id="dropdown-example" className="hidden py-2 space-y-1">
                                            <li>
                                                <Link href={`/instrumen`} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                                    <span className="ms-3">Pcs Instrumen</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`/instrumen/set`} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                                    <span className="ms-3">Set Instrumen</span>
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href={`/instrumen/stok`} className="flex items-center w-full p-2 text-gray-900 transition duration-75 rounded-lg pl-11 group hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700">
                                                    <span className="ms-3">Stok</span>
                                                </Link>
                                            </li>
                                        </ul>
                                    </li>

                                    <li>
                                        <Link href={`/ruangan`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiCollection /></span>
                                            <span className="ms-3">Ruangan</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <Link href={`/mesin`} className="flex px-2 py-1 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                                            <span className="text-2xl text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white"><HiDesktopComputer /></span>
                                            <span className="ms-3">Mesin</span>
                                        </Link>
                                    </li>
                                </ul>
                            </>
                        }

                    </div>
                </aside>
                <div className="sm:ml-64 pt-[57px] bg-gray-100 min-h-screen">
                    {/* <Suspense fallback={Loading}> */}
                    {children}
                    {/* </Suspense> */}
                </div>
            </div>
        </>
    )
}