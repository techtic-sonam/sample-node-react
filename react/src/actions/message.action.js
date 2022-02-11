import axios from 'axios'
import _ from 'lodash'
import CONFIG from '../constants/config'
import * as CONSTS from '../constants/const'
import { toast } from 'react-toastify'
import CryptoJS from 'crypto-js'
import { getDistributionContactList, getDistributionMessage } from './distribution.action'
axios.defaults.headers.post['Content-Type'] = 'application/json'

export const getUserData = () => {
  return (dispatch) => {
    dispatch({ type: CONSTS.SET_LOADING_USER_DATA, payload: true })
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    const device_num = `${CONFIG.API_URL}/accounts/${account_id}/callflows?filter_type=mainUserCallflow&filter_owner_id=${owner_id}&paginate=false`
    const username = `${CONFIG.API_URL}/accounts/${account_id}/users/${owner_id}`
    const userBlf = `${CONFIG.API_URL}/accounts/${account_id}/users/${owner_id}/presence`

    axios.all([axios.get(device_num), axios.get(username), axios.get(userBlf)]).then(
      axios.spread(async (device_num, userData, userBlf) => {
        const phone_num = []
        const call_flow = device_num.data ? device_num.data.data[0].id : ''
        let full_name = userData.data.data.first_name + ' ' + userData.data.data.last_name
        await axios
          .post(`${CONFIG.serverURL}/getassignnumbers`, { userId: owner_id, accountId: account_id })
          .then((res) => {
            if (res.status === 200) {
              if (res.data.length > 0) {
                res.data.forEach((num) => {
                  phone_num.push(num.phoneNumber)
                })
              }
            }
          })

        let user_data = {
          fullName: full_name,
          userEmail: userData.data.data.email,
        }
        let num_msg = []
        let totalMsgCount = 0
        for (let i = 0; i < phone_num.length; i++) {
          const unreadMessage = await axios.post(`${CONFIG.serverURL}/getunreadmessage`, {
            userNumber: phone_num[i],
          })
          totalMsgCount = totalMsgCount + unreadMessage.data.count
          num_msg.push({ number: phone_num[i], msgCount: unreadMessage.data.count })
        }
        const numMSG = _.orderBy(num_msg, (num) => num.number)

        const userCheck = await axios.post(`${CONFIG.serverURL}/userchk`, {
          email: userData.data.data.email,
          account_id: account_id,
          userId: owner_id,
          userName: full_name,
          fcmToken: '',
        })

        let phoneNumbers = {
          savedNumber: userCheck.data.phoneNumber,
          numberList: numMSG,
          styleMode: userCheck.data.style_mode ? userCheck.data.style_mode : 'light',
          emailAlert: userCheck.data.emailAlert,
          soundAlert: userCheck.data.soundAlert,
          userBlf: userBlf.data,
          totalMsgCount: totalMsgCount,
          callFlowID: call_flow,
          isAdmin: userData.data.data.priv_level === 'admin' ? true : false,
          avatar: userCheck.data.avatar,
          port_pin: userCheck.data?.port_pin,
          port_pin_date: userCheck.data?.port_pin_date,
          sip_username: userCheck.data?.sip_username,
          sip_password: userCheck.data?.sip_password,
        }
        dispatch({
          type: CONSTS.CLIO_SYNC_STATE,
          payload: userCheck.data.clio_state,
        })
        dispatch({
          type: CONSTS.CLIO_AUTH_TOKEN,
          payload: userCheck.data.clio_auth,
        })
        dispatch({
          type: CONSTS.GET_USER_NUMBER,
          payload: phoneNumbers,
        })
        dispatch({ type: CONSTS.GET_USER_DATA, payload: user_data })
        dispatch({ type: CONSTS.SET_LOADING_USER_DATA, payload: false })
      }),
    )
  }
}
export const sendMessage = (toNumber, fromNumber, text, sender, uploadImgName, tab, scheduleData) => {
  return async (dispatch, getState) => {
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const { message } = getState()
    const { assignedMember } = message
    let data = {
      toNumber: toNumber,
      fromNumber: fromNumber,
      text: text,
      uploadImgName: uploadImgName,
      sender: sender,
      accountName: account_id,
      userId: owner_id,
      scheduleData: scheduleData,
    }
    axios
      .post(`${CONFIG.serverURL}/sendnewmessages`, {
        data,
      })
      .then((res) => {
        if (res.data === 'OK') {
          if (tab !== 'favTab3') {
            setTimeout(() => dispatch(getMessage(toNumber, fromNumber, owner_id)), 2000)
            dispatch(getAllNumbers(fromNumber, sender))
          } else {
            dispatch(getAssignedMessage(assignedMember))
          }
        }
      })
  }
}

