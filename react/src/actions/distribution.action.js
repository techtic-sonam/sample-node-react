import axios from 'axios'
import * as CONSTS from '../constants/const'
import CONFIG from '../constants/config'
import { getAllNumbers } from './message.action'

export const addNewDistribution = (data) => {
  return async (dispatch) => {
    if (data.id === '') {
      await axios.post(`${CONFIG.serverURL}/addnewdistribution`, { data }).then((res) => {
        dispatch(getDistributionList())
      })
    } else {
      await axios.post(`${CONFIG.serverURL}/editdistribution`, { data }).then((res) => {
        dispatch(getDistributionList())
      })
    }
  }
}

export const delDistribution = (id) => {
  return async (dispatch) => {
    await axios.post(`${CONFIG.serverURL}/deletedistribution`, { id }).then((res) => {
      dispatch(getDistributionList())
    })
  }
}

export const getDistributionList = () => {
  return async (dispatch) => {
    const result = await axios.post(`${CONFIG.serverURL}/getdistribution`)
    if (result.status === 200) {
      dispatch({ type: CONSTS.GET_ALL_DISTRIBUTION_LIST, payload: result.data })
    } else {
      dispatch({ type: CONSTS.GET_ALL_DISTRIBUTION_LIST, payload: [] })
    }
  }
}

export const addNewContact = (data) => {
  return async (dispatch) => {
    await axios.post(`${CONFIG.serverURL}/adddistributioncontact`, { data }).then((res) => {
      dispatch(getContactList(data.distributionId))
    })
  }
}

export const editContact = (id, data) => {
  return async (dispatch) => {
    await axios.post(`${CONFIG.serverURL}/editdistributioncontact`, { id: id, data: data }).then((res) => {
      dispatch(getContactList(data.distributionId))
    })
  }
}
export const deleteContact = (id, distributionId) => {
  return async (dispatch) => {
    await axios.post(`${CONFIG.serverURL}/deletedistributioncontact`, { id }).then((res) => {
      dispatch(getContactList(distributionId))
    })
  }
}

export const getContactList = (distributionId) => {
  return async (dispatch) => {
    const result = await axios.post(`${CONFIG.serverURL}/getcontactslist`, { distributionId })
    if (result.status === 200) {
      dispatch({ type: CONSTS.GET_ALL_DISTRIBUTION_CONTACTS_LIST, payload: result.data })
    } else {
      dispatch({ type: CONSTS.GET_ALL_DISTRIBUTION_CONTACTS_LIST, payload: [] })
    }
  }
}

export const sendDistributionMessage = (text, uploadImgName, fromNumber, distributionId, scheduleData) => {
  return async (dispatch, getState) => {
    const account_id = localStorage.getItem('account_id')
    const owner_id = localStorage.getItem('user_id')
    const { distribution, message } = getState()
    const { contactsList } = distribution
    const { userName } = message

    const unscribeText = "--Reply 'STOP"

    const toNumbers = []
    if (contactsList.length > 0) {
      for (let i = 0; i < contactsList.length; i++) {
        toNumbers.push(contactsList[i].phoneNumber)
      }
      let data = {
        toNumbers: toNumbers,
        fromNumber: fromNumber,
        text: text,
        uploadImgName: uploadImgName,
        sender: userName.userEmail,
        accountName: account_id,
        userId: owner_id,
        distributionId: distributionId,
        scheduleData: scheduleData,
      }
      await axios.post(`${CONFIG.serverURL}/senddistributionmessage`, { data }).then((res) => {
        if (res.data === 'OK') {
          dispatch(getDistributionMessage(fromNumber, distributionId))
          dispatch(getAllNumbers(fromNumber, userName.userEmail))
        }
      })

      if (text.includes(unscribeText)) {
        const texts = text.split(unscribeText)

        const distributionList = distribution.allList.find(
          (list) => list._id === distributionId && texts[1].includes(list.distributionId),
        )
        if (distributionList && Object.keys(distributionList).length > 0) {
          const data = { number1: fromNumber, number2: distributionId, distributionStatus: false }
          await axios.post(`${CONFIG.serverURL}/editconversation`, { data }).then((res) => {
            dispatch(getDistributionList())
          })
        }
      }
    }
  }
}

export const getDistributionMessage = (fromNumber, distributionId) => {
  return async (dispatch) => {
    const msgData = {
      from_number: fromNumber,
      distributionId: distributionId,
    }
    await axios
      .post(`${CONFIG.serverURL}/getdistributionmessages`, {
        msgData,
      })
      .then((res) => {
        dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: res.data })
        dispatch({
          type: CONSTS.SMS_NOTIFICATION,
          payload: { state: false, fromNumber: '' },
        })
      })
  }
}

export const getDistributionContactList = () => {
  const userId = localStorage.getItem('user_id')
  return async (dispatch) => {
    const result = await axios.post(`${CONFIG.serverURL}/getdistributioncontacts`, { userID: userId })
    if (result.status === 200) {
      dispatch({ type: CONSTS.GET_ALL_DISTRIBUTION_CONTACTS, payload: result.data })
    } else {
      dispatch({ type: CONSTS.GET_ALL_DISTRIBUTION_CONTACTS, payload: [] })
    }
  }
}
