'use client'

import RuanganForm from "./_form"

export default function RuanganAdd() {
    return (
        <>
            <div className="flex flex-col gap-4 my-8">
                <div className="rounded-2xl  p-4">
                    <h1 className="font-bold text-xl">Tambah Ruangan</h1>
                </div>
                <div className="rounded-2xl bg-white p-4">
                    <RuanganForm />
                </div>
            </div>
        </>
    )
}