export const startConversation = (toNumber, fromNumber, text, email, sender,UplaodConversation, data) => {
  return (dispatch) => {
    let number = Array.isArray(toNumber)
    if (data) {
      if (number) {
        if (toNumber.length > 0) {
          toNumber.forEach(async (number) => {
            const uploadImgName = ''
            dispatch(sendMessage(number, fromNumber, text, email, uploadImgName, data.tab, data))
          })
          dispatch(getAllNumbers(fromNumber, email))
        }
      }
    } else {
      if (number) {
        if (toNumber.length > 0) {
          toNumber.forEach(async (number) => {
            dispatch(sendMessage(number, fromNumber, text, email, UplaodConversation))
          })
          dispatch(getAllNumbers(fromNumber, email))
        }
      } else {
        dispatch(sendMessage(toNumber, fromNumber, text, email, UplaodConversation))
        dispatch(getAllNumbers(fromNumber, email))
      }
    }
  }
}
export const getMessage = (toNumber, fromNumber, userId) => {
  return async (dispatch) => {
    const email = localStorage.getItem('email')
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
      }
      await axios
        .post(`${CONFIG.serverURL}/getmessages`, {
          msgData,
        })
        .then((res) => {
          dispatch(addreadConversation(fromNumber, toNumber, userId))
          dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res.data })
          dispatch({
            type: CONSTS.SMS_NOTIFICATION,
            payload: { state: false, fromNumber: '' },
          })
          dispatch(getAllNumbers(fromNumber, email))
        })
    }
  }
}
export const getPrintMessage = (toNumber, fromNumber, startDate, endDate) => {
  return async (dispatch) => {
    const msgData = {
      fromNumber: fromNumber,
      toNumber: toNumber,
      startDate: startDate,
      endDate: endDate,
    }

    await axios
      .post(`${CONFIG.serverURL}/getprintmessages`, {
        msgData,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res.data })
      })
  }
}
export const getAllNumbers = (userNumber, email, filter) => {
  return async (dispatch, getState) => {
    const owner_id = localStorage.getItem('user_id')
    const { message } = getState()
    const { paginationNum, unreadPaginationNum, favPaginationNum } = message

    await axios
      .post(`${CONFIG.serverURL}/getnumbers`, {
        userNumber: userNumber,
        email: email,
        userId: owner_id,
        filter: filter,
        pageNum: paginationNum,
        unreadPaginationNum: unreadPaginationNum,
        favPaginationNum: favPaginationNum,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ALL_USERS, payload: res.data })
      })
  }
}

export const saveUserNumber = (userNumber, userEmail) => {
  return async (dispatch) => {
    const owner_id = localStorage.getItem('user_id')
    await axios
      .post(`${CONFIG.serverURL}/saveusernumber`, {
        phoneNumber: userNumber,
        userId: owner_id,
      })
      .then((res) => {
        if (res.status === 200) dispatch(getUserData())
      })
  }
}
export const saveStyleMode = (mode, userEmail) => {
  return async (dispatch) => {
    await axios
      .post(`${CONFIG.serverURL}/savestylemode`, {
        styleMode: mode,
        email: userEmail,
      })
      .then((res) => {
        if (res.status === 200) dispatch(getUserData())
      })
  }
}
export const saveEmailAlert = (state, userEmail) => {
  const owner_id = localStorage.getItem('user_id')
  return async (dispatch) => {
    await axios
      .post(`${CONFIG.serverURL}/savemailalert`, {
        emailAlert: state,
        userId: owner_id,
      })
      .then((res) => {
        if (res.status === 200) dispatch(getUserData())
      })
  }
}
export const sendContact = (data) => {
  axios.post(`${CONFIG.serverURL}/sendcontact`, data).then((res) => {
    console.log(res)
  })
}

