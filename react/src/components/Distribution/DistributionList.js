import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import PerfectScrollbar from 'react-perfect-scrollbar'
import DistributionModal from './DistributionModal'
import { getContactList } from '../../actions/distribution.action'

import './styles.css'

const DistributionList = (props) => {
  const dispatch = useDispatch()
  const { allList, setDistributionId, distributionId, setUnique } = props

  const [isModal, setIsModal] = useState(false)
  const [distributionList, setDistributionList] = useState({})

  const toggleModal = () => {
    setIsModal(!isModal)
  }

  const getContactsList = (id, uniqueId) => {
    setDistributionId(id)
    setUnique(uniqueId)
    dispatch(getContactList(id))
  }

  const editDistribution = (list) => {
    setDistributionList(list)
    toggleModal()
  }
  const addDistribution = () => {
    setDistributionList({})
    toggleModal()
  }

  return (
    <div className="distributionList">
      <div className="listHeader">
        <div className="headerTitle">Distribution List</div>
        <div className="btn btn-light position-number-dropdown" onClick={addDistribution}>
          <i className="fas fa-plus" />
        </div>
      </div>
      <div className="lists">
        <PerfectScrollbar>
          {allList.length > 0 &&
            allList.map((list, index) => (
              <div className={`list ${list._id === distributionId ? 'active-list' : ''}`} key={index}>
                <div onClick={() => getContactsList(list._id, list.distributionId)}>
                  <i className="fas fa-list-alt" />
                  <span>{list.name}</span>
                </div>
                <i className="fas fa-ellipsis-h edit-btn" onClick={() => editDistribution(list)}></i>
              </div>
            ))}
        </PerfectScrollbar>
      </div>
      <DistributionModal isModal={isModal} toggleModal={toggleModal} distributionList={distributionList} />
    </div>
  )
}

export default DistributionList
