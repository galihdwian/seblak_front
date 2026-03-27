import Link from "next/link";
import { HiDatabase } from "react-icons/hi";
import { useEffect } from "react";
import PinjamForm from "./_form";
import Head from "next/head";

export default function PinjamNew() {
    useEffect(() => {
        document.title = 'Tambah Peminjaman'
    }, [])
    return (
        <>
            <Head>
                <title>Tambah Peminjaman</title>
            </Head>

            <div className="flex flex-col divide-y min-h-full">
                <div className="p-4 bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Tambah Peminjaman</h1>
                    </div>
                </div>
                <div>
                    <PinjamForm action="new" />
                </div>
            </div>
        </>
    )
}