export const setMemberNum = (data) => {
  return async (dispatch) => {
    dispatch({ type: CONSTS.SET_MEM_NUMBER, payload: data })
  }
}
export const setAssignedMember = (data) => {
  return async (dispatch) => {
    dispatch({ type: CONSTS.SET_ASSIGN_MEMBER, payload: data })
  }
}

export const newMessage = (data) => {
  return (dispatch, getState) => {
    const { message } = getState()
    const { mem_number, numbers, userName, assignedMember } = message
    const { savedNumber } = numbers
    const userId = localStorage.getItem('user_id')

    if (savedNumber && data.toNumber === savedNumber) {
      dispatch(getAllNumbers(data.toNumber, userName.userEmail))
      const notifiations = { state: true, fromNumber: data.toNumber }
      dispatch({ type: CONSTS.SMS_NOTIFICATION, payload: notifiations })
      setTimeout(() => {
        if (data.fromNumber === mem_number) {
          dispatch(getMessage(data.fromNumber, data.toNumber, userId))
          dispatch(getUserData())
        }
      }, 2000)
    }
    if (Object.keys(assignedMember).length > 0) {
      if (data.toNumber === assignedMember.assigner_number) {
        dispatch(getAllNumbers(data.toNumber, assignedMember.email))
        const notifiations = { state: true, fromNumber: data.toNumber }
        dispatch({ type: CONSTS.SMS_NOTIFICATION, payload: notifiations })
        setTimeout(() => {
          if (data.fromNumber === assignedMember.assigned_number) {
            dispatch(getMessage(assignedMember.assigner_number, assignedMember.assigned_number, assignedMember.userid))
            dispatch(getAllAssignConversations(assignedMember.assigned_number, assignedMember.email))
          }
        }, 2000)
      }
    }
  }
}

export const deleteConversation = (toNumber, fromNumber, email) => {
  return async (dispatch) => {
    const userId = localStorage.getItem('user_id')
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
      }
      await axios
        .post(`${CONFIG.serverURL}/deleteconversation`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAllNumbers(fromNumber, email))
            dispatch(getMessage(fromNumber, toNumber, userId))
          }
        })
    }
  }
}

export const addFavoriteMessage = (fromNumber, toNumber, email) => {
  return async (dispatch) => {
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        email: email,
      }
      await axios
        .post(`${CONFIG.serverURL}/addfavorite`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAllNumbers(fromNumber, email))
          }
        })
    }
  }
}

export const addreadConversation = (fromNumber, toNumber, userId) => {
  return async (dispatch) => {
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        userId: userId,
      }
      await axios
        .post(`${CONFIG.serverURL}/readConversation`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAllNumbers(fromNumber, userId))
            dispatch(getUserData())
          }
        })
    }
  }
}
export const unreadConversation = (fromNumber, toNumber, userId) => {
  return async (dispatch) => {
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        userId: userId,
      }
      await axios
        .post(`${CONFIG.serverURL}/unreadConversation`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAllNumbers(fromNumber, userId))
            dispatch(getUserData())
          }
        })
    }
  }
}

export const getAssignedMessage = (member) => {
  return async (dispatch) => {
    const toNumber = member.assigned_number
    const fromNumber = member.assigner_number
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
      }
      await axios
        .post(`${CONFIG.serverURL}/getmessages`, {
          msgData,
        })
        .then((res) => {
          dispatch(addreadAssignedConversation(member))
          dispatch({ type: CONSTS.GET_ALL_ASSIGNED_MESSAGES, payload: res.data })
          dispatch({
            type: CONSTS.SMS_NOTIFICATION,
            payload: { state: false, fromNumber: '' },
          })
        })
    }
  }
}

export const readUnreadMessage = (fromNumber, toNumber, email) => {
  return async (dispatch) => {
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        email: email,
      }
      await axios
        .post(`${CONFIG.serverURL}/addfavorite`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAllNumbers(fromNumber, email))
          }
        })
    }
  }
}

