import { FaFaceDizzy, FaSpinner } from "react-icons/fa6";

export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
        <>
            <h3 className="flex items-center gap-3"><FaSpinner className="icon-spin" /> Loading page...</h3>
        </>
    )
  }