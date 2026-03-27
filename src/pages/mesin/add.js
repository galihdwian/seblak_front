'use client'

import { useEffect } from "react"
import MesinForm from "./_form"

export default function InstrumenAdd(props) {
    useEffect(() => {
        document.title = 'Tambah Mesin'
    },[])
    return (
        <>
            <div className="flex flex-col gap-4 my-8">
                <div className="rounded-2xl bg-white p-4">
                    <h1 className="font-bold text-xl">Tambah Mesin</h1>
                </div>
                <div className="rounded-2xl bg-white p-4">
                    <MesinForm />
                </div>
            </div>
        </>
    )
}