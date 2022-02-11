import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  sendContact,
  saveUserNumber,
  saveEmailAlert,
  saveCallForward,
  saveVoicemailAlert,
  saveSoundAlert,
  saveFollowMe,
  saveNewCellPhone,
  getCellPhone,
  editCellPhoneData,
  deleteCellPhoneData,
  getDevices,
  saveSyncClio,
  startQuickCall,
} from '../../actions/message.action'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import classnames from 'classnames'
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap'
import InputRange from 'react-input-range'
import '../Home/Home.css'
import telIcon from '../../asset/media/svg/telicon-2.2.0.svg'
import Select from 'react-select'
import { UserAgent, Registerer, Inviter, SessionState } from 'sip.js'
import silhoutte from '../../asset/media/img/silhoutte.png'
import phoneSound from '../../asset/media/mp3/Phone-Ring.mp3'
import { ToastContainer, toast } from 'react-toastify'
import generator from 'generate-password'
import CryptoJS from 'crypto-js'
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

const Dialog = (props) => {
  const {
    setNumberToogle,
    changeSetNumberModal,
    userNumPanelToggle,
    userPhoneNumModal,
    contactUsModal,
    contactToogle,
    addCall,
    setAddCall,
    setPhoneState,
    phoneState,
  } = props
  const dispatch = useDispatch()

  const { numbers, userName, devices, followDevices, userDevice, getNumber } = useSelector((state) => state.message)
  const { styleMode, emailAlert, soundAlert } = useSelector((state) => state.message.numbers)
  const { clioSyncState } = useSelector((state) => state.message)
  const callForward = useSelector((state) => state.message.call_forward)

  const [contacts, updateContactInfo] = useState({
    toMail: 'joel@tsicloud.com',
    fromMail: '',
    subject: 'VentureTel SMS Suggestion',
    text: '',
  })

  const [settingTab, setSettingTab] = useState('settingTab1')
  const [callMode, updateCallMode] = useState(false)
  const [failoverMode, updateFailoverMode] = useState(false)
  const [curPhoneNum, updateSwitchPhoneNum] = useState('')
  const [userPhoneNum, updatePhoneNum] = useState([])
  const [mailAlert, setMailAlert] = useState(false)
  const [voicemailAlert, setVoicemailAlert] = useState(false)
  const [soundNotification, setSoundNotification] = useState(true)
  const [thisNumber, updateThisNumber] = useState('')
  const [leave, updateLeave] = useState(false)
  const [forward, updateForward] = useState(false)
  const [keep, updateKeep] = useState(false)
  const [followMe, setFollowMe] = useState(false)
  const [flowDevices, setFlowDevices] = useState([])
  const [addDeviceToggle, setAddDeviceToggle] = useState(false)
  const [syncClioState, setSyncClioState] = useState(false)
  const [softPhoneState, setSoftPhoneState] = useState(false)
  const [softPhoneDevices, setsoftPhoneDevices] = useState([])
  const [addDevice, setAddDevice] = useState({
    deviceName: '',
    deviceNumber: '',
  })
  const [deviceId, setDeviceId] = useState('')
  const [cellPhoneModalState, setCellPhoneModalState] = useState(false)
  const [deviceBasic, setDeviceBasic] = useState(true)
  const [deviceAdvanced, setDeviceAdvanced] = useState(false)
  const [cellPhoneVoicemail, setCellPhoneVoicemail] = useState(true)
  const [keepCallerID, setKeepCallerID] = useState(true)
  const [contactList, setContactList] = useState(true)
  const [sendCallData, setSendCallData] = useState({
    device_id: '',
    to_number: '',
  })
  const [initiatingCall, setInitiatingCall] = useState(false)
  const [initiatingQuickCall, setInitiatingQuickCall] = useState(false)
  const [receivingCall, setReceivingCall] = useState(false)
  const [invitation, setInvitation] = useState({})
  const [outgoingSession, setOutgoingSession] = useState({})
  const [dialogEstablished, setDialogEstablished] = useState(false)
  const [disableAcceptBtn, setDisableAcceptBtn] = useState(false)
  const [calleeName, setCalleeName] = useState('')
  const [muted, setMuted] = useState(false)
  const [receiverMuted, setReceiverMuted] = useState(false)
  const [audio] = useState(new Audio(phoneSound))
  const [password, setPassword] = useState('')

  const getPhoneSettingData = () => {
    const phoneArr = devices.filter((device) => device.device_type === 'softphone')
    if (phoneArr.length > 0) {
      setSoftPhoneState(phoneArr[0].enabled)
      setPhoneState && setPhoneState(phoneArr[0].enabled)
      setsoftPhoneDevices(phoneArr)
    }
  }
  const settingTabToggole = (tab) => {
    if (tab === 'settingTab4') {
      getFlowDevices()
      dispatch(getDevices())
    }
    if (tab === 'settingTab6') {
      getPhoneSettingData()
    }
    if (settingTab !== tab) setSettingTab(tab)
  }
  const onhandleContacts = (e) => {
    updateContactInfo({
      ...contacts,
      [e.target.name]: e.target.value,
    })
  }
  const sendContacts = () => {
    if (contacts.toMail && contacts.fromMail && contacts.subject && contacts.text) {
      dispatch(sendContact(contacts))
    }
    contactUsModal()
    updateContactInfo({
      ...contacts,
      toMail: 'joel@tsicloud.com',
      fromMail: '',
      subject: 'VentureTel SMS Suggestion',
      text: '',
    })
  }
  const selectPhoneNumber = (e) => {
    updateSwitchPhoneNum(e.target.id)
  }

  const phoneNumFormat = (number) => {
    if (number) {
      const phone_number = parsePhoneNumberFromString(number)
      const phoneNumber = phone_number.formatNational()
      return phoneNumber
    } else return number
  }
  const saveUserPhoneNum = () => {
    dispatch(saveUserNumber(curPhoneNum, userName.userEmail))
    userPhoneNumModal()
  }

  const saveEmailAlertState = () => {
    dispatch(saveEmailAlert(mailAlert, userName.userEmail))
    dispatch(saveVoicemailAlert(voicemailAlert))
    dispatch(saveSoundAlert(soundNotification, userName.userEmail))
    changeSetNumberModal()
  }
  const saveFollowState = () => {
    const array = []
    if (followMe === true) {
      flowDevices.forEach((device) => {
        if (device.ringState === true)
          array.push({
            id: device.id,
            endpoint_type: 'device',
            delay: device.min,
            timeout: Number(device.max - device.min),
          })
      })
    }
    dispatch(saveFollowMe(array))
    changeSetNumberModal()
  }
  const saveClioState = () => {
    dispatch(saveSyncClio(syncClioState))
    changeSetNumberModal()
  }
  const changeForwardMode = (mode) => {
    if (mode === 'off') {
      updateCallMode(false)
    } else if (mode === 'failover') {
      updateCallMode(true)
      updateFailoverMode(true)
    } else if (mode === 'on') {
      updateFailoverMode(false)
      updateCallMode(true)
    }
  }
  const changeCallForward = () => {
    const forwardData = {
      number: thisNumber,
      require_keypress: leave,
      direct_calls_only: forward,
      keep_caller_id: keep,
      enabled: callMode,
      failover: failoverMode,
      ignore_early_media: true,
      substitute: true,
    }
    dispatch(saveCallForward(forwardData))
    changeSetNumberModal(false)
  }
  const addCellPhoneModal = () => {
    setAddDevice({ deviceName: '', deviceNumber: '' })
    setCellPhoneModalState(false)
    setAddDeviceToggle(true)
  }
  const addCellPhone = () => {
    const newCellPhoneData = {
      call_forward: {
        enabled: true,
        keep_caller_id: keepCallerID,
        number: addDevice.deviceNumber,
        require_keypress: cellPhoneVoicemail,
      },
      contact_list: {
        exclude: contactList,
      },
      device_type: 'cellphone',
      enabled: true,
      name: addDevice.deviceName,
      media: {
        encryption: {
          enforce_security: false,
        },
        audio: {
          codecs: ['PCMU', 'PCMA'],
        },
        video: {
          codecs: [],
        },
      },
      suppress_unregister_notifications: true,
    }
    dispatch(saveNewCellPhone(newCellPhoneData))
    toggleAddDevice(false)
  }

  const editCellPhoneModal = (id) => {
    setDeviceId(id)
    setCellPhoneModalState(true)
    dispatch(getCellPhone(id))
    setAddDeviceToggle(true)
  }
  const editCellPhone = () => {
    const owner_id = localStorage.getItem('user_id')
    const cellPhoneData = {
      call_forward: {
        enabled: true,
        keep_caller_id: keepCallerID,
        number: addDevice.deviceNumber,
        require_keypress: cellPhoneVoicemail,
      },
      contact_list: {
        exclude: contactList,
      },
      device_type: 'cellphone',
      enabled: true,
      name: addDevice.deviceName,
      media: {
        encryption: {
          enforce_security: false,
        },
        audio: {
          codecs: ['PCMU', 'PCMA'],
        },
        video: {
          codecs: [],
        },
      },
      id: deviceId,
      owner_id: owner_id,
      suppress_unregister_notifications: true,
    }
    dispatch(editCellPhoneData(cellPhoneData, deviceId))
    toggleAddDevice(false)
  }
  const changeThisNumber = (e) => {
    updateThisNumber(e.target.value)
  }
  const changeLeave = () => {
    updateLeave(!leave)
  }
  const changeForward = () => {
    updateForward(!forward)
  }
  const changeKeep = () => {
    updateKeep(!keep)
  }
  const getFlowDevices = () => {
    const array = []
    let i = 0
    if (followDevices && followDevices.length > 0) {
      devices.forEach((device) => {
        i++
        const index = followDevices.findIndex((followDevice) => device.id === followDevice.id)
        if (index === -1) {
          array.push({
            id: device.id,
            name: device.name,
            deviceType: device.device_type,
            min: 0,
            max: 0,
            ringState: false,
          })
        } else {
          array.push({
            id: device.id,
            name: device.name,
            deviceType: device.device_type,
            min: followDevices[index].delay,
            max: followDevices[index].delay + followDevices[index].timeout,
            ringState: true,
          })
        }
        if (i === devices.length) {
          setFlowDevices(array)
          return
        }
      })
    } else {
      devices.forEach((device) => {
        i++
        array.push({
          id: device.id,
          name: device.name,
          deviceType: device.device_type,
          min: 0,
          max: 0,
          ringState: false,
        })
        if (i === devices.length) {
          setFlowDevices(array)
          return
        }
      })
    }
  }
  const changeTimeLine = (value, id) => {
    const newData = [...flowDevices]
    const index = newData.findIndex((device) => device.id === id)
    newData[index].min = value.min
    newData[index].max = value.max
    setFlowDevices(newData)
  }
  const changeTimeLineState = (id, state) => {
    const newData = [...flowDevices]
    const index = newData.findIndex((device) => device.id === id)
    newData[index].ringState = !state
    setFlowDevices(newData)
  }
  const toggleAddDevice = () => {
    setAddDeviceToggle(!addDeviceToggle)
  }
  const changeNewDevice = (e) => {
    setAddDevice({ ...addDevice, [e.target.id]: e.target.value })
  }
  const deleteCellPhone = () => {
    dispatch(deleteCellPhoneData(deviceId))
    toggleAddDevice()
  }
  const changeDeviceSetting = (mode) => {
    if (mode === 'basic') {
      setDeviceBasic(true)
      setDeviceAdvanced(false)
    } else if (mode === 'advanced') {
      setDeviceBasic(false)
      setDeviceAdvanced(true)
    }
  }
  useEffect(() => {
    if (numbers && numbers.savedNumber) {
      updateSwitchPhoneNum(numbers.savedNumber)
    }
    if (numbers && numbers.numberList) {
      updatePhoneNum(numbers.numberList)
    }
    // eslint-disable-next-line
  }, [numbers])
  useEffect(() => {
    if (callForward && callForward.call_forward) {
      const { call_forward } = callForward
      updateCallMode(call_forward.enabled)
      updateFailoverMode(call_forward.failover)
      updateThisNumber(call_forward.number)
      updateLeave(call_forward.require_keypress)
      updateForward(call_forward.direct_calls_only)
      updateKeep(call_forward.keep_caller_id)
      setVoicemailAlert(call_forward.vm_to_email_enabled)
    }
    if (callForward) {
      setVoicemailAlert(callForward.vm_to_email_enabled)
      if (callForward.smartpbx && callForward.smartpbx.find_me_follow_me)
        setFollowMe(callForward.smartpbx.find_me_follow_me.enabled)
    }
  }, [callForward])

  useEffect(() => {
    if (Object.keys(userDevice).length !== 0) {
      setAddDevice({ ...addDevice, deviceName: userDevice.deviceName, deviceNumber: userDevice.deviceNumber })
      setCellPhoneVoicemail(userDevice.cellPhoneVoicemail)
      setKeepCallerID(userDevice.keepCallerID)
      setContactList(userDevice.contactList)
    }
    // eslint-disable-next-line
  }, [userDevice])
  useEffect(() => {
    getFlowDevices()

    // eslint-disable-next-line
  }, [devices, followDevices, getNumber])

  useEffect(() => {
    setMailAlert(emailAlert)
  }, [emailAlert])

  useEffect(() => {
    setSoundNotification(soundAlert)
  }, [soundAlert])
  useEffect(() => {
    setSyncClioState(clioSyncState)
  }, [clioSyncState])

  useEffect(() => {
    setSoftPhoneState(softPhoneState)
    setPhoneState && setPhoneState(softPhoneState)
    // eslint-disable-next-line
  }, [softPhoneState])

  useEffect(() => {
    const phoneArr = devices.filter((device) => device.device_type === 'softphone')
    if (phoneArr.length > 0) {
      setPhoneState && setPhoneState(phoneArr[0].enabled)
      setsoftPhoneDevices(phoneArr)
    }
    // eslint-disable-next-line
  }, [devices])

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
    })
  }

  const changeHandleCallData = (e) => {
    setSendCallData({
      ...sendCallData,
      [e.target.id]: e.target.value,
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

  let userAgent
  let incomingSipOptions
  let timeoutRef = React.useRef()
  const incomingSipCall = () => {
    invitation.stateChange.addListener((state) => {
      switch (state) {
        case SessionState.Initial:
          break
        case SessionState.Establishing:
          break
        case SessionState.Established:
          setupRemoteMedia(invitation)
          break
        case SessionState.Terminating:
          break
        case SessionState.Terminated:
          cleanupMedia()
          setReceivingCall(!receivingCall)
          break
        default:
          throw new Error('Unknown session state.')
      }
    })

    // Accept INVITE
    invitation
      .accept(incomingSipOptions)
      .then(() => {
        setDisableAcceptBtn(true)
      })
      .catch((error) => {
        console.log('Failed to send INVITE')
      })
  }

  const generateUsername = () => {
    const username = generator.generate({
      length: 8,
      lowercase: true,
      uppercase: true,
    })
    return username
  }

  const generatePassword = () => {
    const pwd = generator.generate({
      length: 8,
      lowercase: true,
      uppercase: true,
    })
    return pwd
  }

  useEffect(() => {
    if (numbers.sip_username) {
      var bytes = CryptoJS.AES.decrypt(numbers.sip_password, `${CONFIG.secret_key}`)
      var decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8))
      setPassword(decryptedData)
      const uri = UserAgent.makeURI(`sip:${numbers.sip_username}@test.dev.venturetel.co`)
      const transportOptions = {
        server: 'wss://dev.venturetel.co:5065/',
      }
      const userAgentOptions = {
        authorizationPassword: decryptedData,
        authorizationUsername: numbers.sip_username,
        transportOptions,
        traceSip: true,
        uri,
        delegate: {
          onInvite: function (incoming) {
            setInvitation(incoming)
            setCalleeName(incoming.incomingInviteRequest.message.from._displayName)
            audio.play()
            console.log('INVITE received')

            setReceivingCall(!receivingCall)
            let constrainsDefault = {
              audio: true,
              video: false,
            }
            // eslint-disable-next-line
            incomingSipOptions = {
              sessionDescriptionHandlerOptions: {
                constraints: constrainsDefault,
              },
            }
            incoming.stateChange.addListener((newState) => {
              switch (newState) {
                case SessionState.Establishing:
                  break
                case SessionState.Established:
                  audio.pause()
                  break
                case SessionState.Terminated:
                  audio.pause()
                  setReceivingCall(false)
                  setDisableAcceptBtn(false)
                  break
                default:
                  break
              }
            })
          },
        },
      }
      // eslint-disable-next-line
      userAgent = new UserAgent(userAgentOptions)
      const registerer = new Registerer(userAgent)
      userAgent.start().then(() => {
        registerer.register()
      })
    }
  }, [numbers.sip_username])

  const endCall = () => {
    if (!disableAcceptBtn) {
      invitation.stateChange.addListener((state) => {
        switch (state) {
          case SessionState.Initial:
            break
          case SessionState.Establishing:
            break
          case SessionState.Established:
            break
          case SessionState.Terminating:
            break
          case SessionState.Terminated:
            break
          default:
            throw new Error('Unknown session state.')
        }
      })
      // Reject INVITE
      invitation
        .reject(incomingSipOptions)
        .then((info) => {
          console.log('Successfully reject INVITE')
          setReceivingCall(!receivingCall)
          setSendCallData({
            device_id: '',
            to_number: '',
          })
        })
        .catch((error) => {
          console.log('Failed to send INVITE', error)
        })
    } else {
      invitation.stateChange.addListener((state) => {
        switch (state) {
          case SessionState.Initial:
            break
          case SessionState.Establishing:
            break
          case SessionState.Established:
            break
          case SessionState.Terminating:
            break
          case SessionState.Terminated:
            break
          default:
            throw new Error('Unknown session state.')
        }
      })

      // Reject INVITE
      invitation
        .dispose(incomingSipOptions)
        .then(() => {
          console.log('Successfully reject INVITE')
          setReceivingCall(!receivingCall)
          setDisableAcceptBtn(false)
          setSendCallData({
            device_id: '',
            to_number: '',
          })
        })
        .catch((error) => {
          console.log('Failed to send INVITE', error)
        })
    }
  }

  const remoteStream = new MediaStream()
  function setupRemoteMedia(session) {
    const mediaElement = document.getElementById('remoteAudio')
    session.sessionDescriptionHandler.peerConnection.getReceivers().forEach((receiver) => {
      if (receiver.track) {
        remoteStream.addTrack(receiver.track)
      }
    })

    mediaElement.srcObject = remoteStream
    mediaElement.play()
  }

  function cleanupMedia() {
    const mediaElement = document.getElementById('remoteAudio')
    mediaElement.srcObject = null
    mediaElement.pause()
  }
  const mute = (session) => {
    setMuted(!muted)
    let peer = session.sessionDescriptionHandler.peerConnection
    let senders = peer.getSenders()

    if (!senders.length) return
    senders.forEach(function (sender) {
      if (sender.track) {
        sender.track.enabled = muted
      }
    })
  }

  const muteReceiver = (session) => {
    setReceiverMuted(!receiverMuted)
    let peer = session.sessionDescriptionHandler.peerConnection
    let senders = peer.getSenders()

    if (!senders.length) return
    senders.forEach(function (sender) {
      if (sender.track) {
        sender.track.enabled = receiverMuted
      }
    })
  }

  const startCall = () => {
    const device_id = sendCallData.device_id && sendCallData.device_id.value
    const device_name = sendCallData.device_id && sendCallData.device_id.label
    const phone_number = sendCallData.to_number && sendCallData.to_number
    if (device_name === 'Web Phone') {
      if (device_id !== '' && phone_number !== '' && phoneState) {
        setInitiatingCall(!initiatingCall)
        const uri = UserAgent.makeURI(`sip:${numbers.sip_username}@test.dev.venturetel.co`)
        const transportOptions = {
          server: 'wss://dev.venturetel.co:5065/',
        }

        const userAgentOptions = {
          authorizationPassword: password,
          authorizationUsername: numbers.sip_username,
          transportOptions,
          traceSip: true,
          uri,
        }
        userAgent = new UserAgent(userAgentOptions)

        userAgent.start().then(() => {
          const target = UserAgent.makeURI(`sip:${phone_number}@test.dev.venturetel.co`)
          if (!target) {
            throw new Error('Failed to create target URI.')
          }

          const inviter = new Inviter(userAgent, target, {
            sessionDescriptionHandlerOptions: {
              constraints: {
                audio: true,
                video: false,
              },
            },
          })
          setOutgoingSession(inviter)
          const inviteOptions = {
            requestDelegate: {
              onAccept: (response) => {
                audio.pause()
                clearTimeout(timeoutRef.current)
                console.log('Positive response = ', response)
              },
              onReject: (response) => {
                audio.pause()
                toast.error(response.message.reasonPhrase, {
                  position: toast.POSITION.TOP_RIGHT,
                })
                console.log('Negative response = onReject', response)
              },
              onProgress: async (response) => {
                if (response.message.reasonPhrase === 'Ringing' || 'Session Progress') {
                  audio.play()
                }
                timeoutRef.current = setTimeout(function () {
                  if (inviter._state === 'Established') {
                  } else {
                    audio.pause()
                    inviter.dispose()
                  }
                }, 19000)
                console.log('Negative response = onProgress', response)
              },
              onTrying: (response) => {
                console.log('Negative response = onTrying', response)
              },
            },
          }
          inviter.stateChange.addListener((newState) => {
            switch (newState) {
              case SessionState.Establishing:
                break
              case SessionState.Established:
                setupRemoteMedia(inviter)
                setDialogEstablished(true)

                break
              case SessionState.Terminated:
                if (dialogEstablished) {
                  cleanupMedia()
                }
                setInitiatingCall(false)
                setDialogEstablished(false)
                setAddCall(!addCall)
                break
              default:
                break
            }
          })
          // Send initial INVITE request
          inviter
            .invite(inviteOptions)
            .then((info) => {
              console.log('INVITE sent')
              // INVITE sent
            })
            .catch((error) => {
              console.log('errr', error)
              // INVITE did not send
            })
        })
      }
    } else {
      dispatch(startQuickCall(device_id, phone_number))
      setInitiatingQuickCall(!initiatingQuickCall)
    }
  }
  const hangup = () => {
    if (dialogEstablished) {
      outgoingSession.bye()
    } else {
      outgoingSession.stateChange.addListener((newState) => {
        switch (newState) {
          case SessionState.Establishing:
            break
          case SessionState.Established:
            break
          case SessionState.Terminated:
            break
          default:
            break
        }
      })
      outgoingSession
        .cancel()
        .then(() => {
          setInitiatingCall(!initiatingCall)
          setSendCallData({
            device_id: '',
            to_number: '',
          })

          // INVITE Cancel
        })
        .catch((error) => {
          console.log('errr', error)
          // INVITE did not send
        })
    }
  }
  const toggleInitiatingCall = () => {
    setInitiatingCall(!initiatingCall)
    setAddCall(!addCall)
  }
  const toggleInitiatingQuickCall = () => {
    setInitiatingQuickCall(!initiatingQuickCall)
    setAddCall(!addCall)
  }
  const toggleReceivingCall = () => {
    setReceivingCall(!receivingCall)
  }

  const saveSoftPhone = () => {
    const newCellPhoneData = {
      call_forward: {
        enabled: true,
        keep_caller_id: keepCallerID,
        require_keypress: cellPhoneVoicemail,
      },
      contact_list: {
        exclude: contactList,
      },
      device_type: 'softphone',
      enabled: true,
      name: 'Web Phone',
      media: {
        encryption: {
          enforce_security: false,
        },
        audio: {
          codecs: ['PCMU', 'PCMA'],
        },
        video: {
          codecs: [],
        },
      },
      sip: {
        username: generateUsername(),
        password: generatePassword(),
      },
      suppress_unregister_notifications: true,
    }
    if (softPhoneState === true && softPhoneDevices.length === 0) {
      dispatch(saveNewCellPhone(newCellPhoneData))
      changeSetNumberModal()
    } else {
      let softPhoneArr = softPhoneDevices.map((item) => item.id)
      dispatch(deleteCellPhoneData(softPhoneArr[0]))
      setsoftPhoneDevices([])
      changeSetNumberModal()
    }
  }

  return (
    <div>
      <ToastContainer autoClose={8000} />
      <Modal
        size="lg"
        isOpen={setNumberToogle}
        toggle={changeSetNumberModal}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader toggle={changeSetNumberModal}>
          <i className="fas fa-cog"></i> Settings
        </ModalHeader>
        <ModalBody>
          <div>
            <Nav tabs>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: settingTab === 'settingTab1',
                  })}
                  onClick={() => {
                    settingTabToggole('settingTab1')
                  }}
                >
                  Call Forwarding
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: settingTab === 'settingTab4',
                  })}
                  onClick={() => {
                    settingTabToggole('settingTab4')
                  }}
                >
                  Follow me / Find me
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: settingTab === 'settingTab3',
                  })}
                  onClick={() => {
                    settingTabToggole('settingTab3')
                  }}
                >
                  Notifications
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: settingTab === 'settingTab5',
                  })}
                  onClick={() => {
                    settingTabToggole('settingTab5')
                  }}
                >
                  Integrations
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  className={classnames({
                    active: settingTab === 'settingTab6',
                  })}
                  onClick={() => {
                    settingTabToggole('settingTab6')
                  }}
                >
                  SoftPhone
                </NavLink>
              </NavItem>
            </Nav>
          </div>
          <TabContent activeTab={settingTab}>
            <TabPane tabId="settingTab1">
              <span className="tab-title">User Call Forwarding Settings</span>
              <div className="tab-content">
                <div className="tab-pane show active" role="tabpanel">
                  <div className="call-forward-btns">
                    <div
                      className={`btn call-forward-${styleMode} ${!callMode ? 'btn-primary' : ''}`}
                      onClick={() => changeForwardMode('off')}
                    >
                      Off
                    </div>
                    <div
                      className={`btn call-forward-${styleMode} ${callMode && failoverMode ? 'btn-primary' : ''}`}
                      onClick={() => changeForwardMode('failover')}
                    >
                      Failover Mode
                    </div>
                    <div
                      className={`btn call-forward-${styleMode} ${callMode && !failoverMode ? 'btn-primary' : ''}`}
                      onClick={() => changeForwardMode('on')}
                    >
                      On
                    </div>
                  </div>
                  {callMode && (
                    <div className="mt-3">
                      {failoverMode && (
                        <span>
                          In "Failover Mode", the call-forward settings will only apply when none of this user's devices
                          are registered.
                        </span>
                      )}
                      <div>
                        <label htmlFor="allcalls" className="col-form-label">
                          Forward all calls to
                        </label>
                        <select className="form-control" id="allcalls">
                          <option value="1">A Mobile Phone</option>
                          <option value="2">A Desk Phone</option>
                        </select>
                      </div>
                      <div>
                        <label htmlFor="thisnumber" className="col-form-label">
                          This Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="thisnumber"
                          placeholder="+120812345678"
                          value={thisNumber}
                          onChange={changeThisNumber}
                        />
                      </div>
                      <div className="mt-3">
                        <div className="form-item custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="leave"
                            checked={leave === false}
                            onChange={changeLeave}
                          />
                          <label className="custom-control-label" htmlFor="leave">
                            Leave voicemails on forwarded numbers
                          </label>
                        </div>
                        <div className="form-item custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="forward"
                            checked={forward === true}
                            onChange={changeForward}
                          />
                          <label className="custom-control-label" htmlFor="forward">
                            Forward direct calls only
                          </label>
                        </div>
                        <div className="form-item custom-control custom-switch">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="keep"
                            checked={keep === true}
                            onChange={changeKeep}
                          />
                          <label className="custom-control-label" htmlFor="keep">
                            Keep Original Caller-ID
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right">
                <Button color="primary" onClick={changeCallForward}>
                  Save
                </Button>
              </div>
            </TabPane>
            <TabPane tabId="settingTab4">
              <div className="following-modal-header">
                <div className="form-item custom-control custom-switch mt-2 ">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    checked={followMe === true}
                    id="followmeCheck"
                    onChange={() => setFollowMe(!followMe)}
                  />
                  <label className="custom-control-label" htmlFor="followmeCheck">
                    Find me, Follow me Settings
                  </label>
                </div>
                <Button color="primary" className="add-new-phone" onClick={addCellPhoneModal}>
                  + Add a Cell Phone
                </Button>
              </div>

              {followMe && (
                <div>
                  <div className="row mb-3 mt-5">
                    <div className="col-sm-3"></div>
                    <div className="col-sm-7">
                      <div className="scale-container">
                        <div className="scale-element">
                          <span>20 Sec</span>
                        </div>
                        <div className="scale-element">
                          <span>40 Sec</span>
                        </div>
                        <div className="scale-element">
                          <span>60 Sec</span>
                        </div>
                        <div className="scale-element">
                          <span>80 Sec</span>
                        </div>
                        <div className="scale-element">
                          <span>100 Sec</span>
                        </div>
                        <div className="scale-element">
                          <span>120 Sec</span>
                        </div>
                        <span>0 Sec</span>
                      </div>
                    </div>
                    <div className="col-sm-2 check-ring-state">Enable</div>
                  </div>
                  {flowDevices &&
                    flowDevices.length > 0 &&
                    flowDevices.map((device, index) => (
                      <div className="row mb-5" key={index}>
                        <div className="col-sm-3 check-ring-name">
                          {device.deviceType === 'cellphone' && (
                            <div onClick={() => editCellPhoneModal(device.id)}>
                              <svg className="device-icon cell-phone">
                                <use href={`${telIcon}#phone`} />
                              </svg>
                              <span className="cell-phone-text">{device.name}</span>
                            </div>
                          )}
                          {device.deviceType === 'sip_device' && (
                            <div>
                              <svg className="device-icon">
                                <use href={`${telIcon}#device-voip-phone`} />
                              </svg>
                              <span>{device.name}</span>
                            </div>
                          )}
                          {device.deviceType === 'softphone' && (
                            <div>
                              <svg className="device-icon">
                                <use href={`${telIcon}#device-soft-phone`} />
                              </svg>
                              <span>{device.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="col-sm-7 check-ring-state">
                          <InputRange
                            maxValue={120}
                            minValue={0}
                            value={{ min: device.min, max: device.max }}
                            disabled={device.ringState === false}
                            onChange={(v) => changeTimeLine(v, device.id)}
                          />
                        </div>
                        <div className="col-sm-2 check-ring-state">
                          <div className="form-item custom-control custom-switch">
                            <input
                              type="checkbox"
                              className="custom-control-input"
                              checked={device.ringState === true}
                              id={`ringChk${index}`}
                              onChange={() => changeTimeLineState(device.id, device.ringState)}
                            />
                            <label className="custom-control-label" htmlFor={`ringChk${index}`}></label>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
              <div className="text-right">
                <Button color="primary mt-3" onClick={saveFollowState}>
                  Save
                </Button>
              </div>
            </TabPane>
            <TabPane tabId="settingTab3">
              <div className="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={mailAlert === true}
                  id="emailalert"
                  onChange={() => setMailAlert(!mailAlert)}
                />
                <label className="custom-control-label" htmlFor="emailalert">
                  SMS Email Alerts
                </label>
              </div>
              <div className="form-item custom-control custom-switch mt-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={voicemailAlert === true}
                  id="voicealert"
                  onChange={() => setVoicemailAlert(!voicemailAlert)}
                />
                <label className="custom-control-label" htmlFor="voicealert">
                  Voicemails to Email Alerts
                </label>
              </div>
              <div className="form-item custom-control custom-switch mt-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={soundNotification === true}
                  id="soundalert"
                  onChange={() => setSoundNotification(!soundNotification)}
                />
                <label className="custom-control-label" htmlFor="soundalert">
                  Sound Alerts
                </label>
              </div>
              <div className="text-right">
                <Button color="primary" onClick={saveEmailAlertState}>
                  Save
                </Button>
              </div>
            </TabPane>
            <TabPane tabId="settingTab5">
              <div className="form-item custom-control custom-switch">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={syncClioState}
                  onChange={() => setSyncClioState(!syncClioState)}
                  id="clio"
                />
                <label className="custom-control-label" htmlFor="clio">
                  Sync with Clio
                </label>
              </div>
              <div className="text-right">
                <Button color="primary" onClick={saveClioState}>
                  Save
                </Button>
              </div>
            </TabPane>
            <TabPane tabId="settingTab6">
              <div className="form-item soft-form custom-control custom-switch">
                <div className="check-enable">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    checked={softPhoneState === true}
                    onChange={() => {
                      setSoftPhoneState(!softPhoneState)
                      setPhoneState && setPhoneState(!softPhoneState)
                    }}
                    id="softPhone"
                  />
                  <label className="custom-control-label" htmlFor="softPhone">
                    Enable SoftPhone
                  </label>
                </div>
              </div>

              <div className="text-right">
                <Button color="primary" onClick={saveSoftPhone}>
                  Save
                </Button>
              </div>
            </TabPane>
          </TabContent>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={userNumPanelToggle}
        toggle={userPhoneNumModal}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader toggle={userPhoneNumModal}>
          <i className="ti-widget-alt"></i>Select Phone Number
        </ModalHeader>
        <ModalBody>
          <div>
            <span className="tab-title">Please select default number.</span>
            <div className="tab-content">
              <div className="tab-pane show active" id="account" role="tabpanel">
                {userPhoneNum &&
                  userPhoneNum.map((num, i) => (
                    <div className="form-item custom-control custom-switch" key={i}>
                      <input
                        type="checkbox"
                        className="custom-control-input"
                        id={num.number}
                        checked={num.number === curPhoneNum}
                        onChange={selectPhoneNumber}
                      />
                      <label className="custom-control-label" htmlFor={num.number}>
                        {phoneNumFormat(num.number)}
                      </label>
                      {num.msgCount > 0 && <div className="unread-message-count ml-2">{num.msgCount}</div>}
                    </div>
                  ))}
              </div>
            </div>
            <div className="text-right">
              <Button color="primary" onClick={saveUserPhoneNum}>
                Save
              </Button>
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={contactToogle}
        toggle={contactUsModal}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader toggle={contactUsModal}>
          <i className="ti-envelope"></i> Feature Request
        </ModalHeader>
        <ModalBody>
          <div className="contact">
            <span>
              We welcome your feedback and suggestions to make this app and your business communications better. Please
              let us know of features or suggestions that would help make this product better. We'll do our best to make
              it possible. We're building our services around our clients needs, and so your feedback and suggestions
              are very important to us!
            </span>

            <div className="input-group mt-2">
              <div className="input-group mt-2">
                <input
                  type="text"
                  name="fromMail"
                  value={contacts.fromMail}
                  className="form-control"
                  placeholder="Your Mail Address"
                  onChange={onhandleContacts}
                />
              </div>
            </div>
            <div className="input-group mt-2">
              <textarea
                className="form-control"
                id="about-text"
                name="text"
                value={contacts.text}
                placeholder="Text"
                onChange={onhandleContacts}
              ></textarea>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={sendContacts}>
            Send
          </Button>
        </ModalFooter>
      </Modal>
      <Modal
        isOpen={addDeviceToggle}
        toggle={toggleAddDevice}
        className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader toggle={toggleAddDevice}>
          <svg className="device-icon">
            <use href={`${telIcon}#phone`} />
          </svg>
          {cellPhoneModalState ? 'Edit a Cell Phone' : 'Add a Cell Phone'}
        </ModalHeader>
        <ModalBody>
          <div className="call-forward-btns">
            <div
              className={`btn call-forward-${styleMode} ${deviceBasic ? 'btn-primary' : ''}`}
              onClick={() => changeDeviceSetting('basic')}
            >
              Basic setting
            </div>
            <div
              className={`btn call-forward-${styleMode} ${deviceAdvanced ? 'btn-primary' : ''}`}
              onClick={() => changeDeviceSetting('advanced')}
            >
              Advanced
            </div>
          </div>
          {deviceBasic && (
            <div>
              <label htmlFor="deviceName" className="col-form-label">
                Device Name
              </label>
              <input
                type="text"
                className="form-control"
                id="deviceName"
                value={addDevice.deviceName}
                onChange={changeNewDevice}
              />
              <label htmlFor="deviceNumber" className="col-form-label">
                Phone Number
              </label>
              <input
                type="text"
                className="form-control"
                id="deviceNumber"
                placeholder="+120812345678"
                value={addDevice.deviceNumber}
                onChange={changeNewDevice}
              />
            </div>
          )}
          {deviceAdvanced && (
            <div>
              <div className="form-item custom-control custom-switch mt-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={cellPhoneVoicemail === false}
                  id="cellPhoneVoicemail"
                  onChange={() => setCellPhoneVoicemail(!cellPhoneVoicemail)}
                />
                <label className="custom-control-label" htmlFor="cellPhoneVoicemail">
                  Allow use of cellphone's voicemail
                </label>
              </div>
              <div className="form-item custom-control custom-switch mt-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={keepCallerID === true}
                  id="originalCallID"
                  onChange={() => setKeepCallerID(!keepCallerID)}
                />
                <label className="custom-control-label" htmlFor="originalCallID">
                  Keep Original Caller-ID
                </label>
              </div>
              <div className="form-item custom-control custom-switch mt-2">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  checked={contactList === true}
                  id="contactList"
                  onChange={() => setContactList(!contactList)}
                />
                <label className="custom-control-label" htmlFor="contactList">
                  Hide from Contact List
                </label>
              </div>
            </div>
          )}
          <div className="device-footer">
            <div className="text-left mt-4">
              {cellPhoneModalState && (
                <Button color="danger" onClick={deleteCellPhone}>
                  <i className="fas fa-trash"></i> <span className="ml-2">Delete Cell Phone</span>
                </Button>
              )}
            </div>
            <div className="text-right mt-4">
              {cellPhoneModalState ? (
                <Button color="primary" onClick={editCellPhone}>
                  Edit
                </Button>
              ) : (
                <Button color="primary" onClick={addCellPhone}>
                  Save
                </Button>
              )}
            </div>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={addCall}
        toggle={toggleAddCall}
        className={`${styleMode}-modal call-modal modal-dialog modal-dialog-centered modal-dialog-zoom quick-call-modal`}
      >
        <ModalHeader className="call-header">Call</ModalHeader>
        <ModalBody>
          <div className="contact">
            <input
              type="text"
              className="form-control  mb-3"
              placeholder="To Number"
              value={sendCallData.to_number}
              id="to_number"
              onChange={changeHandleCallData}
            />

            <Select
              styles={customStyles}
              isClearable
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
        className={`modal-received-call modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalBody className="initiating-call">
          <img src={silhoutte} alt="avatar" />
          <h2 className="receiver-name">Calling {sendCallData.to_number}</h2>
          <div className="receiver-voice">
            <audio src="" id="remoteAudio" controls="controls" />
            <div>
              {dialogEstablished === true &&
                (muted ? (
                  <i onClick={() => mute(outgoingSession)} className="audio-mic fas fa-microphone-slash"></i>
                ) : (
                  <i onClick={() => mute(outgoingSession)} className="audio-mic fas fa-microphone"></i>
                ))}
            </div>
          </div>
          <Button color="secondary" className="end-call" id="hangup" onClick={hangup}>
            <i className="fas fa-times"></i>
          </Button>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={receivingCall}
        toggle={toggleReceivingCall}
        className={`modal-dialog modal-received-call modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalBody className="initiating-call">
          <img src={silhoutte} alt="avatar" />
          <h2 className="receiver-name">{calleeName} calling ...</h2>
          <div>
            <div className="receiver-voice">
              <audio src="" id="remoteAudio" controls="controls" />
              <div>
                {disableAcceptBtn &&
                  (receiverMuted ? (
                    <i onClick={() => muteReceiver(invitation)} className="audio-mic fas fa-microphone-slash"></i>
                  ) : (
                    <i onClick={() => muteReceiver(invitation)} className="audio-mic fas fa-microphone"></i>
                  ))}
              </div>
            </div>
            <Button color="secondary" className="end-call" onClick={endCall}>
              <i className="fas fa-times"></i>
            </Button>
            <Button color="primary" disabled={disableAcceptBtn} className="receive-call" onClick={incomingSipCall}>
              <i className="fas fa-phone-alt"></i>
            </Button>
          </div>
        </ModalBody>
      </Modal>
      <Modal
        isOpen={initiatingQuickCall}
        toggle={toggleInitiatingQuickCall}
        className={`modal-received-call modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader className="quick-call-header" toggle={toggleInitiatingQuickCall}></ModalHeader>
        <ModalBody className="initiating-call">
          <img src={silhoutte} alt="avatar" />
          <h2 className="receiver-name">Calling {sendCallData.to_number}</h2>
        </ModalBody>
      </Modal>
    </div>
  )
}

export default Dialog
