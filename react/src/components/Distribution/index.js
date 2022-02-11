import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'

import { getCallForward } from '../../actions/message.action'
import { getDistributionList } from '../../actions/distribution.action'

import Sidebar from '../Sidebar/Sidebar'
import Dialog from '../Sidebar/Dialog'
import UserHeader from '../Header/UserHeader'
import DistributionList from './DistributionList'
import ContactList from './ContactList'

import './styles.css'

const Distribution = (props) => {
  const dispatch = useDispatch()
  const { styleMode } = useSelector((state) => state.message.numbers)
  const { loading } = useSelector((state) => state.message)
  const { allList, contactsList } = useSelector((state) => state.distribution)

  const [contactToogle, updateContactUs] = useState(false)
  const [setNumberToogle, updateSetNumber] = useState(false)
  const [distributionId, setDistributionId] = useState('')
  const [uniqueId, setUnique] = useState('')

  const contactUsModal = () => {
    updateContactUs(!contactToogle)
  }
  const changeSetNumberModal = () => {
    if (!setNumberToogle) {
      dispatch(getCallForward())
    }
    updateSetNumber(!setNumberToogle)
  }

  useEffect(() => {
    dispatch(getDistributionList())
    // eslint-disable-next-line
  }, [])

  return (
    <div className={styleMode}>
      {loading && (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
      <ToastContainer autoClose={8000} />
      <div className="layout-admin">
        <Sidebar contactUsModal={contactUsModal} changeSetNumberModal={changeSetNumberModal} history={props.history} />
        <Dialog
          contactUsModal={contactUsModal}
          contactToogle={contactToogle}
          changeSetNumberModal={changeSetNumberModal}
          setNumberToogle={setNumberToogle}
        />
        <div className="content">
          <UserHeader changeSetNumberModal={changeSetNumberModal} history={props.history} />
          <div className="distribution">
            <DistributionList
              allList={allList}
              setDistributionId={setDistributionId}
              distributionId={distributionId}
              setUnique={setUnique}
            />
            <ContactList contactsList={contactsList} distributionId={distributionId} uniqueId={uniqueId} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Distribution
