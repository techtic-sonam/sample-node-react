import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { addNewDistribution, delDistribution } from '../../actions/distribution.action'

import './styles.css'

const DistributionModal = (props) => {
  const dispatch = useDispatch()
  const { styleMode } = useSelector((state) => state.message.numbers)
  const { isModal, toggleModal, distributionList } = props

  const setColor = () => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    return '#' + randomColor
  }

  const [newDistribution, setNewDistribution] = useState({
    id: '',
    name: '',
    distributionId: '',
    subscribe: false,
    color: '',
  })

  const makeId = () => {
    var text = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    for (var i = 0; i < 5; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
  }

  const addDistribution = () => {
    dispatch(addNewDistribution(newDistribution))
    props.toggleModal()
  }

  const deleteDistribution = () => {
    dispatch(delDistribution(newDistribution.id))
    props.toggleModal()
  }

  useEffect(() => {
    if (Object.keys(distributionList).length > 0) {
      setNewDistribution({
        ...newDistribution,
        id: distributionList._id,
        name: distributionList.name,
        subscribe: distributionList.subscribe,
        distributionId: distributionList.distributionId,
      })
    } else {
      setNewDistribution({
        ...newDistribution,
        id: '',
        name: '',
        subscribe: false,
        distributionId: makeId(),
        color: setColor(),
      })
    }
    // eslint-disable-next-line
  }, [distributionList])

  return (
    <Modal
      isOpen={isModal}
      toggle={toggleModal}
      className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
    >
      <ModalHeader toggle={toggleModal}>
        <i className="ti-pencil-alt"></i>
        {Object.keys(distributionList).length > 0 ? 'Edit' : 'Add New'} Distribution List
      </ModalHeader>
      <ModalBody>
        <div className="contact">
          <span className="tab-title">
            Please add {Object.keys(distributionList).length > 0 ? 'edit' : 'new'} distribution list.
          </span>

          {Object.keys(distributionList).length > 0 && (
            <div className="mt-3">
              <span className="tab-title">Distribution Id : </span>
              <span className="tab-title">{distributionList.distributionId}</span>
            </div>
          )}
          <input
            type="text"
            name="label"
            className="form-control mt-2"
            value={newDistribution.name}
            onChange={(e) => setNewDistribution({ ...newDistribution, name: e.target.value })}
            placeholder="Distribution Name"
          />
          <div className="form-item custom-control custom-switch mt-2">
            <input
              type="checkbox"
              className="custom-control-input"
              id="statusmodal"
              checked={newDistribution.subscribe}
              onChange={(e) => setNewDistribution({ ...newDistribution, subscribe: e.target.checked })}
            />
            <label className="custom-control-label" htmlFor="statusmodal">
              Enable/Disable
            </label>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {Object.keys(distributionList).length > 0 && (
          <Button color="danger" onClick={deleteDistribution}>
            Delete
          </Button>
        )}
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
        <Button color="primary" onClick={addDistribution}>
          {Object.keys(distributionList).length > 0 ? 'Edit' : 'Add'} Distribution
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default DistributionModal
