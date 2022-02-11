import React, { useRef, Fragment } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import '../Home/Home.css'
import './UserHeader.css'
import silhoutte from '../../asset/media/img/silhoutte.png'
import CONFIG from '../../constants/config'
import * as CONSTS from '../../constants/const'
import axios from 'axios'
import { getUserData } from '../../actions/message.action'

const UserHeader = (props) => {
  const { history, changeSetNumberModal } = props
  const { numbers, userName } = useSelector((state) => state.message)
  const uploadAvatarRef = useRef(null)
  const dispatch = useDispatch()
  const owner_id = localStorage.getItem('user_id')

  const uploadAvatar = (ev) => {
    ev.preventDefault()
    dispatch({ type: CONSTS.SET_LOADING_USER_DATA, payload: true })
    const data = new FormData()
    data.append('file', uploadAvatarRef.current.files[0])
    data.append('userId', owner_id)
    axios
      .post(`${CONFIG.serverURL}/uploadavatar`, data, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((response) => {
        dispatch(getUserData())
      })
  }

  return (
    <div className="header-dash">
      <div className="right-links">
        {history &&
          history.location &&
          (history.location.pathname === '/dashboard' ||
            history.location.pathname === '/admindid' ||
            history.location.pathname === '/management' ||
            history.location.pathname === '/callreport') && (
            <Fragment>
              <div className="link-pointer" onClick={() => history.push('/dashboard')}>
                <i className="fas fa-tachometer-alt" /> Dashboard
              </div>
              <div>{'|'}</div>
              <div className="link-pointer" onClick={() => history.push('/admindid')}>
                <i className="fas fa-hashtag" /> Numbers
              </div>
              <div>{'|'}</div>
              <div className="link-pointer" onClick={() => history.push('/management')}>
                <i className="fas fa-users mr-2" />
                Users
              </div>
              <div>{'|'}</div>
              <div className="link-pointer" onClick={() => history.push('/callreport')}>
                <i className="far fa-chart-bar mr-2" />
                Call Reporting
              </div>
            </Fragment>
          )}
      </div>
      <div className="right-heading">
        <div className="user-header">
          <figure className="avatar avatar-lg">
            <div className="user-image">
              <label id="#bb">
                <i className="fas fa-upload"></i>
                <input type="file" ref={uploadAvatarRef} onChange={uploadAvatar} accept="image/*" />
              </label>
            </div>
            {numbers.avatar ? (
              <img src={`${CONFIG.serverURL}/users/${numbers.avatar}`} alt="avatar" />
            ) : (
              <img src={silhoutte} alt="avatar" />
            )}
          </figure>
          <div onClick={changeSetNumberModal}>
            <h5>{userName.fullName}</h5>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserHeader
