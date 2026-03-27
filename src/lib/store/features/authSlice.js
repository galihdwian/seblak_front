import { createSlice } from "@reduxjs/toolkit";
import { clearUserdata, initUserdata, LoggedAxios, login, saveUserdata } from "./authAction";
import { REHYDRATE } from "redux-persist";

const initialState = {
    loading: false,
    isInitState: true,
    isLoggedIn: false,
    token: null,
    level: null,
    userdata: {},
    error: {},
    query_response: {},
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        success: (state, action) => {
            state = {
                ...state,
                isLoggedIn: true,
                level: level,
            };
        },
        failed: (state, action) => {
            state = {
                ...state,
                isLoggedIn: false,
                level: null,
            };
        },
        invalid_token: (state, action) => {

        }
    },
    extraReducers: (builder) => {
        builder.addCase(REHYDRATE, (state) => {
            if (state.userdata) {
                state.isLoggedIn = true
            }
        })
        builder.addCase(initUserdata.pending, (state, action) => {
            state = {
                ...state,
                isInitState: true
            }
        })
        builder.addCase(initUserdata.fulfilled, (state, action) => {
            const { payload } = action
            if (payload) {
                state.loading = false
                state.isLoggedIn = payload.token ? true : false
                state.token = payload.token
                state.level = payload.level
                state.userdata = payload
            }
            state.isInitState = false
        })
        builder.addCase(clearUserdata.fulfilled, (state, action) => {
            state.loading = false
            state.isLoggedIn = false
            state.token = ''
            state.level = ''
            state.userdata = {}
            state.isInitState = false
        })
        builder.addCase(saveUserdata.fulfilled, (state, action) => {
            const { payload } = action
            if (payload) {
                state.loading = false
                state.isLoggedIn = payload.token ? true : false
                state.token = payload.token
                state.level = payload.level
                state.userdata = payload
                state.isInitState = false
            }
        })
        builder.addCase(login.pending, (state, action) => {
            state = {
                ...state,
                loading: true,
                error: {}
            }
        })
        builder.addCase(login.fulfilled, (state, action) => {
        })
        builder.addCase(login.rejected, (state, action) => {
            const { payload } = action
            state = {
                ...state,
                loading: false,
                isLoggedIn: false,
                error: payload
            }
        })
        builder.addCase(LoggedAxios.fulfilled, (state, action) => { 
            state.query_response = action.payload.data
        })
        builder.addCase(LoggedAxios.rejected, (state, action) => {
            if (action.payload.data?.responseCode === "009") {
                const { payload } = action
                if (payload) {
                    state.loading = false
                    state.isLoggedIn = false
                    state.token = ''
                    state.level = ''
                    state.userdata = {}
                    state.isInitState = false
                }
            }
            state.query_response = action.payload.data
        })

    }
})

export const { success, error, clear, initializeState } = authSlice.actions;
export default authSlice.reducer;