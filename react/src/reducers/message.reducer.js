import * as CONSTS from '../constants/const'

let defaultState = {
  loading: false,
  numbers: [],
  userName: [],
  messages: [],
  members: [],
  contacts: [],
  mem_number: '',
  devices: [],
  followDevices: [],
  getNumber: [],
  notification: { state: false, fromNumber: '' },
  userDevice: {},
  assignConversation: [],
  assignConversations: [],
  assignConversationsLogs: [],
  allCalls: [],
  clioContacts: [],
  clioSyncState: false,
  clioAuthToken: {},
  assignedMember: {},
  assignedMessages: [],
  paginationNum: 0,
  unreadPaginationNum: 0,
  favPaginationNum: 0,
  assignPaginationNum: 0,
  callDetail: [],
  assignedConversations: [],
  addSip: '',
  contactsDetail: null,
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case CONSTS.GET_USER_NUMBER:
      return { ...state, numbers: action.payload }
    case CONSTS.GET_USER_DATA:
      return { ...state, userName: action.payload }
    case CONSTS.GET_ALL_MESSAGES:
      return { ...state, messages: action.payload }
    case CONSTS.GET_ALL_USERS:
      return { ...state, members: action.payload }
    case CONSTS.SET_MEM_NUMBER:
      return { ...state, mem_number: action.payload }
    case CONSTS.SMS_NOTIFICATION:
      return { ...state, notification: action.payload }
    case CONSTS.GET_CALL_FORWARD:
      return { ...state, call_forward: action.payload }
    case CONSTS.GET_USER_DEVICES:
      return { ...state, devices: action.payload }
    case CONSTS.GET_FOLLOW_DEVICES:
      return { ...state, followDevices: action.payload }
      case CONSTS.GET_NUMBER:
      return { ...state, getNumber: action.payload }
    case CONSTS.SET_LOADING_USER_DATA:
      return { ...state, loading: action.payload }
    case CONSTS.GET_DEVICES_NAME_PHONE:
      return { ...state, userDevice: action.payload }
    case CONSTS.GET_ASSIGN_CONVERSATION:
      return { ...state, assignConversation: action.payload }
    case CONSTS.GET_ASSIGN_CONVERSATIONS:
      return { ...state, assignConversations: action.payload }
    case CONSTS.GET_ASSIGN_CONVERSATIONS_LOGS:
      return { ...state, assignConversationsLogs: action.payload }
    case CONSTS.GET_ALL_ASSIGNED_NUMBERS:
      return { ...state, assignedConversations: action.payload }
    case CONSTS.GET_ALL_ASSIGNED_MESSAGES:
      return { ...state, assignedMessages: action.payload }
    case CONSTS.GET_ALL_CALLS:
      return { ...state, allCalls: action.payload }
    case CONSTS.GET_ALL_CONTACTS:
      return { ...state, contacts: action.payload }
    case CONSTS.GET_ALL_CONTACTS_BYID:
      return { ...state, contactsDetail: action.payload }
    case CONSTS.SYNC_ALL_CONTACTS:
      return { ...state, members: action.payload }
    case CONSTS.CLIO_CONTACTS:
      return { ...state, clioContacts: action.payload }
    case CONSTS.CLIO_SYNC_STATE:
      return { ...state, clioSyncState: action.payload }
    case CONSTS.CLIO_AUTH_TOKEN:
      return { ...state, clioAuthToken: action.payload }
    case CONSTS.SET_ASSIGN_MEMBER:
      return { ...state, assignedMember: action.payload }
    case CONSTS.SET_CONVERSATION_PAGINATION_NUM:
      return { ...state, paginationNum: action.payload }
    case CONSTS.SET_UNREADCONVERSATION_PAGINATION_NUM:
      return { ...state, unreadPaginationNum: action.payload }
    case CONSTS.SET_FAVCONVERSATION_PAGINATION_NUM:
      return { ...state, favPaginationNum: action.payload }
    case CONSTS.SET_ASSIGNCONVERSATION_PAGINATION_NUM:
      return { ...state, assignPaginationNum: action.payload }
    case CONSTS.GET_CALL_DETAILS:
      return { ...state, callDetail: action.payload }
    case CONSTS.SET_SIP_CREDENTIALS:
      return { ...state, addSip: action.payload }
    default:
      return state
  }
}
