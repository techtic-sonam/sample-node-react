import axios from 'axios'
import CONFIG from '../constants/config'
import * as CONSTS from '../constants/const'

axios.defaults.headers.get['Content-Type'] = 'application/json'

export const getAllUsers = () => {
  return (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')

    const URI = `${CONFIG.API_URL}/accounts/${account_id}/users`
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    axios.get(URI).then((res) => {
      dispatch({ type: CONSTS.GET_MEMBER_USERS, payload: res.data.data })
    })
  }
}

export const getActiveCallDetails = () => {
  return (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')

    const URI = `${CONFIG.API_URL}/accounts/${account_id}/channels?paginate=false`
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    axios.get(URI).then((res) => {
      dispatch({ type: CONSTS.GET_ACTIVE_CALLS, payload: res.data.data })
    })
  }
}

export const getCallHistory = (startDate, endDate) => {
  return async (dispatch) => {
    let start_timestamp = startDate + 62167219200
    let end_timestamp = endDate + 62167219200
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')

    const URI = `${CONFIG.API_URL}/accounts/${account_id}/cdrs/interaction?created_from=${start_timestamp}&created_to=${end_timestamp}&paginate=false`
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    await axios.get(URI).then((res) => {
      dispatch({ type: CONSTS.GET_CALL_HISTORY, payload: res.data.data })
    })
  }
}
export const getDevices = () => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')

    const deviceURL = `${CONFIG.API_URL}/accounts/${account_id}/devices?paginate=false`
    const deviceStatusURL = `${CONFIG.API_URL}/accounts/${account_id}/devices/status?paginate=false`
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    axios.all([axios.get(deviceURL), axios.get(deviceStatusURL)]).then(
      axios.spread(async (res, res1) => {
        const allDevice = res.data.data
        const statusDevice = res1.data.data
        for (let i = 0; i < allDevice.length; i++) {
          let device_res = allDevice[i]
          if (device_res.device_type === 'cellphone' || device_res.device_type === 'landline') {
            device_res.registered = true
          } else {
            let device = statusDevice.find((device) => {
              return device.device_id === device_res.id
            })
            if (device) {
              device_res.registered = device.registered
            } else {
              device_res.registered = false
            }
          }
        }
        dispatch({
          type: CONSTS.GET_ALL_DEVICES,
          payload: allDevice,
        })
      }),
    )
  }
}

export const getNumbers = () => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')

    const URI = `${CONFIG.API_URL}/accounts/${account_id}/phone_numbers?paginate=false`
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    await axios.get(URI).then((res) => {
      dispatch({
        type: CONSTS.GET_ALL_NUMBERS,
        payload: res.data.data.numbers,
      })
    })
  }
}

export const getAccountInfo = () => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token
    const accounts = `${CONFIG.API_URL}/accounts/${account_id}`
    await axios
      .get(accounts)
      .then((res) => {
        dispatch({ type: CONSTS.GET_ACCOUNT_DATA, payload: res.data.data })
      })
      .catch((error) => {
        if (typeof error !== 'undefined' && typeof error.response !== 'undefined' && error.response.status === 401) {
          dispatch({ type: CONSTS.FAIL_AUTH_REQUEST, payload: 'Auth_Failed' })
        }
      })
  }
}
export const getMessageReport = () => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    await axios
      .post(`${CONFIG.serverURL}/getmessagereport`, {
        accountName: account_id,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_MESSAGE_REPORT, payload: res.data })
      })
  }
}

export const getTopSenders = () => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    await axios
      .post(`${CONFIG.serverURL}/gettopsender`, {
        accountName: account_id,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_TOP_SENDER, payload: res.data })
      })
  }
}
