import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../Home/Home.css'
import { Tooltip } from 'reactstrap'
import { logOut } from '../../actions/auth.action'
import { getUserData } from '../../actions/message.action'
import { getallvmboxes } from '../../actions/voicemails.action'

const Sidebar = (props) => {
  const dispatch = useDispatch()
  const { history, changeSidebar, toogleSidebar, contactUsModal, changeSetNumberModal } = props
  const { totalMsgCount, isAdmin } = useSelector((state) => state.message.numbers)
  const { voicemails } = useSelector((state) => state.voicemails)

  const [tooltips, settooltips] = useState({
    smsConversatoion: false,
    callLogs: false,
    voicemail: false,
    appFeedback: false,
    accountSetting: false,
    refreshApp: false,
    logout: false,
    automation: false,
    distribution: false,
  })

  const voicemailCounts = voicemails[0] && voicemails[0].vmbox.newcount

  function onChange(name) {
    settooltips((prevState) => ({ ...prevState, [name]: !prevState[name] }))
  }
  const logout = () => {
    dispatch(logOut())
    history.push('/')
  }
  const reload = () => {
    window.location.reload(true)
  }

  useEffect(() => {
    dispatch(getallvmboxes())
    dispatch(getUserData())
    // eslint-disable-next-line
  }, [])

  return (
    <nav className="navigation">
      <div className="nav-group">
        <ul>
          <li>
            <span className="logo"></span>
          </li>
          <li className="nav-menu">
            <span data-navigation-target="chats" onClick={changeSidebar} className={toogleSidebar ? 'active' : ''}>
              <i className="ti-menu-alt"></i>
            </span>
          </li>
          <li>
            <span
              id="smsConversatoion"
              className={history.location.pathname === '/home' ? 'active-menu' : ''}
              onClick={() => history.push('/home')}
            >
              <i className="far fa-comment-alt"></i>
              {totalMsgCount > 0 && <div className="unread-message-count total-msg-count-1 ml-2">{totalMsgCount}</div>}
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.smsConversatoion}
              autohide={false}
              target="smsConversatoion"
              toggle={() => onChange('smsConversatoion')}
            >
              SMS conversations
            </Tooltip>
          </li>
          <li>
            <span id="voicemail" onClick={() => history.push('/voicemails')}>
              <i className="fas fa-voicemail"></i>
              {voicemailCounts > 0 && (
                <div className="unread-message-count total-msg-count-1 ml-2">{voicemailCounts}</div>
              )}
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.voicemail}
              autohide={false}
              target="voicemail"
              toggle={() => onChange('voicemail')}
            >
              Voicemail
            </Tooltip>
          </li>
          <li>
            <span id="faxes" onClick={() => history.push('/faxes')}>
              <i className="fas fa-fax"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.faxes}
              autohide={false}
              target="faxes"
              toggle={() => onChange('faxes')}
            >
              Faxes
            </Tooltip>
          </li>
          <li>
            <span id="Contacts" onClick={() => history.push('/contacts')}>
              <i className="fas fa-address-book"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.contacts}
              autohide={false}
              target="Contacts"
              toggle={() => onChange('contacts')}
            >
              Contacts
            </Tooltip>
          </li>
          <li>
            <span id="distribution" onClick={() => history.push('/distribution')}>
              <i className="fas fa-address-card" />
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.distribution}
              autohide={false}
              target="distribution"
              toggle={() => onChange('distribution')}
            >
              Distribution Lists
            </Tooltip>
          </li>
          <li>
            <span id="callLogs" onClick={() => history.push('/callhistory')}>
              <i className="fas fa-list"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.callLogs}
              autohide={false}
              target="callLogs"
              toggle={() => onChange('callLogs')}
            >
              Call Logs
            </Tooltip>
          </li>
          <li className="brackets">
            <span id="automation" onClick={() => history.push('/automation')}>
              <i className="fas fa-robot"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.automation}
              autohide={false}
              target="automation"
              toggle={() => onChange('automation')}
            >
              Automations
            </Tooltip>
          </li>

          <li>
            <span id="appFeedback" onClick={contactUsModal}>
              <i className="fas fa-pen"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.appFeedback}
              autohide={false}
              target="appFeedback"
              toggle={() => onChange('appFeedback')}
            >
              App Feedback
            </Tooltip>
          </li>
          {isAdmin === true && (
            <li>
              <span id="adminDashboard" onClick={() => history.push('/dashboard')}>
                <i className="fas fa-users-cog"></i>
              </span>
              <Tooltip
                placement="right"
                isOpen={tooltips.adminDashboard}
                autohide={false}
                target="adminDashboard"
                toggle={() => onChange('adminDashboard')}
              >
                Admin Dashboard
              </Tooltip>
            </li>
          )}

          <li>
            <span id="accountSetting" onClick={changeSetNumberModal}>
              <i className="fas fa-cog"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.accountSetting}
              autohide={false}
              target="accountSetting"
              toggle={() => onChange('accountSetting')}
            >
              Account Settings
            </Tooltip>
          </li>
          <li>
            <span id="refreshApp" onClick={reload}>
              <i className="fas fa-redo-alt"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.refreshApp}
              autohide={false}
              target="refreshApp"
              toggle={() => onChange('refreshApp')}
            >
              Refresh App
            </Tooltip>
          </li>
          <li onClick={logout}>
            <span id="logout">
              <i className="fas fa-sign-out-alt"></i>
            </span>
            <Tooltip
              placement="right"
              isOpen={tooltips.logout}
              autohide={false}
              target="logout"
              toggle={() => onChange('logout')}
            >
              Log Out
            </Tooltip>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default Sidebar
