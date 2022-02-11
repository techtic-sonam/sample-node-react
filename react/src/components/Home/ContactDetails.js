import React, { Fragment, useEffect, useState } from 'react'
// import { ReactTinyLink } from 'react-tiny-link'
import './message.css'
import axios from 'axios'
import CONFIG from '../../constants/config'
import silhoutte from '../../asset/media/img/silhoutte.png'
import telIcon from '../../asset/media/svg/telicon-2.2.0.svg'
import Audioplayer from '../Voicemails/Audioplayer'
import { VoiceMailListPopUp } from './VoiceMailListPopUp'
import { CallListPopUp } from './CallListPopUp'
import * as CONSTS from '../../constants/const'

const ContactDetails = (props) => {
  const { setShowInfoPane } = props
  let account_id = localStorage.getItem('account_id')
  const auth_token = localStorage.getItem('token')
  const vmbox_id = props.voiceMailDetails.vmbox.id
  const [showVoiceMailDialog, setShowVoiceMailDialog] = useState(false)
  const [showCallListDialog, setShowCallListDialog] = useState(false)
  const [audioPlay, setAaudioPlay] = useState(false)
  const [audioId, setAudioId] = useState('')
  const [voiceMailDetails, setVoiceMailDetails] = useState([])
  
  const phoneNumbers = []
  if (props.memberInformation.phoneNumbers && props.memberInformation.phoneNumbers.length > 0) {
    props.memberInformation.phoneNumbers.forEach((element, index) => {
      phoneNumbers.push(
        <span key={index}>
          <br />
          {element.contact_number}
        </span>,
      )
    })
  }

  useEffect(() => {
    let voiceMails = []
    props.voiceMailDetails.messages.map((voiceMail) => {
      if (voiceMail.caller_id_number === props.memberInformation.memberNum) {
        voiceMails.push(voiceMail)
      }
      return voiceMail
    })
    setVoiceMailDetails(voiceMails)
  }, [props.voiceMailDetails, props.memberInformation.memberNum])

  function audioPlayer(key) {
    setAaudioPlay(!audioPlay)
    setAudioId(key)
  }

  function audioPlayerEnd(key, vmbox_id, media_id, state) {
    if (state === 'new') {
      let url = `${CONFIG.API_URL}/accounts/${this.state.account_id}/vmboxes/${vmbox_id}/messages/${media_id}`
      axios
        .post(url)
        .then((res) => {
          // this.props.getallVmboxes()
          // this.props.getmainvmboxes()
        })
        .catch((error) => {
          console.log(error)
        })
    }
    setAaudioPlay(!audioPlay)
    setAudioId(key)
  }

  function getDuration(totalSeconds) {
    let hours = Math.floor(totalSeconds / 3600)
    let minutes = Math.floor((totalSeconds - hours * 3600) / 60)
    let seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60)
    seconds = Math.round(seconds * 100) / 100

    let result = ''
    if (hours !== 0) {
      result += (hours < 10 ? '0' + hours : hours) + ':'
    }
    result += (minutes < 10 ? '0' + minutes : minutes) + ':'
    result += seconds < 10 ? '0' + seconds : seconds

    return result
  }

  const convertDateTime = (time) => {
    const date = new Date(time)
    const monthArray = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let year = date.getFullYear()
    let month = monthArray[date.getMonth()]
    let day = date.getDate()
    let hours = date.getHours()
    let minutes = date.getMinutes()

    let ampm = hours >= 12 ? 'pm' : 'am'
    hours = hours % 12
    hours = hours ? hours : 12
    minutes = minutes < 10 ? '0' + minutes : minutes
    const strTime = month + ' ' + day + ', ' + year + ' - ' + hours + ':' + minutes + ' ' + ampm
    return strTime
  }

  const convertCallTime = (totalSeconds) => {
    let hours = Math.floor(totalSeconds / 3600)
    let minutes = Math.floor((totalSeconds - hours * 3600) / 60)
    let seconds = Math.floor(totalSeconds - hours * 3600 - minutes * 60)
    seconds = Math.round(seconds * 100) / 100

    let result = ''
    if (hours !== 0) {
      result += (hours < 10 ? '0' + hours : hours) + ':'
    }
    result += (minutes < 10 ? '0' + minutes : minutes) + ':'
    result += seconds < 10 ? '0' + seconds : seconds

    return result
  }

  const isVoiceMailDialog = (val) => {
    setShowVoiceMailDialog(val)
  }

  const toggleVoiceMailDialog = (val) => {
    setShowVoiceMailDialog(val)
  }

  const isCallListDialog = (val) => {
    setShowCallListDialog(val)
  }

  const toggleCallListDialog = (val) => {
    setShowCallListDialog(val)
  }

  return (
    <Fragment>
      <div className="col-3 sidebar-group float-right mr-1 overflow-auto contact-details">
        <div className="sidebar active">
          <header>
            <button
              type="button"
              className="btn btn-sm btn-secondary close"
              aria-label="Close"
              onClick={() => {
                setShowInfoPane(false)
                props.isContactInformation(false)
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          </header>
          <div className="row text-center mt-3 mb-1">
            <div className="col-12">
              <figure className="avatar about-avatar avatar-lg">
                {props.memberInformation.avatar ? (
                  <img src={`${CONFIG.serverURL}/users/${props.memberInformation.avatar}`} alt="avatar" />
                ) : (
                  <img src={silhoutte} alt="avatar" />
                )}
              </figure>
            </div>
            <div className="col-12">
              <h4 className="about-labelName">
                {props.memberInformation.labelName !== ''
                  ? props.memberInformation.labelName
                  : props.memberName === undefined
                  ? props.memberInformation.labelName
                  : props.memberName.labelName}
              </h4>
            </div>
            <div className="col-12">
              <h4 className="about-company">{props.memberInformation.company}</h4>
            </div>
          </div>
          <ul className="list-group list-group-flush w-100">
            {/* <li className="list-group-item d-block">
              <h5 className="">About</h5>
              <span>Duis et malesuada mi. Quisque tincidunt lorem quis.</span>
            </li> */}
            <li className="about-phone">
              <h5 className="about-phone-item">Phone:</h5>
              <div>
                <span className="about-phone-number">{props.memberInformation.memberNum}</span>
                {phoneNumbers}
              </div>
            </li>
            {/* <li className="list-group-item d-block">
              <h5 className="">Media</h5>
              <div className="row">
                <ul className="list-inline media-list">
                  <li className="list-inline-item">
                    <figure className="avatar avatar-lg">
                      <img src={silhoutte} alt="avatar" />
                    </figure>
                  </li>
                  <li className="list-inline-item">
                    <figure className="avatar avatar-lg">
                      <img src={silhoutte} alt="avatar" />
                    </figure>
                  </li>
                  <li className="list-inline-item">
                    <figure className="avatar avatar-lg">
                      <img src={silhoutte} alt="avatar" />
                    </figure>
                  </li>
                  <li className="list-inline-item">
                    <figure className="avatar avatar-lg">
                      <img src={silhoutte} alt="avatar" />
                    </figure>
                  </li>
                </ul>
              </div>
            </li>
            <li className="list-group-item d-block">
              <h5 className="">City</h5>
              <span>{props.memberInformation.city + '/' + props.memberInformation.state}.</span>
            </li>
            <li className="list-group-item d-block">
              <h5 className="">Website</h5>
              <span>www.example.com</span>
            </li> */}
            <li className="about-voicemail d-block">
              <div>
                <h5>Voicemail Messages </h5>
                <h6 className="about-see float-right" onClick={() => isVoiceMailDialog(true)}>
                  See all <i className="fas fa-greater-than"></i>
                </h6>
              </div>
              <ul className="media-list about-voicemail-list p-0">
                {voiceMailDetails &&
                  voiceMailDetails.length > 0 &&
                  voiceMailDetails.slice(0, 5).map((voiceMail, index) => {
                    // let URL = `${CONFIG.API_URL}/accounts/${account_id}/vmboxes/${props.voiceMailDetails.vmbox.id}/messages/${voiceMail.media_id}/raw?auth_token=${auth_token}`
                    // console.log(voiceMail, props.voiceMailDetails, "voiceMailDetails")
                    return (
                      <span key={index}>
                        {voiceMail.caller_id_number === props.memberInformation.memberNum ? (
                          <li className="list-inline-item d-block call-history-row about-call-history" key={index}>
                            {audioPlay && voiceMail.media_id === audioId ? (
                              <div className="row">
                                <div className="col-md-10">
                                  <Audioplayer
                                    props={{
                                      vmbox_id: vmbox_id,
                                      account_id: account_id,
                                      auth_token: auth_token,
                                      audioPlay: audioPlay,
                                      media_id: audioId,
                                    }}
                                  />
                                </div>
                                <div className="col-md-2">
                                  <button
                                    className="audio-close"
                                    onClick={() =>
                                      audioPlayerEnd(audioPlay, vmbox_id, voiceMail.media_id, voiceMail.folder)
                                    }
                                  >
                                    <i className="fas fa-times"></i>
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <span>
                                <span className="ml-1">
                                  <svg
                                    className="audioplay about-audio"
                                    onClick={() => audioPlayer(voiceMail.media_id)}
                                  >
                                    <use href={`${telIcon}#play--circle`} />
                                  </svg>
                                  {/* <a href={URL}>
                                    <svg className="gray-icon">
                                      <use href={`${telIcon}#download-cloud`} />
                                    </svg>
                                  </a> */}
                                </span>
                                <span className="ml-1">
                                  {convertDateTime((voiceMail.timestamp - 62167219200) * 1000)}
                                </span>
                                <span className="ml-1">{getDuration(voiceMail.length / 1000)}</span>
                              </span>
                            )}
                          </li>
                        ) : (
                          ''
                        )}
                      </span>
                    )
                  })}
                {voiceMailDetails.length === 0 ? (
                  <div className="col-12 text-center">{CONSTS.EMPTY_VOICEMAIL_LIST_MESSAGE}</div>
                ) : (
                  ''
                )}
              </ul>
            </li>
            <li className="about-call d-block">
              <div>
                <h5>Recent Calls</h5>{' '}
                <h6 className="about-see float-right" onClick={() => isCallListDialog(true)}>
                  See all <i className="fas fa-greater-than"></i>
                </h6>
              </div>
              <ul className="media-list p-0">
                {props.callDetails &&
                  props.callDetails.length > 0 &&
                  props.callDetails.slice(0, 5).map((call, index) => {
                    return (
                      <li className="list-inline-item d-block call-history-row about-call-history" key={index}>
                        <div className="about-call-icon">
                          <i className="fas fa-phone-alt"></i>
                        </div>
                        {convertDateTime(call.iso_8601_combined) + ', ' + convertCallTime(call.billing_seconds)}
                      </li>
                    )
                  })}
                {props.callDetails.length === 0 ? (
                  <div className="col-12 text-center">{CONSTS.EMPTY_CALL_LIST_MESSAGE}</div>
                ) : (
                  ''
                )}
              </ul>
            </li>
            {/* <li className="list-group-item d-block">
              <h5 className="">Social Links</h5>
              <span></span>
              <div className="form-buttons">
                <button className="btn btn-info btn-floating mr-1 mt-1">
                  <i className="fab fa-facebook-f"></i>
                </button>
                <button className="btn btn-twitter btn-floating mr-1 mt-1">
                  <i className="fab fa-twitter"></i>
                </button>
                <button className="btn btn-dribbble btn-floating mr-1 mt-1">
                  <i className="fab fa-dribbble"></i>
                </button>
                <button className="btn btn-whatsapp btn-floating mr-1 mt-1">
                  <i className="fab fa-whatsapp"></i>
                </button>
                <button className="btn btn-linkedin btn-floating mr-1 mt-1">
                  <i className="fab fa-linkedin-in"></i>
                </button>
                <button className="btn btn-google btn-floating mr-1 mt-1">
                  <i className="fab fa-google"></i>
                </button>
                <button className="btn btn-behance btn-floating mr-1 mt-1">
                  <i className="fab fa-behance"></i>
                </button>
                <button className="btn btn-instagram btn-floating mr-1 mt-1">
                  <i className="fab fa-instagram"></i>
                </button>
              </div>
            </li> */}
          </ul>
          <div className="row text-left ml-1">
            <div className="col-12"></div>
          </div>
        </div>
      </div>
      {showVoiceMailDialog && (
        <VoiceMailListPopUp
          isVoiceMailDialog={isVoiceMailDialog}
          showVoiceMailDialog={showVoiceMailDialog}
          memberInformation={props.memberInformation}
          toggleVoiceMailDialog={toggleVoiceMailDialog}
          VoiceMails={props.voiceMailDetails}
          voiceMailCounter={voiceMailDetails.length}
          account_id={account_id}
        />
      )}
      {showCallListDialog && (
        <CallListPopUp
          isCallListDialog={isCallListDialog}
          showCallListDialog={showCallListDialog}
          toggleCallListDialog={toggleCallListDialog}
          CallLists={props.callDetails}
          callCounter={props.callDetails.length}
        />
      )}
    </Fragment>
  )
}

export default ContactDetails
