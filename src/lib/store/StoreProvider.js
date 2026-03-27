import { makeStore } from "@/lib/store/store";
import { useRef } from "react";
import { Provider } from "react-redux";
import { initUserdata } from "./features/authAction";
import PrivateRoute from "@/components/PrivateRoute";

export default function StoreProvider({ children, pageProps }) {
    const storeRef = useRef(null)
    if (!storeRef.current) {
        storeRef.current = makeStore()
        storeRef.current.dispatch(initUserdata())
    }
    return <Provider store={storeRef.current}><PrivateRoute>{children}</PrivateRoute></Provider>
}