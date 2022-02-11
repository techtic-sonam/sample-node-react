import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import TimePicker from 'react-time-picker'
import DatePicker from 'react-date-picker'
import moment from 'moment'
import { scheduleMessage, startConversation } from '../../actions/message.action'
import { sendDistributionMessage } from '../../actions/distribution.action'
import { toast } from 'react-toastify'
import './Home.css'

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

const ScheduleSMS = (props) => {
  const dispatch = useDispatch()
  const {
    toNumber,
    fromNumber,
    message,
    sender,
    media,
    tab,
    startConversationModal,
    distributionId,
    conversationModal,
    userName,
    distribution,
  } = props
  const { styleMode } = useSelector((state) => state.message.numbers)
  var hours = new Date().getHours() > 9 ? new Date().getHours() : '0' + new Date().getHours()
  var minutes = new Date().getMinutes() > 9 ? new Date().getMinutes() : '0' + new Date().getMinutes()

  const time = hours + ':' + minutes
  const [consDropdown, setconsDropdown] = useState(false)
  const [isModal, setIsModal] = useState(false)
  const [scheduleDate, setScheduleDate] = useState(new Date())
  const [value, onChange] = useState(time)
  const datePicker = useRef()
  const today = scheduleDate.getDate() + '/' + scheduleDate.getMonth()
  const todayDate = new Date().getDate() + '/' + new Date().getMonth()
  const consToggle = () => setconsDropdown((prevState) => !prevState)
  const toggleModal = () => {
    setIsModal(!isModal)
  }

  const isNumeric = (value) => {
    return /^\d+$/.test(value)
  }

  const saveScheduleData = async () => {
    const account_id = await localStorage.getItem('account_id')
    const data = {
      to_number: toNumber,
      from_number: fromNumber,
      text: message,
      sender: sender,
      media: media,
      tab: tab,
      schedule_time: currentDate(),
      account_name: account_id,
    }

    if (startConversationModal) {
      const numberSort = toNumber.replace(/[\s&\\#+()$~%.'":*?<>{}-]/g, '')
      props.updateValues({ ...props.values, phoneNum: numberSort })
      const array = numberSort.split(',')
      if (array.length > 0 && array.length < 101) {
        const phoneArray = []
        await array.forEach((item) => {
          if (isNumeric(item) && item.length === 10) {
            phoneArray.push(`+1${item}`)
          } else {
            toast.warn(`Please check Phone Number(${item})'s type and length`, {
              position: toast.POSITION.TOP_RIGHT,
            })
          }
        })
        if (props.values.msgText === '') {
          toast.warn('Please input message.', {
            position: toast.POSITION.TOP_RIGHT,
          })
        } else {
          const messageData = {
            to_number: toNumber,
            from_number: fromNumber,
            text: message,
            sender: sender,
            media: media,
            tab: tab,
            schedule_time: currentDate(),
            account_name: account_id,
          }
          dispatch(startConversation(phoneArray, fromNumber, message, sender, userName, messageData))
          props.updateValues({ ...props.values, msgText: '' })
          conversationModal()
        }
      } else {
        toast.warn('You can input up to 10 Phone Numbers', {
          position: toast.POSITION.TOP_RIGHT,
        })
        return
      }
    } else if (distribution) {
      const distributionData = {
        to_number: distributionId,
        from_number: fromNumber,
        text: message,
        sender: sender,
        media: media,
        tab: tab,
        schedule_time: currentDate(),
        account_name: account_id,
      }
      if (distributionId === '') return
      dispatch(sendDistributionMessage(message, media, fromNumber, distributionId, distributionData))
      conversationModal()
    } else {
      dispatch(scheduleMessage(data))
      props.updateValues({ ...props.values, msgText: '' })
      toggleModal()
    }
  }

  const currentDate = () => {
    const datec = moment(scheduleDate).format('YYYY-MM-DD') + 'T' + value
    return new Date(datec)
  }

  useEffect(() => {
    if (!datePicker.current) {
      return
    }

    const _this = datePicker.current

    _this.onOutsideAction = (event) => {
      if (
        _this.wrapper &&
        !_this.wrapper.contains(event.target) &&
        typeof event?.target?.className === 'string' &&
        !event?.target?.className?.indexOf('react-calendar')
      ) {
        _this.closeCalendar()
        event.stopPropagation()
      }
    }
  })

  return (
    <div>
      <Dropdown isOpen={consDropdown} toggle={consToggle} direction="up">
        <DropdownToggle className="schedule-dropdown" disabled={message.length === 0}>
          <i className="fas fa-chevron-down" />
        </DropdownToggle>
        <DropdownMenu className="custom-outer" right>
          <DropdownItem header>Schedule message</DropdownItem>
          <DropdownItem className="schedule-icon" onClick={toggleModal}>
            <span>Custom time</span>
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <Modal
        isOpen={isModal}
        toggle={toggleModal}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom schedule-modal`}
      >
        <ModalHeader className="schedule-header">Schedule message</ModalHeader>
        <ModalBody>
          <div className="contact">
            <div className="mt-2">
              <DatePicker minDate={new Date()} format="MM-dd-y" onChange={setScheduleDate} value={scheduleDate} />
              <TimePicker
                minTime={today === todayDate ? time : ''}
                disableClock={true}
                onChange={onChange}
                value={value}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="assign-footer-btn" onClick={toggleModal}>
            Cancel
          </Button>
          <Button color="primary" onClick={saveScheduleData}>
            Schedule
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default ScheduleSMS
