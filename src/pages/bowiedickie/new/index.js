import Head from "next/head";
import Link from "next/link";
import { useEffect } from "react";
import { HiDatabase } from "react-icons/hi";
import BowiedickForm from "../_form";

export default function BowiedickNew() {
    useEffect(() => {
    }, [])
    return (
        <>
            <Head>
                <title>Uji Bowie Dickie Baru</title>
            </Head>
            <div className="flex flex-col">
                <div className="p-4 border-b bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Uji Bowie Dickie Baru</h1> 
                    </div>
                </div>
                
                <BowiedickForm action="new"/>
            </div>
        </>

    )
}