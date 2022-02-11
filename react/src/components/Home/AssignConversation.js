import React from 'react'
import { useSelector } from 'react-redux'
import './Home.css'
import silhoutte from '../../asset/media/img/silhoutte.png'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import CONFIG from '../../constants/config.json'

const AssignConversation = (props) => {
  const {
    toNumber,
    assignConversationModal,
    toggleAssignConversationPopup,
    allUserNames,
    saveAssignConversation,
    changeConversationAssignState,
  } = props
  const { assignConversation } = useSelector((state) => state.message)
  const { styleMode } = useSelector((state) => state.message.numbers)
  const { userData } = useSelector((state) => state.management)

  const getUserAvatar = (email) => {
    const userArr = userData.filter((user) => user.email === email)
    if (userArr.length > 0) {
      if (userArr[0].avatar) {
        return `${CONFIG.serverURL}/users/${userArr[0].avatar}`
      } else {
        return silhoutte
      }
    } else return silhoutte
  }

  const checkedValue = (email, state) => {
    const checkValue = assignConversation.length > 0 && assignConversation.map((item) => item.assigned_email === email)
    if (checkValue) {
      if (checkValue.includes(true)) {
        return checkValue.includes(true) ? (state === false ? false : true) : false
      }
    }
  }

  return (
    <div>
      <Modal
        backdrop={false}
        isOpen={assignConversationModal}
        toggle={toggleAssignConversationPopup}
        className={`${styleMode}-modal modal-dialog assign-modal modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader>Assign Conversation</ModalHeader>
        <ModalBody className="assign-body">
          {allUserNames.map((user, index) => (
            <div className="form-item assign-form mt-2" key={index}>
              <input
                type="checkbox"
                className="assign-input"
                checked={checkedValue(user.email, user.state)}
                onChange={changeConversationAssignState}
                id={user.email}
              />
              <label className="assign-label" htmlFor={user.email}>
                <div className="assign-user-image">
                  <img src={getUserAvatar(user.email)} className="avatar" alt="avatar" />
                </div>
                {user.userName}
              </label>
            </div>
          ))}
        </ModalBody>
        <ModalFooter className="assign-footer">
          <Button className="assign-footer-btn cancel-btn" onClick={toggleAssignConversationPopup}>
            Cancel
          </Button>
          <Button color="primary" className="cancel-btn" onClick={() => saveAssignConversation(toNumber)}>
            Assign
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default AssignConversation
