import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Route, withRouter } from 'react-router-dom'
import jwt_decode from 'jwt-decode'
import Login from './Login/Login'
import Home from './Home/Home'
import AdminDID from './AdminDID'
import History from './CallHistory/History'
import Voicemails from './Voicemails/Voicemails'
import Automation from './Automations/Automation'
import VoicemailsList from './Voicemails/VoicemailsList'
import authenticate from './common/Authenticate'
import ForgotInfo from './ForgotInfo/ForgotInfo'
import ResetPassword from './ResetPassword/ResetPassword'
import Dashboard from './Dashboard/Dashboard'
import Contacts from './Contacts/Contacts'
import Distribution from './Distribution'
import CallDetails from './CallHistory/details/CallDetails'
import Faxes from './Faxes/Faxes'
import ClioAuth from './Clio'
import Management from './Management'
import CallReport from './CallReport'
import './App.css'
import ContactsDetails from './Contacts/ContactsDetails'

window.dataLayer = window.dataLayer || []
function gtag() {
  window.dataLayer.push(arguments)
}
if (localStorage.token) {
  const decoded = jwt_decode(localStorage.token)
  const currentTime = Date.now() / 1000
  if (decoded.exp < currentTime) {
    localStorage.removeItem('token')
    localStorage.removeItem('account_id')
    localStorage.removeItem('user_id')
    window.location.href = '/'
  }
}

const App = (props) => {
  const { auth_token } = useSelector((state) => state.auth)
  useEffect(() => {
    axios.defaults.headers.common['X-AUTH-TOKEN'] = auth_token
    gtag('js', new Date())
    gtag('config', 'UA-118957202-1', { page_path: window.location.pathname })
  }, [auth_token])

  return (
    <div>
      <Route exact path="/" component={Login} />
      <Route exact path="/forgot-info" component={ForgotInfo} />
      <Route exact path="/reset-password" component={ResetPassword} />
      <Route exact path="/home" component={authenticate(Home)} />
      <Route exact path="/callhistory" component={authenticate(History)} />
      <Route exact path="/voicemails/list/:vmbox_id" component={authenticate(VoicemailsList)} />
      <Route exact path="/voicemails" component={authenticate(Voicemails)} />
      <Route exact path="/automation" component={authenticate(Automation)} />
      <Route exact path="/dashboard" component={authenticate(Dashboard)} />
      <Route exact path="/admindid" component={authenticate(AdminDID)} />
      <Route exact path="/management" component={authenticate(Management)} />
      <Route exact path="/callreport" component={authenticate(CallReport)} />
      <Route exact path="/faxes" component={authenticate(Faxes)} />
      <Route exact path="/contacts" component={authenticate(Contacts)} />
      <Route exact path="/distribution" component={authenticate(Distribution)} />
      <Route exact path="/callhistory/legs/:interaction_id" component={authenticate(CallDetails)} />
      <Route exact path="/clioauth" component={authenticate(ClioAuth)} />
      <Route exact path="/contacts/:id" component={authenticate(ContactsDetails)} />
    </div>
  )
}
export default withRouter(App)