export const deleteFavoriteMessage = (fromNumber, toNumber, email) => {
  return async (dispatch) => {
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        email: email,
      }
      await axios
        .post(`${CONFIG.serverURL}/deletefavorite`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAllNumbers(fromNumber, email))
          }
        })
    }
  }
}
export const addUserLabel = (email, number, label, contactID, fromNumber) => {
  return async (dispatch) => {
    const owner_id = localStorage.getItem('user_id')
    const msgData = {
      userID: owner_id,
      phoneNumber: number,
      labelName: label,
      contactID: contactID,
    }
    await axios
      .post(`${CONFIG.serverURL}/adduserlabel`, {
        msgData,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(getAllNumbers(fromNumber, email))
        }
      })
  }
}
export const getCallForward = () => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    const getCall = `${CONFIG.API_URL}/accounts/${account_id}/users/${owner_id}`
    await axios.get(getCall).then((res) => {
      if (res.data)
        dispatch({
          type: CONSTS.GET_CALL_FORWARD,
          payload: res.data.data,
        })
    })
  }
}

export const saveCallForward = (updateData) => {
  return async (dispatch, getState) => {
    const { call_forward } = getState().message
    call_forward.call_forward = updateData
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    const getCall = `${CONFIG.API_URL}/accounts/${account_id}/users/${owner_id}`
    await axios.post(getCall, { data: call_forward })
  }
}

export const saveVoicemailAlert = (data) => {
  return async (dispatch, getState) => {
    const { call_forward } = getState().message
    call_forward.vm_to_email_enabled = data
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    const getCall = `${CONFIG.API_URL}/accounts/${account_id}/users/${owner_id}`
    await axios.post(getCall, { data: call_forward })
  }
}

export const getDevices = () => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const deviceURL = `${CONFIG.API_URL}/accounts/${account_id}/devices?filter_owner_id=${owner_id}&paginate=false`
    await axios.get(deviceURL).then((res) => {
      dispatch({
        type: CONSTS.GET_USER_DEVICES,
        payload: res.data.data,
      })
    })
  }
}
export const getFollowDevices = (id) => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token
    const deviceURL = `${CONFIG.API_URL}/accounts/${account_id}/callflows/${id}`
    await axios.get(deviceURL).then((res) => {
      if (res.data.data && res.data.data.flow) {
        dispatch({
          type: CONSTS.GET_FOLLOW_DEVICES,
          payload: res.data.data.flow.data.endpoints,
        })
        dispatch({
          type: CONSTS.GET_NUMBER,
          payload: res.data.data,
        })
      }
    })
  }
}
export const saveSoundAlert = (state, userEmail) => {
  return async (dispatch) => {
    const owner_id = localStorage.getItem('user_id')
    await axios
      .post(`${CONFIG.serverURL}/savesoundalert`, {
        soundAlert: state,
        userId: owner_id,
      })
      .then((res) => {
        if (res.status === 200) dispatch(getUserData())
      })
  }
}

export const saveFollowMe = (endPoints) => {
  return async (dispatch, getState) => {
    const account_id = localStorage.getItem('account_id')
    const { callFlowID } = getState().message.numbers
    const { call_forward } = getState().message
    const owner_id = localStorage.getItem('user_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    const deviceURL = `${CONFIG.API_URL}/accounts/${account_id}/callflows/${callFlowID}`
    const getCall = `${CONFIG.API_URL}/accounts/${account_id}/users/${owner_id}`

    let data = {}
    if (endPoints.length > 0) {
      call_forward.smartpbx.find_me_follow_me = { enabled: true }
      await axios.post(getCall, { data: call_forward })
      await axios.get(deviceURL).then((res) => {
        if (res.data.data && res.data.data.flow) {
          data = res.data.data
          data.flow.data.endpoints = endPoints
        }
      })
      await axios.post(deviceURL, { data: data })
    } else {
      if (call_forward.smartpbx) {
        call_forward.smartpbx.find_me_follow_me = { enabled: false }
        await axios.post(getCall, { data: call_forward })
      }
    }
  }
}
export const saveNewCellPhone = (data) => {
  return async (dispatch) => {
    let newDeviceID = ''
    let resultData = {}
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const deviceURL = `${CONFIG.API_URL}/accounts/${account_id}/devices`
    await axios.put(deviceURL, { data: data }).then((res) => {
        if (res.data) {
          newDeviceID = res.data.data.id
          resultData = res.data.data
          resultData.owner_id = owner_id
          const adddeviceURL = `${CONFIG.API_URL}/accounts/${account_id}/devices/${newDeviceID}`
          axios.post(adddeviceURL, { data: resultData }).then((res) => {
            if (res.status === 200) {
              const username = res.data.data.sip.username
              const password = res.data.data.sip.password
              var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(password), `${CONFIG.secret_key}`).toString();
              dispatch(getDevices())
              dispatch(saveSip(username, ciphertext))
            }
          })
        }
    })
  }
}

