import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { withRouter } from 'react-router-dom'

export default function authenticate(Component) {
  const AuthenticatedComponent = (props) => {
    const { auth } = useSelector((state) => state)
    useEffect(() => {
      checkAuth()
      // eslint-disable-next-line
    }, [])

    const checkAuth = () => {
      if (!auth.auth_token && !localStorage.getItem('token')) {
        props.history.push('/')
      }
    }
    return auth.auth_token || localStorage.getItem('token') ? <Component {...props} /> : null
  }

  return withRouter(AuthenticatedComponent)
}
