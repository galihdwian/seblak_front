import { useStore } from "react-redux";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";

export const useAppDispatch = useDispatch.withTypes()
export const useAppSelector = useSelector.withTypes()
export const useAppStore = useStore.withTypes()