export const saveSip = (username, password) => {
  return async (dispatch) => {
    const owner_id = localStorage.getItem('user_id')
    const email = localStorage.getItem('email')
    const data = {
      email: email,
      userId: owner_id,
      sip_username: username,
      sip_password: password,
    }
    const deviceURL = `${CONFIG.serverURL}/addsipcredentials`
    await axios.post(deviceURL, { data: data }).then((res) => {
      if (res.status === 200) {
        dispatch({
          type: CONSTS.SET_SIP_CREDENTIALS,
          payload: res.data.data,
        })
        dispatch(getUserData())
      }
    })
  }
}

export const getCellPhone = (id) => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const deviceURL = `${CONFIG.API_URL}/accounts/${account_id}/devices/${id}`
    await axios.get(deviceURL).then((res) => {
      if (res.data) {
        const deviceNumber = res.data.data.call_forward.number
        const deviceName = res.data.data.name
        const cellPhoneVoicemail = res.data.data.call_forward.require_keypress
        const keepCallerID = res.data.data.call_forward.keep_caller_id
        const contactList = res.data.data.contact_list.exclude

        dispatch({
          type: CONSTS.GET_DEVICES_NAME_PHONE,
          payload: {
            deviceName: deviceName,
            deviceNumber: deviceNumber,
            cellPhoneVoicemail: cellPhoneVoicemail,
            keepCallerID: keepCallerID,
            contactList: contactList,
          },
        })
      }
    })
  }
}

export const editCellPhoneData = (data, id) => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const adddeviceURL = `${CONFIG.API_URL}/accounts/${account_id}/devices/${id}`
    axios.post(adddeviceURL, { data: data }).then((res) => {
      if (res.status === 200) {
        dispatch(getDevices())
      }
    })
  }
}
export const deleteCellPhoneData = (id) => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const deviceURL = `${CONFIG.API_URL}/accounts/${account_id}/devices/${id}`
    axios.delete(deviceURL).then((res) => {
      if (res.status === 200) {
        dispatch(getDevices())
      }
    })
  }
}
export const startQuickCall = (device_id, phone_number) => {
  return (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')
    const URI = `${CONFIG.API_URL}/accounts/${account_id}/devices/${device_id}/quickcall/${phone_number}`
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token

    axios
      .get(URI)
      .then((res) => {
        console.log('res', res)
        dispatch({ type: CONSTS.GET_CALL_DETAILS, payload: res.data.data })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const getAssignedConversations = () => {
  return async (dispatch, getState) => {
    const { message } = getState()
    const { assignPaginationNum } = message
    const owner_id = localStorage.getItem('user_id')
    await axios
      .post(`${CONFIG.serverURL}/getassignednumbers`, {
        userId: owner_id,
        assignPaginationNum: assignPaginationNum,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ALL_ASSIGNED_NUMBERS, payload: res.data })
      })
  }
}

export const assignConversationToUser = (users, userData) => {
  return async (dispatch, getState) => {
    const { numbers, userName } = getState().message
    const usersData = []
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    users &&
      users.forEach((user) => {
        if (user.state === true) {
          const obj = {
            assigner_email: userData.assigner_email,
            assigner_number: userData.assigner_number,
            assigner_userid: owner_id,
            assigned_email: user.email,
            assigned_number: userData.assigned_number,
            account_id: account_id,
            assigned_userid: user.userId,
            assigner_name: userName.fullName,
            assigned_name: user.userName,
          }
          usersData.push(obj)
        }
      })
    await axios
      .post(`${CONFIG.serverURL}/assignconversationtouser`, {
        usersData: usersData,
        userData: userData,
      })
      .then(async (res) => {
        dispatch(getAssignedConversations())
        dispatch({ type: CONSTS.GET_ASSIGN_CONVERSATION, payload: res.data })
        dispatch(getAssignConversation(userData.assigned_number, userData.assigner_number, userData.assigner_userid))
        dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail))
      })
  }
}

