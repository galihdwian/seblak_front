import { Tooltip } from "flowbite-react"
import { HiClipboardList, HiExclamation, HiSearchCircle } from "react-icons/hi"

export default function PinjamFormIruNew(props) {
    const { action, model, state, instrumen, totalCekList, handleCheckItem, handleChangeAmt, handleOpenModalSet, handleAutoFill } = props
    return (
        <div className="flex flex-col gap-2 max-h-[400px] py-2">
            <div className=" overflow-auto">
                <table className="w-full text-xs">
                    <thead>
                        <tr className="border-y border-gray-300">
                            <th className="px-1 py-1 text-left w-[40px]">#</th>
                            <th className="px-1 py-1 text-left sticky left-0 bg-gray-200">Nama</th>
                            <th className="px-1 py-1 text-left">Jenis</th>
                            <th className="px-1 py-1 text-left">No Katalog</th>
                            <th className="px-1 py-1 text-left">Brand</th>
                            <th className="px-1 py-1 text-right min-w-[100px] lg:w-[100px]">Jumlah</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            instrumen.length > 0 ? <>
                                {
                                    instrumen
                                        .filter((v) => (v.flag === 'list'))
                                        .filter((v) => {
                                            return (v.nama.toString().toLowerCase().indexOf(state.input.filter_list.toString().toLowerCase()) >= 0)
                                                || (v.no_katalog.toString().toLowerCase().indexOf(state.input.filter_list.toString().toLowerCase()) >= 0)
                                                || (v.brand.toString().toLowerCase().indexOf(state.input.filter_list.toString().toLowerCase()) >= 0)
                                        })
                                        .map((v, k) => {
                                            return <>
                                                <tr className="border-y border-gray-300" key={k}>
                                                    <td className="px-1 py-1 text-left"><input type="checkbox" name="chk_list" onChange={handleCheckItem('list', v.id)} /></td>
                                                    <td className="px-1 py-1 sticky left-0 bg-gray-200">
                                                        <div className="flex gap-2 items-center ">
                                                            {
                                                            v.jenis === 'set' ? <span className="flex items-center gap-2">{v.nama} <span className="text-red-500" onClick={() => handleOpenModalSet(v.id)}><HiSearchCircle /></span></span>
                                                                : <>{v.nama}</>
                                                        }
                                                        {
                                                            state.errors[`list-${k}-nama`] && <>
                                                                <Tooltip content={state.errors[`list-${k}-nama`]}>
                                                                    <button className="text-red-500"><HiExclamation /></button>
                                                                </Tooltip>
                                                            </>
                                                        }
                                                        </div>
                                                        
                                                    </td>
                                                    <td className="px-1 py-1">{v.jenis}</td>
                                                    <td className="px-1 py-1">{v.no_katalog}</td>
                                                    <td className="px-1 py-1">{v.brand}</td>
                                                    <td className="px-1 py-1 flex gap-2 items-center">
                                                        {
                                                            state.errors[`list-${k}-amt`] && <>
                                                                <Tooltip content={state.errors[`list-${k}-amt`]}>
                                                                    <button className="text-red-500"><HiExclamation /></button>
                                                                </Tooltip>
                                                            </>
                                                        }
                                                        <input className={["rounded w-full py-1 px-1 text-xs text-right border", (state.errors[`list-${k}-amt`]) ? 'border-red-500' : 'border-gray-200'].join(" ")} type="number" min="0" step="1" value={v.amt} onChange={handleChangeAmt(v.id)} />

                                                    </td>
                                                </tr>
                                            </>
                                        })
                                }
                            </> : <tr>
                                <td colSpan="5" className="text-center italic py-2">- no data -</td>
                            </tr>
                        }
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={5} className="px-1 py-1 font-bold">Total</td>
                            <td className="px-1 py-1 text-right">
                                <input type="number" className="border-gray-200 rounded w-full text-right text-sm py-1 px-1 border" value={totalCekList} readOnly />
                            </td>
                        </tr>
                    </tfoot>
                </table>
                {
                    state.errors['list'] && <div className="text-red-500 block text-sm my-2">
                        {state.errors['list']}
                    </div>
                }
            </div>

            <div className="ms-auto me-0">
                <button onClick={handleAutoFill} type="button" className="flex items-center gap-2 text-sm rounded-full bg-amber-600 text-white border-gray-400 py-1 px-4"><HiClipboardList style={{ display: 'inline' }} /> Auto Fill</button>
            </div>
        </div>
    )
}