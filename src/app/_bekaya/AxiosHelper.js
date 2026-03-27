import { clearUserdata } from "@/lib/store/features/authAction";
import axios from "axios";
import { API_BASE_URL } from "./app.constans";
import { useDispatch } from "react-redux";

export const BasicAxios = async (method, endpoint = '', payloads = {}, params = {}, config = {}) => {

  let newHeaders = {};

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

  return axios(newConfig)
    .then((resp) => {
      return resp
    })
    .catch(function (error) {
      if (error.response) {
        const { response, status } = error;
        return response
      }
    });
}

export const NewBasicAxios = async (method, endpoint = '', payloads = {}, params = {}, config = {}) => (dispatch) => {


  console.log('okey')
  let newHeaders = {};

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

  dispatch(LoggedClient({ method: method, endpoint: endpoint, payloads: payloads, params: params, config: config }))
    .then((result) => {
      const { status, data } = result?.payload
      console.log('yuhu', result)
      return data
    })
}