export const getAssignConversation = (toNumber, fromNumber, userId) => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    await axios
      .post(`${CONFIG.serverURL}/getassignconversation`, {
        assigner_number: fromNumber,
        assigned_number: toNumber,
        account_id: account_id,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ASSIGN_CONVERSATION, payload: res.data })
        dispatch(getAllAssignConversations(toNumber, fromNumber, userId))
      })
  }
}
export const getAllAssignConversations = (toNumber, fromNumber, userId) => {
  return async (dispatch) => {
    const account_id = localStorage.getItem('account_id')
    await axios
      .post(`${CONFIG.serverURL}/getassignconversations`, {
        assigner_userid: userId,
        assigner_number: fromNumber,
        account_id: account_id,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ASSIGN_CONVERSATIONS, payload: res.data })
      })
    await axios
      .post(`${CONFIG.serverURL}/getassignconversationslog`, {
        assigned_number: toNumber,
        assigner_number: fromNumber,
        account_id: account_id,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ASSIGN_CONVERSATIONS_LOGS, payload: res.data })
      })
  }
}

export const assignConversationToFavorite = (fromNumber, toNumber, email) => {
  return async (dispatch) => {
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        email: email,
      }
      await axios.post(`${CONFIG.serverURL}/addfavorite`, {
        msgData,
      })
    }
  }
}

export const removeAssignedConversationToUser = (fromUser, toNumber) => {
  return async (dispatch) => {
    if (fromUser && toNumber) {
      await axios.post(`${CONFIG.serverURL}/removeassignedconversationtouser`, {
        fromUser: fromUser,
        toNumber: toNumber,
      })
    }
  }
}
export const addreadAssignedConversation = (member) => {
  return async (dispatch) => {
    const toNumber = member.assigned_number
    const fromNumber = member.assigner_number
    const userId = member.assigner_userid
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        userId: userId,
      }
      await axios
        .post(`${CONFIG.serverURL}/readConversation`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAssignedConversations())
          }
        })
    }
  }
}
export const unreadAssignedConversation = (member) => {
  return async (dispatch) => {
    const toNumber = member.assigned_number
    const fromNumber = member.assigner_number
    const userId = member.assigner_userid
    if (toNumber && fromNumber) {
      const msgData = {
        fromNumber: fromNumber,
        toNumber: toNumber,
        userId: userId,
      }
      await axios
        .post(`${CONFIG.serverURL}/unreadConversation`, {
          msgData,
        })
        .then((res) => {
          if (res.status === 200) {
            dispatch(getAssignedConversations())
          }
        })
    }
  }
}

export const getAllCalls = () => {
  return (dispatch) => {
    let account_id = localStorage.getItem('account_id')
    const auth_token = localStorage.getItem('token')
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token
    const URL = `${CONFIG.API_URL}/accounts/${account_id}/cdrs/interaction?paginate=false`

    axios.get(URL).then((res) => {
      dispatch({ type: CONSTS.GET_ALL_CALLS, payload: res.data.data })
    })
  }
}

