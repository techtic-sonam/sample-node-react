import React, { useEffect, useState, useRef } from 'react'
import { ReactTinyLink } from 'react-tiny-link'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import DateTimePicker from 'react-datetime-picker'

import { editScheduleMessage, deleteScheduleMessage } from '../../actions/message.action'
import './message.css'
import moment from 'moment'
import ReactDOM from 'react-dom'

const Message = (props) => {
  const dispatch = useDispatch()
  const { isModal, toggleModal } = props
  const message = props.message.text
  const score = props.message.sentiment_score
  const datePicker = useRef()
  const { styleMode } = useSelector((state) => state.message.numbers)

  const [positiveScore, setPositiveScore] = useState('')
  const [negativeScore, setNegativeScore] = useState('')
  const [scheduleDate, setScheduleDate] = useState(new Date())
  const [scheduleMsg, setScheduleMsg] = useState('')

  const editScheduleData = async () => {
    const account_id = await localStorage.getItem('account_id')
    const data = {
      to_number: props.message.to_number,
      from_number: props.message.from_number,
      text: scheduleMsg,
      sender: props.message.sender,
      media: props.message.media,
      tab: props.message.tab,
      schedule_time: scheduleDate,
      account_name: account_id,
    }
    dispatch(editScheduleMessage(props.message.message_id, data))
    toggleModal()
  }
  const deleteScheduleData = async () => {
    if (props.message.distributionId) {
      const data = {
        to_number: props.message.to_number,
        from_number: props.message.from_number,
      }
      dispatch(deleteScheduleMessage(props.message.message_id, data, props.message.distributionId))
      toggleModal()
    } else {
      const data = {
        to_number: props.message.to_number,
        from_number: props.message.from_number,
      }
      dispatch(deleteScheduleMessage(props.message.message_id, data))
      toggleModal()
    }
  }

  useEffect(() => {
    if (score >= 0.25 && score <= 1) {
      setPositiveScore(score)
    } else if (score <= -0.25 && score >= -1) {
      setNegativeScore(score)
    }
  }, [score])

  useEffect(() => {
    if (props.message.scheduleMsg) {
      setScheduleDate(new Date(props.message.scheduleTime))
      setScheduleMsg(props.message.text)
    }
  }, [props])

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
  }, [])

  const messageDate = props.message.createdAt
  let hours = moment().diff(moment(messageDate), 'hours')

  const loadPreview = (index, url, randomNumber) => {
    document.getElementById('load_preview_' + randomNumber).innerHTML = ''
    document.getElementById('load_preview_' + randomNumber).classList.remove('preview-older')
    ReactDOM.render(
      <ReactTinyLink cardSize="small" showGraphic={true} maxLine={2} minLine={1} url={url} />,
      document.getElementById('load_preview_' + randomNumber),
    )
  }

  const getLinksInText = (text) => {
    var expression =
      /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.com|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
    var regex = new RegExp(expression)
    /* eslint-disable */
    var emailRegex =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    var emailTest = emailRegex.test(text)
    let link = text.split(regex)
    const linkArray = []
    if (emailTest === false) {
      for (let i = 1; i < link.length; i += 2) {
        if (!/^(f|ht)tps?:\/\//i.test(link[i])) {
          linkArray.push(`https://${link[i]}`)
          link[i] = (
            <a className="link" key={'link' + i} target="_blank" rel="noopener noreferrer" href={`https://${link[i]}`}>
              {link[i]}
            </a>
          )
        } else {
          linkArray.push(link[i])
          link[i] = (
            <a className="link" key={'link' + i} target="_blank" rel="noopener noreferrer" href={link[i]}>
              {link[i]}
            </a>
          )
        }
      }

      linkArray &&
        linkArray.map((url, index) => {
          let preview
          if (hours <= 24) {
            preview = (
              <div key={index} className="link-preview">
                <ReactTinyLink cardSize="small" showGraphic={true} maxLine={2} minLine={1} url={url} />
              </div>
            )
          } else {
            var randomNumber = Math.random()
            preview = (
              <div key={index} id={`load_preview_${randomNumber}`} className="link-preview preview-older">
                Click to Load Preview
                <div className="load-preview" onClick={(e) => loadPreview(index, url, randomNumber)}></div>
                <a className="link" key={'link' + index} target="_blank" rel="noopener noreferrer" href={url}>
                  {url} <i className="fa fa-angle-right arrow-right"></i>
                </a>
              </div>
            )
          }
          return link.push(preview)
        })
    }
    return link
  }

  return (
    <div className="edit-schedule">
      <div className={`message-content ${props.message.scheduleMsg ? 'schedule-message' : ''}`}>
        {props.message.direction === 'in' &&
          ((positiveScore !== '' && <i className="far fa-smile sentiment_result"> </i>) ||
            (negativeScore !== '' && <i className="far fa-frown sentiment_result"> </i>))}{' '}
        {getLinksInText(message)}
        {props.message.scheduleMsg && (
          <span className="schedule-edit">
            <i className="fas fa-edit" onClick={toggleModal} />
          </span>
        )}
      </div>
      <Modal
        backdrop={false}
        isOpen={isModal}
        toggle={toggleModal}
        className={`${styleMode}-modal schedule-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader>Edit Schedule message</ModalHeader>
        <ModalBody>
          <div className="contact">
            <input
              type="text"
              name="label"
              className="form-control"
              placeholder="Message"
              value={scheduleMsg}
              onChange={(e) => setScheduleMsg(e.target.value)}
            />
            <div className="mt-2">
              <DateTimePicker
                onChange={setScheduleDate}
                value={scheduleDate}
                minDate={new Date()}
                disableClock={true}
                ref={datePicker}
                openWidgetsOnFocus={false}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => toggleModal()}>
            Cancel
          </Button>
          <Button color="danger" onClick={deleteScheduleData}>
            Delete
          </Button>
          <Button color="primary" onClick={editScheduleData}>
            Schedule Message
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}

export default Message
