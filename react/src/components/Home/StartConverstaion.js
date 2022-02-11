import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, Tooltip, TabContent, TabPane, Nav, NavItem, NavLink } from 'reactstrap'
import classnames from 'classnames'
import Select from 'react-select'
import { getContactList, getDistributionList, sendDistributionMessage } from '../../actions/distribution.action'
import './message.css'
import ScheduleSMS from './ScheduleSMS'
import CONFIG from '../../constants/config'
import axios from 'axios'

const customStyles = {
  control: () => ({
    // none of react-select's styles are passed to <Control />
    maxWidth: 440,
    display: 'flex',
    background: '#FFFFFF',
    border: '1px solid #CECECE',
    boxSizing: 'border-box',
    borderRadius: '3px',
  }),
}

const StartConverstaion = ({
  conversationToogle,
  conversationModal,
  handleValues,
  values,
  startConverstaion,
  fromNumber,
  updateValues,
  adminUseremail,
  userName,
}) => {
  const dispatch = useDispatch()
  const [tooltipOpen3, setTooltipOpen3] = useState(false)
  const [tab, setTab] = useState('tab1')
  const [distributionOptions, setDistributionOptions] = useState([])
  const [distributionId, setDistributionId] = useState('')
  const [UplaodConversation, setUplaodConversation] = useState('')
  const { styleMode } = useSelector((state) => state.message.numbers)
  const { allList } = useSelector((state) => state.distribution)

  const toggleTooltip3 = () => setTooltipOpen3(!tooltipOpen3)

  const changeType = (value) => {
    const id = value.value
    setDistributionId(id)
    dispatch(getContactList(id))
  }

  const sendDisMessage = () => {
    if (distributionId === '') return
    dispatch(sendDistributionMessage(values.msgText, UplaodConversation, fromNumber, distributionId))
    conversationModal()
  }

  useEffect(() => {
    setUplaodConversation('')
  }, [tab])

  useEffect(() => {
    if (!conversationToogle) {
      setUplaodConversation('')
    }
  }, [conversationToogle])

  useEffect(() => {
    let options = []
    for (const list of allList) {
      options.push({
        value: list._id,
        label: list.name,
      })
    }
    setDistributionOptions(options)
  }, [allList])

  useEffect(() => {
    dispatch(getDistributionList())
    // eslint-disable-next-line
  }, [])

  const uploadfile = useRef(null)

  const imageUpload = async (ev) => {
    ev.preventDefault()
    const data = new FormData()
    data.append('file', ev.target.files[0])
    await axios
      .post(`${CONFIG.serverURL}/fileupload`, data, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((response) => {
        setUplaodConversation(response.data.file)
      })
  }

  return (
    <Modal
      isOpen={conversationToogle}
      toggle={conversationModal}
      className={`${styleMode}-modal new-sms-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
    >
      <ModalHeader className="new-sms-header">New Conversation</ModalHeader>
      <ModalBody>
        <Nav tabs className="sms-header">
          <NavItem>
            <NavLink
              className={classnames({
                active: tab === 'tab1',
              })}
              onClick={() => {
                setTab('tab1')
              }}
            >
              New Number
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({
                active: tab === 'tab2',
              })}
              onClick={() => {
                setTab('tab2')
              }}
            >
              Distribution List
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={tab}>
          <TabPane tabId="tab1">
            <div className="contact">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control update-input"
                  placeholder="To:"
                  name="phoneNum"
                  value={values.phoneNum}
                  onChange={handleValues}
                  pattern="[0-9, ]"
                />
              </div>
              <div className="input-group number-information">
                <span>
                  <i className="fa fa-question-circle mt-2 ml-2" id="phoneNumInfo"></i>
                </span>
                <Tooltip
                  placement="right"
                  isOpen={tooltipOpen3}
                  autohide={false}
                  target="phoneNumInfo"
                  toggle={toggleTooltip3}
                >
                  Enter the recipient's 10 digit phone number (ex. 2087358999) or add up to 10 recipients to receive the
                  same message individually (not a group message) as a comma separated list (Ex. 2087358999,
                  2089440031):
                </Tooltip>
              </div>

              <div className="input-group mt-3 new-conversation">
                <textarea
                  type="text"
                  name="msgText"
                  className="form-control update-input"
                  placeholder="Message:"
                  onChange={handleValues}
                  value={values.msgText}
                />
              </div>
              <div>{UplaodConversation}</div>
            </div>
            <div className="sms-footer">
              <div className="upload-input">
                <label id="#bb">
                  <i className="fas fa-paperclip"></i>
                  <input
                    type="file"
                    ref={uploadfile}
                    onChange={imageUpload}
                    accept="image/*|audio/*|video/*|application/*"
                  />
                </label>
              </div>

              <div className="start-buttons">
                <Button className="assign-footer-btn sms-cancel-button mr-2" onClick={conversationModal}>
                  Cancel
                </Button>
                <Button
                  color="primary"
                  disabled={values.msgText === ''}
                  className="sms-start startConversation"
                  onClick={() => startConverstaion(UplaodConversation)}
                >
                  Start
                </Button>
                <ScheduleSMS
                  toNumber={values.phoneNum}
                  fromNumber={fromNumber}
                  message={values.msgText}
                  sender={adminUseremail}
                  media={imageUpload}
                  updateValues={updateValues}
                  values={values}
                  tab="favTab1"
                  startConversationModal={true}
                  conversationModal={conversationModal}
                  startConverstaion={startConverstaion}
                  userName={userName}
                />
              </div>
            </div>
          </TabPane>
          <TabPane tabId="tab2">
            <div className="contact">
              <div className="mb-3 select-box">
                <Select
                  isClearable
                  onChange={changeType}
                  styles={customStyles}
                  options={distributionOptions}
                  placeholder="Distribution Contact"
                  maxMenuHeight={200}
                />
              </div>
              <div className="input-group mt-3 new-conversation">
                <textarea
                  type="text"
                  name="msgText"
                  className="form-control update-input"
                  placeholder="Message:"
                  onChange={handleValues}
                  value={values.msgText}
                />
              </div>
              <div>{UplaodConversation}</div>
              <div className="sms-footer">
                <div className="upload-input">
                  <label id="#bb">
                    <i className="fas fa-paperclip"></i>
                    <input
                      type="file"
                      ref={uploadfile}
                      onChange={imageUpload}
                      accept="image/*|audio/*|video/*|application/*"
                    />
                  </label>
                </div>
                <div className="start-buttons">
                  <Button className="assign-footer-btn sms-cancel-button mr-2" onClick={conversationModal}>
                    Cancel
                  </Button>
                  <Button
                    color="primary"
                    disabled={values.msgText === ''}
                    className="sms-start startConversation"
                    onClick={() => sendDisMessage(UplaodConversation)}
                  >
                    Start
                  </Button>
                  <ScheduleSMS
                    toNumber={values.phoneNum}
                    fromNumber={fromNumber}
                    message={values.msgText}
                    sender={adminUseremail}
                    media={imageUpload}
                    updateValues={updateValues}
                    values={values}
                    tab={tab}
                    distributionId={distributionId}
                    distribution={true}
                    conversationModal={conversationModal}
                  />
                </div>
              </div>
            </div>
          </TabPane>
        </TabContent>
      </ModalBody>
    </Modal>
  )
}

export default StartConverstaion