export const updateContact = (
  name,
  company,
  email,
  street,
  street2,
  city,
  zip,
  state,
  phoneNum,
  contactNumberList,
  fromNumber,
  contactID,
  userID,
  isAdd
) => {
  return async (dispatch) => {
    const msgData = {
      name: name,
      company: company,
      email: email,
      street: street,
      street2: street2,
      city: city,
      zip: zip,
      state: state,
      phoneNum: phoneNum,
      contactNumberList: contactNumberList,
      contactID: contactID,
      userID: userID,
    }
    await axios
      .post(`${CONFIG.serverURL}/updatecontactinformation`, {
        msgData,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(getAllContacts(userID))
          dispatch(getAllNumbers(fromNumber, userID))
          dispatch(getDistributionContactList(userID))
          if (contactID){
            dispatch(getAllContactsById(contactID))
          }
          toast.success(`Contact updated successfully`, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }else {
          toast.warn(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
      })
  }
}

export const deleteContact = (id,cb) => {
  return async (dispatch) => {
    const userID = localStorage.getItem('user_id')
    await axios
      .post(`${CONFIG.serverURL}/deletecontact`, {
        id: id,
      })
      .then((res) => {
        if (res.status === 200) {
          dispatch(getAllContacts(userID))
          toast.success(`Contact deleted successfully`, {
            position: toast.POSITION.TOP_RIGHT,
          })

        } else {
          toast.warn(res.data.message, {
            position: toast.POSITION.TOP_RIGHT,
          })
        }
      })
  }
}

export const getAllContacts = (userId) => {
  return async (dispatch) => {
    await axios
      .post(`${CONFIG.serverURL}/getcontacts`, {
        userId: userId,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ALL_CONTACTS, payload: res.data })
      })
  }
}



export const getAllContactsById = (contact_id) => {
  return (dispatch) => {
    axios
        .post(`${CONFIG.serverURL}/getcontactsById`, { contactId: contact_id})
      .then((res) => {
        dispatch({ type: CONSTS.GET_ALL_CONTACTS_BYID, payload: res.data })
      })
      .catch((error) => {
        console.log('error', error)
      })
  }
}

export const syncAllContacts = (userId, accessToken) => {
  return async (dispatch) => {
    await axios
      .post(`${CONFIG.serverURL}/synccontacts`, {
        userId: userId,
        accessToken: accessToken,
      })
      .then((res) => {
        dispatch({ type: CONSTS.SYNC_ALL_CONTACTS, payload: res.data })
      })
  }
}

export const getClioAuth = () => {
  return async (dispatch) => {
    axios.get(`${CONFIG.serverURL}/clioauth`).then((res) => {
      window.open(res.data, '_blank')
    })
  }
}
export const saveSyncClio = (state) => {
  return async (dispatch) => {
    const owner_id = localStorage.getItem('user_id')
    await axios
      .post(`${CONFIG.serverURL}/savecliostate`, {
        clioState: state,
        userId: owner_id,
      })
      .then((res) => {
        if (res.status === 200) dispatch(getUserData())
      })
  }
}

export const scheduleMessage = (data) => {
  return async (dispatch, getState) => {
    const owner_id = localStorage.getItem('user_id')
    const { message } = getState()
    const { assignedMember } = message
    await axios.post(`${CONFIG.serverURL}/schedulemessage`, { data }).then((res) => {
      if (res.status === 200) {
        if (data.tab !== 'favTab3') {
          dispatch(getMessage(data.to_number, data.from_number, owner_id))
        } else {
          dispatch(getAssignedMessage(assignedMember))
        }
      }
    })
  }
}

export const editScheduleMessage = (messageId, data) => {
  return async (dispatch, getState) => {
    const owner_id = localStorage.getItem('user_id')
    const { message } = getState()
    const { assignedMember } = message
    await axios.post(`${CONFIG.serverURL}/editSchedulemessage`, { id: messageId, data }).then((res) => {
      if (res.status === 200) {
        if (data.tab !== 'favTab3') {
          dispatch(getMessage(data.to_number, data.from_number, owner_id))
        } else {
          dispatch(getAssignedMessage(assignedMember))
        }
      }
    })
  }
}
export const deleteScheduleMessage = (messageId, data, distributionId) => {
  return async (dispatch, getState) => {
    const owner_id = localStorage.getItem('user_id')
    const { message } = getState()
    const { assignedMember } = message
    await axios.post(`${CONFIG.serverURL}/deleteSchedulemessage`, { id: messageId }).then((res) => {
      if (res.status === 200) {
        if (data.tab !== 'favTab3') {
          if (distributionId) {
            dispatch(getDistributionMessage(data.from_number, distributionId))
          } else {
            dispatch(getMessage(data.to_number, data.from_number, owner_id))
          }
        } else {
          dispatch(getAssignedMessage(assignedMember))
        }
      }
    })
  }
}
