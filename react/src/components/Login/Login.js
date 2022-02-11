import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import jwt from 'jwt-simple'
import { getNewAuthToken } from '../../actions/auth.action'
import { getPhoneNumbers } from '../../actions/admindid.action'
import CONFIG from '../../constants/config'
import { ToastContainer, toast } from 'react-toastify'
import './Login.css'

window.dataLayer = window.dataLayer || []
function gtag() {
  window.dataLayer.push(arguments)
}

const Login = (props) => {
  const { auth_token, auth_fail, auth } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
    accountname: '',
  })
  const [remember, setRemember] = useState(false)
  const handleChange = (e) => {
    if (e.key === 'Enter') {
      submit()
    } else {
      setLoginData({ ...loginData, [e.target.name]: e.target.value })
    }
  }
  const remeberMe = () => {
    setRemember(!remember)
  }
  const submit = () => {
    localStorage.setItem('token', '')
    localStorage.setItem('account_id', '')
    localStorage.setItem('user_id', '')
    localStorage.setItem('email', '')
    dispatch(getNewAuthToken(loginData.username, loginData.password, loginData.accountname))
  }
  const loginFail = () => {
    toast.error('Please check login information !', {
      position: toast.POSITION.TOP_RIGHT,
    })
  }
  useEffect(() => {
    if (auth_token && auth.data && auth.data.account_id && auth.data.owner_id) {
      let { account_id, owner_id } = auth.data
      localStorage.setItem('token', auth_token)
      localStorage.setItem('account_id', account_id)
      localStorage.setItem('user_id', owner_id)
      localStorage.setItem('email', loginData.username)
      const data = JSON.parse(localStorage.getItem('showNumber'))

      if (!localStorage.getItem('showNumber')) {
        const getResync = true
        dispatch(getPhoneNumbers(getResync))
      } else if (data && data.user_id !== owner_id) {
        const getResync = true
        dispatch(getPhoneNumbers(getResync))
      }

      if (remember) {
        const data = { username: loginData.username, password: loginData.password, accountname: loginData.accountname }
        const encodeData = jwt.encode(data, CONFIG.apiSecret)
        localStorage.setItem('rememberme', encodeData)
      } else {
        localStorage.removeItem('rememberme')
      }
      gtag('config', '213664695', {
        user_id: auth.data.account_name,
      })
      props.history.push('/home')
    }
    // eslint-disable-next-line
  }, [auth_token])

  useEffect(() => {
    if (auth_fail) {
      loginFail()
    }
  }, [auth_fail])
  useEffect(() => {
    if (localStorage.getItem('rememberme')) {
      const decodeData = jwt.decode(localStorage.getItem('rememberme'), CONFIG.apiSecret)
      setLoginData({
        ...loginData,
        username: decodeData.username,
        password: decodeData.password,
        accountname: decodeData.accountname,
      })
      setRemember(true)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <div className="form-membership">
      <ToastContainer autoClose={5000} />
      <div className="form-wrapper">
        <div className="logo"></div>
        <h5>Sign in</h5>
        <div className="form-group input-group-lg">
          <input
            type="text"
            name="username"
            className="form-control"
            placeholder="Username or email"
            onChange={handleChange}
            value={loginData.username}
            required
            autoFocus
          />
        </div>
        <div className="form-group input-group-lg">
          <input
            type="password"
            name="password"
            className="form-control"
            placeholder="Password"
            value={loginData.password}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group input-group-lg">
          <input
            type="text"
            name="accountname"
            className="form-control"
            placeholder="Account Name"
            value={loginData.accountname}
            onKeyPress={handleChange}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group d-flex justify-content-between">
          <div className="custom-control custom-checkbox">
            <input
              type="checkbox"
              className="custom-control-input"
              id="customCheck1"
              onChange={remeberMe}
              checked={remember === true}
            />
            <label className="custom-control-label" htmlFor="customCheck1">
              Remember me
            </label>
          </div>
          <div className="forgot-passwork">
            <a href="forgot-info">Forgot your info?</a>
          </div>
        </div>
        <button className="btn btn-primary btn-lg btn-block" onClick={submit}>
          Sign in
        </button>
      </div>
    </div>
  )
}

export default Login
