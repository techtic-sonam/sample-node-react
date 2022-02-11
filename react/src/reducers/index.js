import { combineReducers } from 'redux'
import auth from './auth.reducer'
import message from './message.reducer'
import callhistory from './callhistory.reducer'
import voicemails from './voicemails.reducer'
import automation from './automation.reducer'
import dashboard from './dashboard.reducer'
import admindid from './admindid.reducer'
import faxes from './faxes.reducer'
import management from './management.reducer'
import googleReducer from './google.reducer'
import callreport from './callreport.reducer'
import distribution from './distribution.reducer'

const rootReducers = combineReducers({
  auth: auth,
  message: message,
  callhistory: callhistory,
  voicemails,
  automation: automation,
  dashboard: dashboard,
  adminDID: admindid,
  faxes: faxes,
  googleReducer: googleReducer,
  management: management,
  callreport: callreport,
  distribution: distribution,
})

export default rootReducers
