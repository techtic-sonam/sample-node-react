import * as CONSTS from '../constants/const'

let defaultState = {
  devices: [],
  users: [],
  calls: [],
  callHistory: [],
  numbers: [],
  callHistoryDetails: [],
  accountInfo: [],
  getTopSender: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case CONSTS.GET_MEMBER_USERS:
      return { ...state, users: action.payload }
    case CONSTS.GET_ALL_DEVICES:
      return { ...state, devices: action.payload }
    case CONSTS.GET_ACTIVE_CALLS:
      return { ...state, calls: action.payload }
    case CONSTS.GET_CALL_HISTORY:
      return { ...state, callHistory: action.payload }
    case CONSTS.GET_ALL_NUMBERS:
      return { ...state, numbers: action.payload }
    case CONSTS.GET_CALL_HISTORY_DETAILS:
      return { ...state, callHistoryDetails: action.payload }
    case CONSTS.GET_ACCOUNT_DATA:
      return { ...state, accountInfo: action.payload }
    case CONSTS.GET_MESSAGE_REPORT:
      return { ...state, messageReport: action.payload }
      case CONSTS.GET_TOP_SENDER:
      return { ...state, getTopSender: action.payload }
    default:
      return state
  }
}
