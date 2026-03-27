import { API_BASE_URL, COOKIE_NAME } from "@/app/_bekaya/app.constans";
import { encrypt, getUserdata } from "@/app/_bekaya/SeblakHelper";
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { deleteCookie, setCookie } from "cookies-next";

export const initUserdata = createAsyncThunk(
    'user/inituserdata',
    async () => {
        const savedData = await getUserdata()
        return savedData
    },
)

export const clearUserdata = createAsyncThunk(
    'user/clearuserdata',
    async (data) => {
        await deleteCookie(COOKIE_NAME)
        return true
    },
)

export const saveUserdata = createAsyncThunk(
    'user/saveuserdata',
    async (data) => {
        /* set cookie */
        const jsonString = JSON.stringify(data);
        const encryptData = encrypt(jsonString);
        await setCookie(COOKIE_NAME, encryptData);
        return data
    }
)

export const login = createAsyncThunk(
    'user/auth',
    async ({ email, password }, { rejectWithValue }) => {
        return await axios.post(API_BASE_URL + '/user/auth', { email: email, password: password })
            .then(async (resp) => {
                const { status, response, data } = resp
                if (status === 200) {
                    return data
                } else {
                    return (data)
                }
            })
            .catch((error) => {
                if (error.response && error.response.data.responseMessage) {
                    return rejectWithValue(error.response.data)
                } else {
                    return rejectWithValue(error.message)
                }
            });
    }
)

export const LoggedAxios = createAsyncThunk(
    'apiReq/logged',
    async ({ method, endpoint = '', payloads = {}, params = {}, config = {} }, { rejectWithValue }) => {
        const savedData = await getUserdata()

        let newHeaders = {
            'Authorization': savedData?.token
        }
        Object.keys(config).map((key) => {
            if (key === 'headers') {
                Object.keys(config.headers).map((kkey) => {
                    newHeaders[kkey] = config.headers[kkey]
                })
            }
        })

        let newConfig = config
        if (typeof (config['responseType']) === 'undefined') {
            newConfig['responseType'] = "json"
        }
        newConfig.url = API_BASE_URL + endpoint
        newConfig.data = payloads
        newConfig.method = method
        newConfig.headers = newHeaders
        newConfig.params = params
        newConfig.timeout = 30000
        return axios(newConfig)
            .then(async (resp) => {
                const { status, data } = resp
                if (data?.responseCode === "009") {
                    await deleteCookie(COOKIE_NAME)
                    data.data = {}
                    return resp
                } else {
                    return resp
                }
            })
            .catch(async (error) => { 
                
                if (newConfig['responseType'] === 'blob') {
                    return error.response
                } else {
                    if (axios.isCancel(error)) {
                    return ({
                        data: { responseCode: '011', responseMessage: error.message }
                    })
                } else if (error.response && error.response.data.responseMessage) {
                    const { data } = error.response
                    if (data?.responseCode === '009') {
                        await deleteCookie(COOKIE_NAME)
                    }
                    return data
                } else {
                    return ({
                        data: { responseCode: '006', responseMessage: error.message }
                    })
                }
                }

                
            });
    }
)