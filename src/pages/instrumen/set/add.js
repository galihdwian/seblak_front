'use client'

import Head from "next/head"
import InstrumenSetForm from "./_form"

export default function InstrumenSetAdd() {
    return (
        <>
            <Head>
                <title>Tambah Set Instrumen</title>
            </Head>
            <div className="flex flex-col">
                <div className="p-4 border-b bg-white">
                    <div className="flex flex-col lg:flex-row gap-2 lg:justify-between min-h-10">
                        <h1 className="font-bold text-2xl">Tambah Set Instrumen</h1>
                    </div>
                </div>
                <InstrumenSetForm action="new" />
            </div>
        </>
    )
}