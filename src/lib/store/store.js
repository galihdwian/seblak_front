import { configureStore } from "@reduxjs/toolkit"
import authReducer from "./features/authSlice"
import messageReducer from "./features/messageSlice"

export const makeStore = () => {
    return configureStore({
        reducer: { 
            message: messageReducer,
            auth: authReducer,
        }
    })
} 