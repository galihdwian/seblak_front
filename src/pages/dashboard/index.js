import { useAppSelector } from "@/lib/store/hooks";
import Head from "next/head";
import DashboardData from "./_data";
import DashboardDataNakes from "./_data_nakes";

export default function Dashboard() {
    const { userdata } = useAppSelector((state) => (state.auth))
    return (
        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            {
                ([0, 1, 2, 3]).indexOf(userdata.level) >= 0 && <DashboardData />
            }
            {
                ([4]).indexOf(userdata.level) >= 0 && <DashboardDataNakes />
            }
        </>
    )
}