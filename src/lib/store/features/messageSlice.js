import { createSlice } from "@reduxjs/toolkit";

export const messageSlice = createSlice({
    name: 'message',
    initialState: { show: false, type: 'info', message: '' },
    reducers: {
        success: (state, action) => {
            state.type = 'success'
            state.message = action.payload
            state.show = true
        },
        error: (state, action) => {
            state.type = 'error'
            state.show = true
            state.message = action.payload
        },
        clear: (state) => {
            state.show = false
            state.message = ''
        }
    }
})

export const { success, error, clear } = messageSlice.actions;
export default messageSlice.reducer;