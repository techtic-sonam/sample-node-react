import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import './Home.css'
import {
  addUserLabel,
  addreadConversation,
  unreadConversation,
  startQuickCall,
  assignConversationToUser,
  getAssignConversation,
  unreadAssignedConversation,
  addreadAssignedConversation,
} from '../../actions/message.action'
import { getUsers } from '../../actions/management.action'
import silhoutte from '../../asset/media/img/silhoutte.png'
import {
  Dropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import Select from 'react-select'
import CONFIG from '../../constants/config.json'

const customStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    maxWidth: 400,
    display: 'flex',
    background: '#FFFFFF',
    border: '1px solid #CECECE',
    boxSizing: 'border-box',
    borderRadius: '3px',
  }),
}
const DropMenu = (props) => {
  const dispatch = useDispatch()
  const {
    deleteHistory,
    tab,
    fromNumber,
    toNumber,
    email,
    contactID,
    labelName,
    readConversation,
    member,
    isContactDialog,
    memberName,
  } = props
  const { styleMode } = useSelector((state) => state.message.numbers)
  const { devices, assignConversation } = useSelector((state) => state.message)
  const { users } = useSelector((state) => state.dashboard)
  const { userData } = useSelector((state) => state.management)
  const [consDropdown, setconsDropdown] = useState(false)
  const [addLabelDialog, setAddLabelDialog] = useState(false)
  const [labelValue, updatelabelValue] = useState(labelName)
  const consToggle = () => setconsDropdown((prevState) => !prevState)
  const [addCall, setAddCall] = useState(false)
  const [deleteConversation, setDeleteConversation] = useState(false)
  const [sendCallData, setSendCallData] = useState({
    device_id: '',
    to_number: '',
  })
  const [initiatingCall, setInitiatingCall] = useState(false)
  const [assignConversationPopup, setAssignConversationPopup] = useState(false)
  const [allUserNames, setAllUserNames] = useState([])
  const [assignButton, setAssignButton] = useState(false)
  const owner_id = localStorage.getItem('user_id')

  const markReadUnreadMessage = () => {
    if (readConversation) {
      dispatch(unreadConversation(fromNumber, toNumber, owner_id))
    } else {
      dispatch(addreadConversation(fromNumber, toNumber, owner_id))
    }
  }
  const markReadUnreadAssignedMessage = () => {
    if (readConversation) {
      dispatch(unreadAssignedConversation(member))
    } else {
      dispatch(addreadAssignedConversation(member))
    }
  }
  const toggleAddLabel = () => {
    setAddLabelDialog(!addLabelDialog)
  }
  const changeLabelValue = (e) => {
    updatelabelValue(e.target.value)
  }
  const changeLabel = () => {
    dispatch(addUserLabel(email, toNumber, labelValue, contactID, fromNumber))
    setAddLabelDialog(!addLabelDialog)
  }

  const call = () => {
    setAddCall(true)
  }

  const deleteModal = () => {
    setDeleteConversation(true)
  }

  const toggleAddCall = () => {
    setAddCall(!addCall)
    setSendCallData({
      ...sendCallData,
      device_id: '',
      to_number: '',
    })
  }

  const selectNumber = (value) => {
    setSendCallData({
      ...sendCallData,
      device_id: value,
      to_number: toNumber,
    })
  }

  const [selectNumbersOptions, setSelectNumbersOptions] = useState([])
  useEffect(() => {
    const deviceArr = []
    devices &&
      devices.forEach((device) => {
        deviceArr.push({ value: device.id, label: device.name })
      })

    setSelectNumbersOptions(deviceArr)
    // eslint-disable-next-line
  }, [devices])

  const startCall = () => {
    setInitiatingCall(!initiatingCall)
    const device_id = sendCallData.device_id && sendCallData.device_id.value
    const phone_number = sendCallData.to_number && sendCallData.to_number
    dispatch(startQuickCall(device_id, phone_number))
    setSendCallData({
      device_id: '',
      to_number: '',
    })
  }

  const toggleInitiatingCall = () => {
    setInitiatingCall(!initiatingCall)
    setAddCall(!addCall)
  }
  const toggleDeleteModal = () => {
    setDeleteConversation(!deleteConversation)
  }

  const assignConversationShowPopup = async () => {
    if (tab !== 'favTab3') {
      const owner_id = localStorage.getItem('user_id')
      await dispatch(getAssignConversation(toNumber, fromNumber, owner_id))
      // const userData = await allUserNames.map((e) => ({
      //   ...e,
      //   state: false,
      // }))
      // await setAllUserNames(userData)
      // await setUserData(userData)
      await setAssignConversationPopup(true)
    } else {
      await dispatch(getAssignConversation(member.assigned_number, member.assigner_number, member.assigner_userid))
      await setAssignConversationPopup(true)
    }
  }

  const toggleAssignConversationPopup = () => {
    setAssignConversationPopup(!assignConversationPopup)
  }

  const saveAssignConversation = () => {
    const owner_id = localStorage.getItem('user_id')
    const userData = {
      assigned_number: toNumber,
      assigner_number: fromNumber,
      assigner_email: email,
      assigner_userid: owner_id,
    }
    dispatch(assignConversationToUser(allUserNames, userData))
    toggleAssignConversationPopup()
  }

  useEffect(() => {
    const dataArray = []
    users &&
      users.forEach((user) => {
        dataArray.push({
          email: user.username,
          userName: user.first_name + ' ' + user.last_name,
          state: false,
          userId: user.id,
          toNumber: toNumber,
        })
      })

    setAllUserNames(dataArray)
    // eslint-disable-next-line
  }, [users])

  const changeConversationAssignState = (e) => {
    const userData = [...allUserNames]
    const index = allUserNames.findIndex((user) => user.email === e.target.id)
    userData[index].state = e.target.checked
    setAllUserNames(userData)
  }
  useEffect(() => {
    const stateData = allUserNames.map((item) => item.state)
    if (stateData.includes(true)) {
      setAssignButton(true)
    }
    // eslint-disable-next-line
  }, [allUserNames])

  const setUserData = async (userData) => {
    if (userData && userData.length > 0) {
      if (assignConversation && assignConversation.length > 0) {
        assignConversation.forEach((assignuser) => {
          const users = [...userData]
          const index = users.findIndex(
            (user) =>
              user.email === assignuser.assigned_email &&
              user.userId === assignuser.assigned_userid &&
              user.toNumber === assignuser.assigned_number,
          )
          if (index !== -1) {
            users[index]['state'] = assignuser.state
          }
          setAllUserNames(users)
        })
      } else {
        const userData = await allUserNames.map((e) => ({
          ...e,
          state: false,
        }))
        setAllUserNames(userData)
      }
    }
  }
  useEffect(() => {
    setUserData(allUserNames)
    // eslint-disable-next-line
  }, [assignConversation])

  const handleDelete = () => {
    deleteHistory()
    setDeleteConversation(!deleteConversation)
  }

  useEffect(() => {
    dispatch(getUsers())
    // eslint-disable-next-line
  }, [])

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
      <Dropdown isOpen={consDropdown} toggle={consToggle}>
        <DropdownToggle className="drop-btn">
          <i className="ti-more"></i>
        </DropdownToggle>
        <DropdownMenu className="custom-outer-menu" right>
          <DropdownItem
            onClick={() => {
              if (tab === 'favTab3') {
                markReadUnreadAssignedMessage()
              } else {
                markReadUnreadMessage()
              }
            }}
            className="drop-menu"
          >
            {readConversation ? 'Mark Unread' : 'Mark Read'}
          </DropdownItem>

          <DropdownItem className="drop-menu" onClick={() => assignConversationShowPopup()}>
            {tab !== 'favTab3' ? 'Assign Conversation' : 'Unassign Conversation'}
          </DropdownItem>
          {tab === 'favTab1' && (
            <DropdownItem className="drop-menu" onClick={() => deleteModal()}>
              Delete Conversation
            </DropdownItem>
          )}
          <DropdownItem className="drop-menu" onClick={() => isContactDialog(true, member)}>
            {'Update Contact Details'}
          </DropdownItem>
          {tab !== 'favTab3' && (
            <DropdownItem className="drop-menu" onClick={() => call()}>
              Call
            </DropdownItem>
          )}
        </DropdownMenu>
      </Dropdown>
      <Modal
        isOpen={addLabelDialog}
        toggle={toggleAddLabel}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader toggle={toggleAddLabel}>
          <i className="ti-pencil-alt"></i> Add Name
        </ModalHeader>
        <ModalBody>
          <div className="contact">
            <div className="input-group">
              <input
                type="text"
                name="label"
                className="form-control"
                placeholder="Please Enter Contact Name"
                value={labelValue}
                onChange={changeLabelValue}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={changeLabel}>
            {contactID === '' ? 'Add' : 'Change'}
          </Button>
        </ModalFooter>
      </Modal>

      <Modal
        isOpen={addCall}
        toggle={toggleAddCall}
        className={`${styleMode}-modal call-modal modal-dialog modal-dialog-centered modal-dialog-zoom quick-call-modal`}
      >
        <ModalHeader className="call-header">Call</ModalHeader>
        <ModalBody>
          <div className="contact">
            <Select
              isClearable
              styles={customStyles}
              id="device_id"
              value={sendCallData.device_id}
              onChange={selectNumber}
              options={selectNumbersOptions}
              placeholder="Select Device"
              maxMenuHeight={200}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="assign-footer-btn cancel-btn" onClick={toggleAddCall}>
            Cancel
          </Button>
          <Button color="primary" className="start-call" onClick={startCall}>
            {'Start Call'}
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={initiatingCall}
        toggle={toggleInitiatingCall}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader toggle={toggleInitiatingCall}>
          <i className="fa fa-phone-alt"></i> Call
        </ModalHeader>
        <ModalBody className="initiating-call">Initiating Call...</ModalBody>
      </Modal>
      <Modal
        isOpen={assignConversationPopup}
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
          <Button color="primary" disabled={!assignButton} className="updateBtn" onClick={saveAssignConversation}>
            Assign
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={deleteConversation}
        toggle={toggleDeleteModal}
        className={`${styleMode}-modal del-conversation-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalBody className="delete-body">
          <div className="delete-icon">
            <i className="fas fa-trash"></i>
          </div>
          Are you sure you want <br /> to Delete Conversation with <br />{' '}
          <strong>
            {labelName && labelName !== undefined && labelName !== ''
              ? labelName
              : memberName && memberName.labelName !== undefined
              ? memberName.labelName
              : toNumber}
            ?
          </strong>
        </ModalBody>
        <ModalFooter className="delete-footer">
          <Button className="assign-footer-btn" onClick={toggleDeleteModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={handleDelete}>
            Delete
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default DropMenu
