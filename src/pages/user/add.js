'use client'
import UserForm from "./_form"

export default function UserAdd() {
    return (
        <>
            <div className="flex flex-col gap-4 my-8">
                <div className="rounded-2xl  p-4">
                    <h1 className="font-bold text-xl">Tambah User</h1>
                </div>
                <div className="rounded-2xl bg-white p-4">
                    <UserForm />
                </div>
            </div>
        </>
    )
}