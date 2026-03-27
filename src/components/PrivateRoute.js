import { useAppSelector } from "@/lib/store/hooks";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Loading from "./loading";

export default function PrivateRoute({ children }) {
    const { isLoggedIn, isInitState } = useAppSelector((state) => state.auth)
    const router = useRouter()

    // if (!isLoggedIn) {
    //     redirect('/')
    // } 

    useEffect(() => {
        if (!isInitState && !isLoggedIn) {
            router.push(`/`)
        }
    }, [isInitState, isLoggedIn])

    return <>
        {
            isInitState ? <Loading />
                : children
        }
    </>
}