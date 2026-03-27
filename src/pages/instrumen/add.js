'use client'

import InstrumenForm from "./_form"

export default function InstrumenAdd(props) {
    return (
        <>
            <div className="flex flex-col gap-4 my-8">
                <div className="rounded-2xl bg-white p-4">
                    <h1 className="font-bold text-xl">Tambah Instrumen</h1>
                </div>
                <div className="rounded-2xl bg-white p-4">
                    <InstrumenForm />
                </div>
            </div>
        </>
    )
}