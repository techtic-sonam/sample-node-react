import React, { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import axios from 'axios'
import openSocket from 'socket.io-client'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { ToastContainer, toast } from 'react-toastify'
import jsPDF from 'jspdf'
import path from 'path'
import classnames from 'classnames'
import mime from 'mime-types'
import html2canvas from 'html2canvas'
import { confirmAlert } from 'react-confirm-alert'
import 'react-confirm-alert/src/react-confirm-alert.css'
import _ from 'lodash'
import { Tooltip, TabContent, TabPane, Nav, NavItem, NavLink, Card, CardBody, Badge } from 'reactstrap'
import Autocomplete from 'react-autocomplete'
import ReactPaginate from 'react-paginate'

import Sidebar from '../Sidebar/Sidebar'
import Dialog from '../Sidebar/Dialog'
import Printer from './Printer'
import DropMenu from './DropMenu'
import ScheduleSMS from './ScheduleSMS'
import Notifications from './Notifications'
import ContactDetails from './ContactDetails'
import ContactDetailsSave from './ContactDetailsSave'
import StartConverstaion from './StartConverstaion'

import {
  getUserData,
  sendMessage,
  getMessage,
  getAllNumbers,
  getPrintMessage,
  setMemberNum,
  newMessage,
  deleteConversation,
  getCallForward,
  getDevices,
  getFollowDevices,
  startConversation,
  getAllCalls,
  getClioAuth,
  getAllAssignConversations,
  setAssignedMember,
  getAssignedConversations,
  getAssignedMessage,
  getAllContacts,
  addFavoriteMessage,
  deleteFavoriteMessage,
  removeAssignedConversationToUser,
  getAssignConversation,
  assignConversationToUser,
} from '../../actions/message.action'
import { getAllUsers } from '../../actions/dashboard.action'
import { getmainvmboxes } from '../../actions/voicemails.action'
import { getContactList, getDistributionMessage, sendDistributionMessage } from '../../actions/distribution.action'
import {
  imageFileMimeTypes,
  applicationFileMimeTypes,
  audioFileMimeTypes,
  textFileMimeTypes,
  videoFileMimeTypes,
} from '../../constants/const'
import * as CONSTS from '../../constants/const'

import './Home.css'
import CONFIG from '../../constants/config'
import silhoutte from '../../asset/media/img/silhoutte.png'
import robot from '../../asset/media/img/robot-solid.svg'
import alertSound from '../../asset/media/mp3/drop.mp3'
import Message from './Message'
import AssignConversation from './AssignConversation'

const socket = openSocket(CONFIG.socketURL)

const Home = (props) => {
  const dispatch = useDispatch()
  const {
    loading,
    numbers,
    userName,
    messages,
    members,
    contacts,
    allCalls,
    clioSyncState,
    clioAuthToken,
    assignConversations,
    assignConversationsLogs,
    assignedMember,
    assignedConversations,
    assignedMessages,
    mem_number,
  } = useSelector((state) => state.message)
  const { voicemails } = useSelector((state) => state.voicemails)

  const { styleMode, totalMsgCount, soundAlert, callFlowID, numberList } = useSelector((state) => state.message.numbers)
  const { users } = useSelector((state) => state.dashboard)

  const myRef = useRef(null)
  const [searchVal, setSearchValue] = useState('')
  const [values, updateValues] = useState({
    phoneNum: '',
    msgText: '',
    distribution: false,
    distributionStatus: false,
    distributionSubscribe: false,
  })

  const [callDetails, updateCallDetails] = useState([])
  const [toogleSidebar, updateToggleSidebar] = useState(false)
  const [printerToogle, updatePrinter] = useState(false)
  const [setNumberToogle, updateSetNumber] = useState(false)
  const [userNumPanelToggle, updateUserNumPanel] = useState(false)
  const [contactToogle, updateContactUs] = useState(false)
  const [conversationToogle, updateConversation] = useState(false)
  const [tooltipOpen1, setTooltipOpen1] = useState(false)
  const [tooltipOpen2, setTooltipOpen2] = useState(false)
  const [startDate, updateStartDate] = useState(new Date(new Date().setDate(new Date().getDate() - 7)))
  const [endDate, updateEndDate] = useState(new Date())
  const [adminPhoneNum, updateAdminPhoneNum] = useState('')
  const [uploadImgName, updateuploadImgName] = useState('')
  const [adminUseremail, updateAdminUseremail] = useState('')
  const [msgNofications, updateMsgNotifications] = useState([])
  const [allContactNumber, setAllContactNumber] = useState([])
  const [state, setState] = useState({})
  const messagesEndRef = useRef(null)
  const uploadInput = useRef(null)
  const uploadAvatarRef = useRef(null)
  const [audio] = useState(new Audio(alertSound))
  const [soundNotify, setSoundAlert] = useState(false)
  const [favTab, updateFavTab] = useState('favTab1')
  const [newMessages, setnewMessages] = useState([])
  const [showContactInformationPane, setContactInformationPane] = useState(false)
  const [showContactDialog, setshowContactDialog] = useState(false)
  const [memberInformation, setMemberIformation] = useState([])
  const [filteredNormlMembers, setFilteredNormMembers] = useState([])
  const [filteredFavMembers, setFilteredFavMembers] = useState([])
  const [unreadMembers, setUnreadMembers] = useState([])
  const [isMemberDataFetched, setMemberDataFetched] = useState(false)
  const [searchMessage, updateSearchMessageDetails] = useState([])
  const [assignedConversation, setAssignedConversation] = useState([])
  const [searchAssignedMessage, updateSearchAssignedMessageDetails] = useState([])
  const [newAssignedMessges, setNewAssignedMessges] = useState([])
  const [messagesList, setMessagesList] = useState([])
  const [normalTotalCount, setNormalTotalCount] = useState(0)
  const owner_id = localStorage.getItem('user_id')
  const [allUserNames, setAllUserNames] = useState([])
  const [isModal, setIsModal] = useState(false)
  const [assignConversationModal, setAssignConversationModal] = useState(false)
  const [assignMemberNum, setAssignMemberNum] = useState(0)
  const [phoneState, setPhoneState] = useState(false)
  const [unreadTotalCount, setUnreadTotalCount] = useState(0)
  const [favTotalCount, setFavTotalCount] = useState(0)
  const [assignTotalCount, setAssignTotalCount] = useState(0)
  const [showInfoPane, setShowInfoPane] = useState(false)

  const toggleModal = () => {
    setIsModal(!isModal)
  }

  const toggleTooltip1 = () => setTooltipOpen1(!tooltipOpen1)
  const toggleTooltip2 = () => setTooltipOpen2(!tooltipOpen2)
  const toggleTooltip4 = (targetName) => {
    if (!state[targetName]) {
      setState({ ...state, [targetName]: true })
    } else {
      setState({ ...state, [targetName]: !state[targetName] })
    }
  }

  const isToolTipOpen = (targetName) => {
    return state[targetName] ? state[targetName] : false
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
        })
      })
    setAllUserNames(dataArray)
    // eslint-disable-next-line
  }, [users])

  const searchResultMessage = searchMessage.filter((msg) => msg.text.toUpperCase().includes(searchVal.toUpperCase()))
  const handleValues = (e) => {
    if (e.target.name === 'phoneNum') {
      updateValues({
        ...values,
        [e.target.name]: e.target.value,
      })
    } else if (e.target.name === 'msgText') {
      if (e.key === 'Enter') {
        sendingMessage()
      } else {
        updateValues({ ...values, [e.target.name]: e.target.value })
      }
    } else if (e.target.name === 'searchContact') {
      updateValues({ ...values, [e.target.name]: e.target.value })
      if (favTab === 'favTab1') {
        setFilteredNormMembers(members.normalMem.filter((num) => num.labelName.indexOf(e.target.value) !== -1))
      } else if (favTab === 'favTab2') {
        setFilteredFavMembers(members.favoriteMem.filter((num) => num.labelName.indexOf(e.target.value) !== -1))
      }
    }
  }

  const handlesearch = (val) => {
    if (val.val) {
      updateValues({ ...values, searchContact: val.val })
      if (favTab === 'favTab1') {
        setSearchValue(val.val)
        let messageTitle = document.querySelectorAll('.message-content')
        if (messageTitle.length > 0) {
          const number = members.normalMem.filter((mem) => mem.memberNum === values.phoneNum)
          setFilteredNormMembers(number)
          messageTitle.forEach((item) => {
            if (val.val === item.innerHTML) {
              item.className = `message-content hvr-pop`
              var elmnt = document.getElementsByClassName('hvr-pop')
              elmnt[0].scrollIntoView()
            } else {
              item.className = 'message-content'
            }
          })
        } else {
          dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail, val.val))
        }
      } else if (favTab === 'favTab2') {
        setSearchValue(val.val)
        setFilteredFavMembers(
          members.favoriteMem.filter(
            (num) => num.labelName.indexOf(val.val) !== -1 || num.memberNum.indexOf(val.val) !== -1,
          ),
        )
      } else if (favTab === 'favTab4') {
        setSearchValue(val.val)
        dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail, val.val))
      }
    } else {
      dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail, val.val))
      setSearchValue(val.val)
      let messageTitle = document.querySelectorAll('.message-content')
      if (messageTitle) {
        messageTitle.forEach((item) => {
          item.className = 'message-content'
          // updateFilterClassName(item.className)
        })
      }
    }
  }

  const renderMessageTitle = (state, val) => {
    return state.text.toLowerCase().indexOf(val.toLowerCase()) !== -1
  }

  const changeSetNumberModal = () => {
    if (!setNumberToogle) {
      dispatch(getCallForward())
    }
    updateSetNumber(!setNumberToogle)
  }
  const contactUsModal = () => {
    updateContactUs(!contactToogle)
  }
  const userPhoneNumModal = () => {
    updateUserNumPanel(!userNumPanelToggle)
  }
  const changeSidebar = () => {
    updateToggleSidebar(!toogleSidebar)
  }
  const sendingMessage = () => {
    if (favTab !== 'favTab3') {
      if (!adminPhoneNum) {
        changeSetNumberModal()
      } else if (values.phoneNum) {
        if (values.distribution) {
          if (!values.distributionStatus) {
            return toast.warn(`You can't send messages to this distribution list.`, {
              position: toast.POSITION.TOP_RIGHT,
            })
          }
          if (!values.distributionSubscribe) {
            return toast.warn(`This distribution list is disabled.`, {
              position: toast.POSITION.TOP_RIGHT,
            })
          }
          dispatch(sendDistributionMessage(values.msgText, uploadImgName, adminPhoneNum, values.phoneNum))
        } else {
          dispatch(sendMessage(values.phoneNum, adminPhoneNum, values.msgText, adminUseremail, uploadImgName, favTab))
        }
      }
    } else if (Object.keys(assignedMember).length > 0) {
      if (values.phoneNum) {
        dispatch(
          sendMessage(
            values.phoneNum,
            assignedMember.assigner_number,
            values.msgText,
            adminUseremail,
            uploadImgName,
            favTab,
          ),
        )
      }
    }
    uploadInput.current = null
    updateValues({ ...values, msgText: '' })
    updateuploadImgName('')
  }
  const imageUpload = async (ev) => {
    ev.preventDefault()
    const data = new FormData()
    data.append('file', uploadInput.current.files[0])
    await axios
      .post(`${CONFIG.serverURL}/fileupload`, data, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((response) => {
        updateuploadImgName(response.data.file)
      })
  }

  const uploadAvatar = (ev) => {
    ev.preventDefault()
    dispatch({ type: CONSTS.SET_LOADING_USER_DATA, payload: true })
    const data = new FormData()
    data.append('file', uploadAvatarRef.current.files[0])
    data.append('userId', owner_id)
    axios
      .post(`${CONFIG.serverURL}/uploadavatar`, data, {
        headers: { 'X-Requested-With': 'XMLHttpRequest' },
      })
      .then((response) => {
        dispatch(getUserData())
      })
  }
  const setMemNumber = async (
    number,
    distribution = false,
    distributionStatus = false,
    distributionSubscribe = false,
  ) => {
    await updateValues({
      ...values,
      msgText: '',
      phoneNum: number,
      distribution: distribution,
      distributionStatus: distributionStatus,
      distributionSubscribe: distributionSubscribe,
    })
    await dispatch(setMemberNum(number))
    await updateCallDetailsData(number)
    if (distribution) {
      await dispatch(getDistributionMessage(adminPhoneNum, number))
    } else {
      await dispatch(getMessage(number, adminPhoneNum, owner_id))
    }
  }

  const updateCallDetailsData = async (number) => {
    const callDetails = []
    allCalls &&
      (await allCalls.forEach((call) => {
        if (call.caller_id_number === number || call.dialed_number === number) {
          call.unix_time = Number(call.unix_timestamp)
          callDetails.push(call)
        }
      }))
    callDetails.sort(async (a, b) => (await a.unix_time) - b.unix_time)

    await updateCallDetails(callDetails)
  }
  const updateNewMessageDetails = async (messages, callDetails) => {
    let temp = [...messages]
    let tempSearch = []
    temp.push(...callDetails)
    let filterAssignConversations = assignConversationsLogs.filter(
      (item) => values.phoneNum && item.assigned_number === values.phoneNum,
    )
    temp.push(...filterAssignConversations)
    temp.map((item) => {
      if (item?.unix_timestamp) {
        item.unix_time = Number(item.unix_timestamp)
      } else {
        item.unix_time = Number((new Date(item.createdAt).getTime() / 1000).toFixed())
      }
      if (
        (item.text !== '' &&
          item.media === '' &&
          values.phoneNum === item.to_number &&
          adminPhoneNum === item.from_number &&
          item.direction === 'out') ||
        (values.phoneNum === item.from_number && adminPhoneNum === item.to_number && item.direction === 'in')
      ) {
        tempSearch.push(item)
      }
      return item
    })
    temp.sort((a, b) => a.unix_time - b.unix_time)
    await setnewMessages(temp)
    updateSearchMessageDetails(tempSearch)
  }
  const updateNewAssignMessageDetails = async (messages, callDetails) => {
    let temp = [...messages]
    let tempSearch = []
    temp.push(...callDetails)
    let filterAssignConversations = assignConversationsLogs.filter(
      (item) => values.phoneNum && item.assigned_number === values.phoneNum,
    )
    temp.push(...filterAssignConversations)
    temp.map((item) => {
      if (item?.unix_timestamp) {
        item.unix_time = Number(item.unix_timestamp)
      } else {
        item.unix_time = Number((new Date(item.createdAt).getTime() / 1000).toFixed())
      }
      if (item.text !== '' && item.media === '') {
        tempSearch.push(item)
      }
      return item
    })
    temp.sort((a, b) => a.unix_time - b.unix_time)
    await setNewAssignedMessges(temp)
    updateSearchAssignedMessageDetails(tempSearch)
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

  const convertScheduleDateTime = (time) => {
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
    const strTime = month + ' ' + day + ', ' + year + ' at ' + hours + ':' + minutes + ' ' + ampm
    return strTime
  }

  const inComingMssage = async (data) => {
    await dispatch(newMessage(data))
  }

  const sendScheduleMessage = async (data) => {
    if (data.tab !== 'favTab3') {
      dispatch(getMessage(data.to_number, data.from_number, owner_id))
    } else {
      dispatch(getAssignedMessage(assignedMember))
    }
  }

  const conversationModal = () => {
    if (!conversationToogle) {
      updateValues({ ...values, phoneNum: '' })
      dispatch(setMemberNum(''))
    }
    updateConversation(!conversationToogle)
  }

  const startConverstaion = async (uplaodConversation) => {
    const numberSort = values.phoneNum.replace(/[\s&\\#+()$~%.'":*?<>{}-]/g, '')
    updateValues({ ...values, phoneNum: numberSort })
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
      if (values.msgText === '') {
        toast.warn('Please input message.', {
          position: toast.POSITION.TOP_RIGHT,
        })
      } else {
        dispatch(
          startConversation(
            phoneArray,
            adminPhoneNum,
            values.msgText,
            userName.userEmail,
            userName.fullName,
            uplaodConversation,
          ),
        )
        updateValues({ ...values, msgText: '' })
        conversationModal()
      }
    } else {
      toast.warn('You can input up to 10 Phone Numbers', {
        position: toast.POSITION.TOP_RIGHT,
      })
      return
    }
  }
  const isNumeric = (value) => {
    return /^\d+$/.test(value)
  }
  const phoneNumFormat = (number) => {
    if (number) {
      const phone_number = parsePhoneNumberFromString(number)
      if (!phone_number) {
        return number
      } else {
        const phoneNumber = phone_number.formatNational()
        return phoneNumber
      }
    } else return number
  }
  const printerModal = () => {
    updatePrinter(!printerToogle)
    dispatch(
      getPrintMessage(
        values.phoneNum,
        numbers.savedNumber,
        setFormatDate(startDate, 'start'),
        setFormatDate(endDate, 'end'),
      ),
    )
  }
  const exportPDF = async () => {
    html2canvas(document.getElementsByClassName('messages')[0], {
      scale: 4,
    }).then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg')
      const imgWidth = 204
      const pageHeight = 280
      const imgHeight = (canvas.height * imgWidth) / canvas.width + 1
      let heightLeft = imgHeight
      const doc = new jsPDF('p', 'mm', 'a4')
      let position = 30
      let headerContent = {}
      headerContent.textContentLine1 = 'SMS Conversation with ' + values.phoneNum + ' from ' + numbers.savedNumber
      headerContent.textContentLine2 = formatDate(startDate, true, true) + ' - ' + formatDate(endDate, true, true)
      doc.setFontSize(14)
      doc.text(headerContent.textContentLine1, 10, 15)
      doc.text(headerContent.textContentLine2, 10, 25)
      doc.addImage(imgData, 'JPEG', 3, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight
        doc.addPage()
        doc.addImage(imgData, 'JPEG', 3, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
      doc.save(`message-${formatDate(startDate)}_${formatDate(endDate)}.pdf`)
    })
    updatePrinter(!printerToogle)
    dispatch(getMessage(values.phoneNum, adminPhoneNum, owner_id))
  }
  const startDateChange = (date) => {
    updateStartDate(date)
    dispatch(
      getPrintMessage(
        values.phoneNum,
        numbers.savedNumber,
        setFormatDate(date, 'start'),
        setFormatDate(endDate, 'end'),
      ),
    )
  }

  const endDateChange = (date) => {
    updateEndDate(date)
    dispatch(
      getPrintMessage(
        values.phoneNum,
        numbers.savedNumber,
        setFormatDate(startDate, 'start'),
        setFormatDate(date, 'end'),
      ),
    )
  }
  const setFormatDate = (date, type) => {
    let formatted_date = null
    if (type === 'start') {
      formatted_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
    }
    if (type === 'end') {
      formatted_date = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
    }
    return formatted_date
  }
  const formatDate = (date, fullMonth, reportDate) => {
    const year = date.getFullYear()
    let month = date.getMonth() + 1
    const day = date.getDate()
    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    if (fullMonth) {
      month = monthNames[date.getMonth()]
    }
    let formattedDate = year + '-' + month + '-' + day
    if (reportDate) {
      formattedDate = month + ' ' + day + ', ' + year
    }
    return formattedDate
  }
  const deleteHistory = () => {
    dispatch(deleteConversation(values.phoneNum, adminPhoneNum, userName.userEmail))
  }

  const isContactInformation = (val, user) => {
    setContactInformationPane(val)
    if (val && user) {
      if (val === true) {
        dispatch(getAllCalls())
      }
      setMemberIformation(user)
    }
  }

  const isContactDialog = (val, user) => {
    setshowContactDialog(val)
    if (val && user) {
      if (val === true) {
        dispatch(getAllCalls())
      }
      setMemberIformation(user)
    }
  }
  const toggleContactDialog = (val) => {
    setshowContactDialog(val)
  }

  const favTabToggole = (tab) => {
    if (favTab !== tab) updateFavTab(tab)
    if (tab !== 'favTab3') {
      updateAdminPhoneNum(numbers.savedNumber)
      updateAdminUseremail(userName.userEmail)
    }
  }

  const getMedia = (url) => {
    const mimeType = mime.lookup(url)
    if (imageFileMimeTypes.includes(mimeType)) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} className="img-view" alt="download" />
        </a>
      )
    } else if (audioFileMimeTypes.includes(mimeType)) {
      return (
        <audio controls>
          <source src={url}></source>
        </audio>
      )
    } else if (videoFileMimeTypes.includes(mimeType)) {
      return (
        <video className="img-view" width="200" height="150" controls>
          <source src={url} type={mimeType}></source>
        </video>
      )
    } else if (textFileMimeTypes.includes(mimeType)) {
      return <link href={url} className="img-view" rel="stylesheet" type={mimeType} />
    } else if (applicationFileMimeTypes.includes(mimeType)) {
      return <embed src={url} width="200px" height="200px" />
    }
    return
  }
  const [addCall, setAddCall] = useState(false)
  const call = () => {
    setAddCall(true)
  }
  const checkAssignConversation = (number) => {
    const state = assignConversations.findIndex((item) => item.assigned_number === number)
    if (state !== -1) {
      return true
    } else {
      return false
    }
  }
  const checkAssignConversationLength = (number) => {
    const state = assignConversations.filter((item) => item.assigned_number === number)
    return state.length
  }

  const changeAssignedConversation = async (conversation) => {
    updateValues({
      ...values,
      phoneNum: conversation.assigned_number,
    })
    await dispatch(setAssignedMember(conversation))
    await updateAdminPhoneNum(conversation.assigner_number)
    await dispatch(getAssignedMessage(conversation))
    await updateCallDetailsData(conversation.assigner_number)
    await dispatch(getAllAssignConversations(conversation.assigned_number, conversation.assigner_number, owner_id))
  }
  const handlePageClick = async (data) => {
    const { selected } = data
    await dispatch({ type: CONSTS.SET_CONVERSATION_PAGINATION_NUM, payload: selected })
    await dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail, searchVal))
  }
  const handlePageAssignClick = async (assigndata) => {
    await dispatch({ type: CONSTS.SET_ASSIGNCONVERSATION_PAGINATION_NUM, payload: assigndata.selected })
    await dispatch(getAssignedConversations())
  }
  const handlePagefavClick = async (favdata) => {
    await dispatch({ type: CONSTS.SET_FAVCONVERSATION_PAGINATION_NUM, payload: favdata.selected })
    await dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail))
  }
  const handlePageUnreadClick = async (unreaddata) => {
    const { selected } = unreaddata
    await dispatch({ type: CONSTS.SET_UNREADCONVERSATION_PAGINATION_NUM, payload: selected })
    await dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail))
  }

  useEffect(() => {
    if (messages.length > 0) {
      updateNewMessageDetails(messages, callDetails)
    }
    // eslint-disable-next-line
  }, [messages, callDetails, assignConversationsLogs])

  useEffect(() => {
    if (assignedMessages.length > 0) {
      updateNewAssignMessageDetails(assignedMessages, callDetails)
    }
    // eslint-disable-next-line
  }, [assignedMessages, callDetails, assignConversationsLogs])

  useEffect(() => {
    setFilteredNormMembers(members.normalMem)
  }, [members.normalMem])

  useEffect(() => {
    if (numberList && numberList.length > 0) {
      const data = {
        show: true,
        user_id: owner_id,
      }
      localStorage.setItem('showNumber', JSON.stringify(data))
    } else {
      localStorage.removeItem('showNumber')
    }
  }, [numberList, owner_id])

  useEffect(() => {
    setUnreadMembers(members.unreadMem)
    // eslint-disable-next-line
  }, [members.unreadMem])

  useEffect(() => {
    const pages = Number(parseInt(members.normalTotalCount / 9)) + Number(members.normalTotalCount % 9 > 0 ? 1 : 0)
    const Unreadpages =
      members.unreadCount && Number(parseInt(members.unreadCount / 9)) + Number(members.unreadCount % 9 > 0 ? 1 : 0)
    const Favpages =
      members.favoriteCount &&
      Number(parseInt(members.favoriteCount / 9)) + Number(members.favoriteCount % 9 > 0 ? 1 : 0)
    const Assignpages =
      assignedConversations.assignTotalCount &&
      Number(parseInt(assignedConversations.assignTotalCount / 9)) +
        Number(assignedConversations.assignTotalCount % 9 > 0 ? 1 : 0)
    setNormalTotalCount(pages)
    setUnreadTotalCount(Unreadpages)
    setFavTotalCount(Favpages)
    setAssignTotalCount(Assignpages)
    // eslint-disable-next-line
  }, [members.normalTotalCount, members])

  useEffect(() => {
    setAssignedConversation(assignedConversations.assignedConversationList)
  }, [assignedConversations])

  useEffect(() => {
    setFilteredFavMembers(members.favoriteMem)
  }, [members.favoriteMem])

  useEffect(() => {
    if (numbers.savedNumber) {
      updateUserNumPanel(false)
      if (favTab === 'favTab3' && Object.keys(assignedMember).length > 0) {
        updateAdminPhoneNum(assignedMember.assigner_number)
      } else {
        updateAdminPhoneNum(numbers.savedNumber)
        updateAdminUseremail(userName.userEmail)
      }
      dispatch(getMessage(values.phoneNum, numbers.savedNumber, owner_id))
      if (isMemberDataFetched === false && userName.userEmail) {
        setMemberDataFetched(true)
      }
      dispatch(getAllNumbers(numbers.savedNumber, userName.userEmail))
    }
    dispatch(getAllAssignConversations(values.phoneNum, numbers.savedNumber, owner_id))
    // eslint-disable-next-line
  }, [numbers.savedNumber, userName])

  useEffect(() => {
    if (members && !members.notifies) {
      updateMsgNotifications([])
    } else {
      const dif = _.differenceWith(members.notifies, msgNofications, _.isEqual)
      if (dif.length > 0) {
        updateMsgNotifications(members.notifies)
      }
    }
    // eslint-disable-next-line
  }, [members.notifies])

  useEffect(() => {
    msgNofications &&
      msgNofications.forEach((notify) => {
        toast.success(`You have unread ${notify.newMsg} text messages from ${phoneNumFormat(notify.number)}!`, {
          position: toast.POSITION.TOP_RIGHT,
        })
        if (soundNotify) audio.play()
      })
    // eslint-disable-next-line
  }, [msgNofications])

  useEffect(() => {
    if (callFlowID) {
      dispatch(getFollowDevices(callFlowID))
    }
    // eslint-disable-next-line
  }, [callFlowID])

  useEffect(() => {
    if (values.phoneNum === '') {
      dispatch({ type: CONSTS.GET_ALL_MESSAGES, payload: [] })
    }
    if (values.distribution) {
      dispatch(getContactList(values.phoneNum))
    }
    // eslint-disable-next-line
  }, [values])

  useEffect(() => {
    setSoundAlert(soundAlert)
  }, [soundAlert])

  useEffect(() => {
    if (messagesList.length > 0) messagesEndRef.current.scrollIntoView()
  }, [messagesList])

  useEffect(() => {
    if (favTab !== 'favTab3') {
      setMessagesList(newMessages)
      updateValues({ ...values, phoneNum: mem_number })
      updateAdminPhoneNum(numbers.savedNumber)
    } else {
      setMessagesList(newAssignedMessges)
      updateValues({ ...values, phoneNum: assignedMember.assigned_number })
      updateAdminPhoneNum(assignedMember.assigner_number)
    }
    // eslint-disable-next-line
  }, [favTab, newMessages, newAssignedMessges])

  useEffect(() => {
    if (clioSyncState && clioAuthToken === undefined) {
      confirmAlert({
        customUI: ({ onClose }) => {
          return (
            <div className="custom-ui">
              <h1>Alert</h1>
              <p>Would you connect to Clio?</p>
              <button onClick={onClose}>No</button>
              <button
                onClick={() => {
                  dispatch(getClioAuth())
                  onClose()
                }}
              >
                Yes
              </button>
            </div>
          )
        },
      })
    }
    // eslint-disable-next-line
  }, [clioAuthToken, clioSyncState])

  useEffect(() => {
    dispatch(getAssignedConversations())
    dispatch(getCallForward())
    dispatch(getDevices())
    dispatch(getAllUsers())
    dispatch(getmainvmboxes())
    socket.on('incomMessage', (data) => {
      if (data.state === 'success') {
        inComingMssage(data)
      }
    })
    socket.on('scheduleMessage', (data) => {
      sendScheduleMessage(data)
    })
    // eslint-disable-next-line
  }, [])

  useEffect(() => {
    if (contacts.length > 0) {
      setAllContactNumber(contacts)
    }
    //eslint-disable-next-line
  }, [contacts])

  useEffect(() => {
    dispatch(getAllContacts(owner_id))
    //eslint-disable-next-line
  }, [owner_id])

  const phoneNumberFormat = (number) => {
    var cleaned = ('' + number).replace(/\D/g, '')
    var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
    if (match) {
      return '(' + match[2] + ') ' + match[3] + '-' + match[4]
    }
    return null
  }

  const getAssignName = (member) => {
    const number = allContactNumber.filter(
      (d) =>
        (d.phoneNumber === member.item.assigned_number ||
          (d.phoneNumbers.length > 0 &&
            d.phoneNumbers
              .map((item) => phoneNumberFormat(item.contact_number))
              .includes(phoneNumberFormat(member.item.assigned_number))) ||
          phoneNumberFormat(d.phoneNumber) === phoneNumberFormat(member.item.assigned_number)) &&
        member.contactID !== '' &&
        member.contactID !== d._id,
    )
    return number
  }

  const getName = (member) => {
    const number = allContactNumber.filter(
      (d) =>
        (d.phoneNumber === member.memberNum ||
          (d.phoneNumbers.length > 0 &&
            d.phoneNumbers
              .map((item) => phoneNumberFormat(item.contact_number))
              .includes(phoneNumberFormat(member.memberNum))) ||
          phoneNumberFormat(d.phoneNumber) === phoneNumberFormat(member.memberNum)) &&
        member.contactID !== '' &&
        member.contactID !== d._id,
    )
    return number
  }

  const getLabelName = (member) => {
    const number = allContactNumber.filter(
      (d) =>
        (d.phoneNumber === member.memberNum ||
          (d.phoneNumbers.length > 0 &&
            d.phoneNumbers
              .map((item) => phoneNumberFormat(item.contact_number))
              .includes(phoneNumberFormat(member.memberNum))) ||
          phoneNumberFormat(d.phoneNumber) === phoneNumberFormat(member.memberNum)) &&
        member.labelName !== d.labelName,
    )
    const name = number.find((data) => data.labelName !== '')
    return name
  }

  const getAssignLabelName = (conversation) => {
    const number = allContactNumber.filter(
      (d) =>
        (d.phoneNumber === conversation.item.assigned_number ||
          (d.phoneNumbers.length > 0 &&
            d.phoneNumbers
              .map((item) => phoneNumberFormat(item.contact_number))
              .includes(phoneNumberFormat(conversation.item.assigned_number))) ||
          phoneNumberFormat(d.phoneNumber) === phoneNumberFormat(conversation.item.assigned_number)) &&
        conversation.labelName !== d.labelName,
    )
    const name = number.find((data) => data.labelName !== '')
    return name
  }

  const getFavorite = (member) => {
    const favoriteData = members.totalFavMem && members.totalFavMem.filter((item) => item.memberNum === member)
    return favoriteData && favoriteData.length
  }

  const deleteFavorite = (toNumber) => {
    const currentUser = allUserNames.find((user) => user.email === userName.userEmail)
    dispatch(removeAssignedConversationToUser(currentUser, toNumber))
    dispatch(deleteFavoriteMessage(adminPhoneNum, toNumber, userName.userEmail))
  }

  const addFavorite = (toNumber) => {
    dispatch(addFavoriteMessage(adminPhoneNum, toNumber, userName.userEmail))
  }

  const assignConversationShowPopup = (member) => {
    if (favTab !== 'favTab3') {
      setAssignMemberNum(member.memberNum)
      const owner_id = localStorage.getItem('user_id')
      dispatch(getAssignConversation(member.memberNum, adminPhoneNum, owner_id))
      setAssignConversationModal(!assignConversationModal)
    } else {
      setAssignMemberNum(member.item.assigned_number)
      dispatch(
        getAssignConversation(member.item.assigned_number, member.item.assigner_number, member.item.assigner_userid),
      )
      setAssignConversationModal(!assignConversationModal)
    }
  }

  const toggleAssignConversationPopup = () => {
    setAssignConversationModal(!assignConversationModal)
  }

  const { assignConversation } = useSelector((state) => state.message)

  const saveAssignConversation = (toNumber) => {
    const owner_id = localStorage.getItem('user_id')
    const userData = {
      assigned_number: toNumber,
      assigner_number: adminPhoneNum,
      assigner_email: userName.userEmail,
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
          toNumber: memberInformation.memberNum,
        })
      })

    setAllUserNames(dataArray)

    // eslint-disable-next-line
  }, [users, memberInformation])

  const changeConversationAssignState = (e) => {
    const userData = [...allUserNames]
    const index = allUserNames.findIndex((user) => user.email === e.target.id)
    userData[index].state = e.target.checked
    setAllUserNames(userData)
  }

  const truncateString = (str, num) => {
    if (str.length > num) {
      return str.slice(0, num) + '...'
    } else {
      return str
    }
  }

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

  const checkNotifies = (number) => {
    const notify = members.notifies && members.notifies.findIndex((count) => count.number === number)
    if (notify === -1) {
      return true
    } else {
      return false
    }
  }

  return (
    <div className={styleMode}>
      {loading && (
        <div className="loader-container">
          <div className="loader" />
        </div>
      )}
      <ToastContainer autoClose={8000} />
      <Notifications />
      <Dialog
        setNumberToogle={setNumberToogle}
        userNumPanelToggle={userNumPanelToggle}
        changeSetNumberModal={changeSetNumberModal}
        userPhoneNumModal={userPhoneNumModal}
        contactUsModal={contactUsModal}
        contactToogle={contactToogle}
        values={values}
        addCall={addCall}
        setAddCall={setAddCall}
        phoneState={phoneState}
        setPhoneState={setPhoneState}
      />
      <StartConverstaion
        conversationToogle={conversationToogle}
        conversationModal={conversationModal}
        handleValues={handleValues}
        uploadInput={uploadInput}
        values={values}
        adminUseremail={adminUseremail}
        updateValues={updateValues}
        startConverstaion={startConverstaion}
        fromNumber={adminPhoneNum}
        imageUpload={imageUpload}
        uploadImgName={uploadImgName}
        userName={userName.fullName}
      />
      <div className="layout">
        <header className="header-home">
          <div className="header-action">
            <ul className="list-inline">
              <li className="list-inline-item">
                <div className="header-chat-action">
                  <div className="chat-icons">
                    <div className="btn btn-head mr-2" onClick={printerModal}>
                      <i className="fas fa-print"></i>
                    </div>
                    <div className={phoneState ? 'btn callPhone-icon  mr-2' : ' btn btn-head mr-2'} onClick={call}>
                      <i className="fa fa-phone-alt "></i>
                    </div>
                    <div
                      className="btn btn-head"
                      onClick={() => {
                        isContactInformation(true, memberInformation)
                        setShowInfoPane(true)
                        setMemNumber(memberInformation.memberNum)
                      }}
                    >
                      <i className="fas fa-info"></i>
                    </div>
                  </div>
                  <div className="user-info">
                    <figure className="avatar avatar-lg">
                      <div className="chat-user-image">
                        <label id="#bb">
                          <i className="fas fa-upload"></i>
                          <input type="file" ref={uploadAvatarRef} onChange={uploadAvatar} accept="image/*" />
                        </label>
                      </div>
                      {numbers.avatar ? (
                        <img src={`${CONFIG.serverURL}/users/${numbers.avatar}`} alt="avatar" />
                      ) : (
                        <img src={silhoutte} alt="avatar" />
                      )}
                    </figure>
                    <div>
                      <h5>{userName.fullName}</h5>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </header>
        <div className="chat-upper">
          <Sidebar
            changeSidebar={changeSidebar}
            toogleSidebar={toogleSidebar}
            contactUsModal={contactUsModal}
            changeSetNumberModal={changeSetNumberModal}
            userPhoneNumModal={userPhoneNumModal}
            history={props.history}
          />
          <div className="content">
            <div className={`sidebar-group ${toogleSidebar ? 'open' : ''}`}>
              <div id="chats" className="sidebar active">
                <button type="button" className="close d-none" aria-label="Close" onClick={changeSidebar}>
                  <span aria-hidden="true">×</span>
                </button>
                <div className="row mb-3 px-3">
                  <div className="col-12 autocomplete-wrapper" title="Search Chat">
                    <Autocomplete
                      value={searchVal}
                      inputProps={{ placeholder: 'Enter for search...' }}
                      items={favTab === 'favTab3' ? searchAssignedMessage : searchMessage}
                      getItemValue={(item) => item.text}
                      shouldItemRender={renderMessageTitle}
                      renderMenu={(items, value) => (
                        <div className="dropdown">
                          {value === '' ? (
                            <div className="itemMenu"></div>
                          ) : items.length === 0 ? (
                            <div className="itemMenu"></div>
                          ) : (
                            items
                          )}
                        </div>
                      )}
                      renderItem={(item, isHighlighted) => (
                        <div className={`item ${isHighlighted ? 'selected-item' : ''}`}>{item.text}</div>
                      )}
                      onChange={(event, val) => handlesearch({ val })}
                      onSelect={(val) => handlesearch({ val })}
                    />
                    <div className="home-search">
                      <i className="fas fa-search"></i>
                    </div>
                  </div>
                  <div className="sms-group">
                    <div className="btn btn-light new-sms" id="newConversatoion" onClick={conversationModal}>
                      <i className="fas fa-comment sms-icon"></i>
                    </div>
                    <Tooltip
                      placement="top"
                      isOpen={tooltipOpen1}
                      autohide={false}
                      target="newConversatoion"
                      toggle={toggleTooltip1}
                    >
                      New Conversation
                    </Tooltip>
                  </div>
                </div>
                <Nav variant="pills" tabs className="flex-row chat-side-header">
                  <NavItem>
                    <NavLink
                      className={classnames(
                        {
                          active: favTab === 'favTab1',
                        },
                        'conversationTab',
                      )}
                      onClick={() => {
                        favTabToggole('favTab1')
                      }}
                    >
                      Conversation
                    </NavLink>
                  </NavItem>
                  {members.notifies && members.notifies.length > 0 && (
                    <NavItem>
                      <NavLink
                        className={classnames(
                          {
                            active: favTab === 'favTab4',
                          },
                          'unreadTab',
                        )}
                        onClick={() => {
                          favTabToggole('favTab4')
                        }}
                      >
                        <div className="unread-message-count unread-msg-count ml-1">{members.notifies.length}</div>
                      </NavLink>
                    </NavItem>
                  )}
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: favTab === 'favTab2',
                      })}
                      onClick={() => {
                        favTabToggole('favTab2')
                      }}
                    >
                      Important
                      {members.favoriteMem && members.favoriteMem.length > 0 && (
                        <div
                          className={`${
                            members.notifies && members.notifies.length > 0
                              ? 'unread-message-count important-msg-count ml-1'
                              : 'unread-message-count important-count ml-1'
                          }`}
                        >
                          {members.totalFavMem.length}
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink
                      className={classnames({
                        active: favTab === 'favTab3',
                      })}
                      onClick={() => {
                        favTabToggole('favTab3')
                      }}
                    >
                      Assigned
                      {assignedConversation && assignedConversation.length > 0 && (
                        <div className="unread-message-count assigned-msg-count ml-1">
                          {assignedConversations.assignTotalCount}
                        </div>
                      )}
                    </NavLink>
                  </NavItem>
                </Nav>
                <div className="sidebar-body">
                  <PerfectScrollbar>
                    <TabContent activeTab={favTab}>
                      <TabPane tabId="favTab1">
                        <div>
                          <ul className="list-group list-group-flush">
                            {filteredNormlMembers &&
                              filteredNormlMembers &&
                              filteredNormlMembers.map((member, i) => (
                                <Card key={i} className="chat-name">
                                  <CardBody>
                                    <li
                                      key={i}
                                      onClick={() => {
                                        showInfoPane
                                          ? isContactInformation(true, member)
                                          : isContactInformation(false, member)
                                        setMemberIformation(member)
                                        setMemNumber(
                                          member.memberNum,
                                          member.distribution,
                                          member.status,
                                          member.subscribe,
                                        )
                                      }}
                                      className={`list-group-item ${
                                        member.memberNum === values.phoneNum ? 'open-chat' : ''
                                      } ${
                                        checkAssignConversation(member.memberNum) && !checkNotifies(member.memberNum)
                                          ? 'list-chat'
                                          : !checkNotifies(member.memberNum) ||
                                            checkAssignConversation(member.memberNum)
                                          ? 'list-count-chat'
                                          : ''
                                      }`}
                                    >
                                      <figure className="avatar">
                                        {member.distribution ? (
                                          <i className="fas fa-user-friends conversation-font-size" />
                                        ) : (
                                          <img src={silhoutte} className="avatar" alt="avatar" />
                                        )}
                                      </figure>
                                      <div className="users-list-body">
                                        <span
                                          onClick={() =>
                                            setMemNumber(
                                              member.memberNum,
                                              member.distribution,
                                              member.status,
                                              member.subscribe,
                                            )
                                          }
                                        >
                                          {member.labelName === '' && getName(member).length === 0 ? (
                                            member.company === undefined || member.company === '' ? (
                                              <h5 className="chat-phoneNumber">{phoneNumFormat(member.memberNum)}</h5>
                                            ) : (
                                              <>
                                                <h5>{member.company}</h5>
                                                <h6>{phoneNumFormat(member.memberNum)}</h6>
                                              </>
                                            )
                                          ) : (
                                            <span>
                                              <div className="chat-labelName">
                                                <h5>
                                                  {!member.distribution
                                                    ? member.labelName === ''
                                                      ? getLabelName(member) &&
                                                        getLabelName(member).labelName !== undefined
                                                        ? truncateString(getLabelName(member).labelName, 17)
                                                        : ''
                                                      : truncateString(member.labelName, 17)
                                                    : member.labelName === ''
                                                    ? getLabelName(member) &&
                                                      getLabelName(member).labelName !== undefined
                                                      ? truncateString(getLabelName(member).labelName, 25)
                                                      : ''
                                                    : truncateString(member.labelName, 25)}
                                                </h5>
                                              </div>

                                              {member.labelName === '' ? (
                                                <>
                                                  <h5 id={`numbercount-${i}`}>
                                                    {getName(member).length > 0 &&
                                                      `or  ${getName(member).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`numbercount-${i}`)}
                                                    autohide={false}
                                                    target={`numbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`numbercount-${i}`)}
                                                  >
                                                    {getName(member).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName !==
                                                        (getLabelName(member) && getLabelName(member).labelName)
                                                          ? data.labelName === ''
                                                            ? data.company
                                                            : data.labelName
                                                          : member.company}
                                                        ,
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              ) : (
                                                <>
                                                  <h5 id={`numbercount-${i}`}>
                                                    {!member.distribution &&
                                                      getName(member).length > 0 &&
                                                      `or  ${getName(member).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`numbercount-${i}`)}
                                                    autohide={false}
                                                    target={`numbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`numbercount-${i}`)}
                                                  >
                                                    {getName(member).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName === '' ? data.company : data.labelName},
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              )}
                                              {!member.distribution && <h6>{member.company}</h6>}
                                              {!member.distribution && <h6>{phoneNumFormat(member.memberNum)}</h6>}
                                            </span>
                                          )}
                                          {!member.distribution &&
                                            (getFavorite(member.memberNum) > 0 ? (
                                              <i
                                                onClick={() => deleteFavorite(member.memberNum)}
                                                className="far fa-star chat-favorite-icon"
                                              ></i>
                                            ) : (
                                              <i
                                                onClick={() => addFavorite(member.memberNum)}
                                                className="far fa-star chat-important-icon"
                                              ></i>
                                            ))}
                                          {checkAssignConversation(member.memberNum) > 0 && (
                                            <Badge
                                              className="assign-badge"
                                              onClick={() => assignConversationShowPopup(member)}
                                              pill
                                            >
                                              Assigned to {checkAssignConversationLength(member.memberNum)}{' '}
                                              {`${
                                                checkAssignConversationLength(member.memberNum) === 1
                                                  ? 'person'
                                                  : 'people'
                                              }`}
                                            </Badge>
                                          )}

                                          {members.notifies &&
                                            members.notifies.map((notify, i) => {
                                              if (notify.number === member.memberNum) {
                                                return (
                                                  <div key={i} id="new-msg" className="users-list-action">
                                                    <div className="new-message-count">{notify.newMsg}</div>
                                                  </div>
                                                )
                                              }
                                              return null
                                            })}
                                          {searchVal.length > 0 && (
                                            <ul className="msg-list">
                                              {searchResultMessage.map((msg, i) => {
                                                return (
                                                  <li key={i} className="users-list-msg">
                                                    <span id="users-msg">{msg.text}</span>
                                                  </li>
                                                )
                                              })}
                                            </ul>
                                          )}
                                        </span>
                                      </div>
                                    </li>
                                    {(!member.distribution || member.distribution === undefined) && (
                                      <div className="users-list-action">
                                        <div className="action-toggle">
                                          <DropMenu
                                            tab="favTab1"
                                            toNumber={member.memberNum}
                                            readConversation={member.readConversation}
                                            fromNumber={adminPhoneNum}
                                            email={userName.userEmail}
                                            deleteHistory={deleteHistory}
                                            contactID={member.contactID}
                                            labelName={member.labelName}
                                            favoriteMem={members.favoriteMem}
                                            member={member}
                                            isContactDialog={isContactDialog}
                                            memberName={getLabelName(member)}
                                          />
                                        </div>
                                      </div>
                                    )}
                                  </CardBody>
                                </Card>
                              ))}
                          </ul>
                        </div>
                        <div>
                          {normalTotalCount > 1 && (
                            <ReactPaginate
                              previousLabel={'⟨'}
                              nextLabel={'⟩'}
                              // breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={normalTotalCount}
                              marginPagesDisplayed={0}
                              pageRangeDisplayed={2}
                              onPageChange={handlePageClick}
                              containerClassName={'con-pagination'}
                              activeClassName={'active'}
                            />
                          )}
                        </div>
                      </TabPane>
                      <TabPane tabId="favTab2">
                        <div>
                          <ul className="list-group list-group-flush">
                            {filteredFavMembers &&
                              filteredFavMembers &&
                              filteredFavMembers.map((member, i) => (
                                <Card key={i} className="chat-name">
                                  <CardBody>
                                    <li
                                      key={i}
                                      className={`list-group-item ${
                                        member.memberNum === values.phoneNum ? 'open-chat' : ''
                                      } ${
                                        checkAssignConversation(member.memberNum) && !checkNotifies(member.memberNum)
                                          ? 'list-chat'
                                          : !checkNotifies(member.memberNum) ||
                                            checkAssignConversation(member.memberNum)
                                          ? 'list-count-chat'
                                          : ''
                                      }`}
                                      onClick={() =>
                                        setMemNumber(
                                          member.memberNum,
                                          member.distribution,
                                          member.status,
                                          member.subscribe,
                                        )
                                      }
                                    >
                                      <figure className="avatar">
                                        <img src={silhoutte} className="avatar" alt="avatar" />
                                      </figure>
                                      <div className="users-list-body">
                                        <span
                                          className="home-imp"
                                          onClick={() =>
                                            setMemNumber(
                                              member.memberNum,
                                              member.distribution,
                                              member.status,
                                              member.subscribe,
                                            )
                                          }
                                        >
                                          {member.labelName === '' && getName(member).length === 0 ? (
                                            member.company === undefined || member.company === '' ? (
                                              <h5 className="chat-phoneNumber">{phoneNumFormat(member.memberNum)}</h5>
                                            ) : (
                                              <>
                                                <h5>{member.company}</h5>
                                                <h6>{phoneNumFormat(member.memberNum)}</h6>
                                              </>
                                            )
                                          ) : (
                                            <span>
                                              <div className="chat-labelName">
                                                <h5>
                                                  {member.labelName === ''
                                                    ? getLabelName(member) &&
                                                      getLabelName(member).labelName !== undefined
                                                      ? truncateString(getLabelName(member).labelName, 17)
                                                      : ''
                                                    : truncateString(member.labelName, 17)}
                                                </h5>
                                              </div>
                                              {member.labelName === '' ? (
                                                <>
                                                  <h5 id={`impnumbercount-${i}`}>
                                                    {getName(member).length > 0 &&
                                                      `or  ${getName(member).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`impnumbercount-${i}`)}
                                                    autohide={false}
                                                    target={`impnumbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`impnumbercount-${i}`)}
                                                  >
                                                    {getName(member).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName !==
                                                        (getLabelName(member) && getLabelName(member).labelName)
                                                          ? data.labelName === ''
                                                            ? data.company
                                                            : data.labelName
                                                          : member.company}
                                                        ,
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              ) : (
                                                <>
                                                  <h5 id={`impnumbercount-${i}`}>
                                                    {getName(member).length > 0 &&
                                                      `or  ${getName(member).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`impnumbercount-${i}`)}
                                                    autohide={false}
                                                    target={`impnumbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`impnumbercount-${i}`)}
                                                  >
                                                    {getName(member).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName === '' ? data.company : data.labelName},
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              )}
                                              <h6>{member.company}</h6>
                                              <h6>{phoneNumFormat(member.memberNum)}</h6>
                                            </span>
                                          )}
                                          <i
                                            onClick={() => deleteFavorite(member.memberNum)}
                                            className="far fa-star chat-favorite-icon"
                                          ></i>
                                          {checkAssignConversation(member.memberNum) > 0 && (
                                            <Badge
                                              className="assign-badge"
                                              onClick={() => assignConversationShowPopup(member)}
                                              pill
                                            >
                                              Assigned to {checkAssignConversationLength(member.memberNum)}{' '}
                                              {`${
                                                checkAssignConversationLength(member.memberNum) === 1
                                                  ? 'person'
                                                  : 'people'
                                              }`}
                                            </Badge>
                                          )}
                                          {members.notifies &&
                                            members.notifies.map((notify, i) => {
                                              if (notify.number === member.memberNum) {
                                                return (
                                                  <div key={i} className="users-list-action">
                                                    <div className="new-message-count">{notify.newMsg}</div>
                                                  </div>
                                                )
                                              }
                                              return null
                                            })}
                                        </span>
                                      </div>
                                    </li>
                                    <div className="users-list-action">
                                      <div className="action-toggle">
                                        <DropMenu
                                          tab="favTab2"
                                          toNumber={member.memberNum}
                                          readConversation={member.readConversation}
                                          fromNumber={adminPhoneNum}
                                          email={userName.userEmail}
                                          contactID={member.contactID}
                                          labelName={member.labelName}
                                          favoriteMem={members.favoriteMem}
                                          member={member}
                                          isContactDialog={isContactDialog}
                                          memberName={getLabelName(member)}
                                        />
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              ))}
                          </ul>
                        </div>
                        <div>
                          {favTotalCount > 1 && (
                            <ReactPaginate
                              previousLabel={'⟨'}
                              nextLabel={'⟩'}
                              // breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={favTotalCount}
                              marginPagesDisplayed={0}
                              pageRangeDisplayed={2}
                              onPageChange={handlePagefavClick}
                              containerClassName={'con-pagination'}
                              activeClassName={'active'}
                            />
                          )}
                        </div>
                      </TabPane>
                      <TabPane tabId="favTab3">
                        <div>
                          <ul className="list-group list-group-flush">
                            {assignedConversation &&
                              assignedConversation &&
                              assignedConversation.map((conversation, i) => (
                                <Card key={i} className="chat-name">
                                  <CardBody>
                                    <li
                                      className={`list-group-item ${
                                        conversation.item.assigned_number === assignedMember.assigned_number
                                          ? 'open-chat'
                                          : ''
                                      } ${
                                        checkAssignConversation(conversation.item.assigned_number) &&
                                        !checkNotifies(conversation.item.assigned_number)
                                          ? 'list-chat'
                                          : !checkNotifies(conversation.item.assigned_number) ||
                                            checkAssignConversation(conversation.item.assigned_number)
                                          ? 'list-count-chat'
                                          : ''
                                      }`}
                                      onClick={() => changeAssignedConversation(conversation.item)}
                                    >
                                      <figure className="avatar">
                                        <img src={silhoutte} className="avatar" alt="avatar" />
                                      </figure>
                                      <div className="users-list-body">
                                        <span onClick={() => changeAssignedConversation(conversation.item)}>
                                          {conversation.labelName === '' && getAssignName(conversation).length === 0 ? (
                                            conversation.company === undefined || conversation.company === '' ? (
                                              <h5 className="chat-phoneNumber">
                                                {phoneNumFormat(conversation.item.assigned_number)}
                                              </h5>
                                            ) : (
                                              <>
                                                <h5>{conversation.company}</h5>
                                                <h6>{phoneNumFormat(conversation.item.assigned_number)}</h6>
                                              </>
                                            )
                                          ) : (
                                            <span>
                                              <div className="chat-labelName">
                                                <h5>
                                                  {conversation.labelName === ''
                                                    ? getAssignLabelName(conversation) &&
                                                      getAssignLabelName(conversation).labelName !== undefined
                                                      ? truncateString(getAssignLabelName(conversation).labelName, 17)
                                                      : ''
                                                    : truncateString(conversation.labelName, 17)}
                                                </h5>
                                              </div>
                                              {conversation.labelName === '' ? (
                                                <>
                                                  <h5 id={`assignnumbercount-${i}`}>
                                                    {getAssignName(conversation).length > 0 &&
                                                      `or  ${getAssignName(conversation).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`assignnumbercount-${i}`)}
                                                    autohide={false}
                                                    target={`assignnumbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`assignnumbercount-${i}`)}
                                                  >
                                                    {getAssignName(conversation).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName !==
                                                        (getAssignLabelName(conversation) &&
                                                          getAssignLabelName(conversation).labelName)
                                                          ? data.labelName === ''
                                                            ? data.company
                                                            : data.labelName
                                                          : conversation.company}
                                                        ,
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              ) : (
                                                <>
                                                  <h5 id={`assignnumbercount-${i}`}>
                                                    {getAssignName(conversation).length > 0 &&
                                                      `or  ${getAssignName(conversation).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`assignnumbercount-${i}`)}
                                                    autohide={false}
                                                    target={`assignnumbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`assignnumbercount-${i}`)}
                                                  >
                                                    {getAssignName(conversation).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName === '' ? data.company : data.labelName},
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              )}
                                              <h6>{conversation.company}</h6>
                                              <h6>{phoneNumFormat(conversation.item.assigned_number)}</h6>
                                            </span>
                                          )}
                                          {getFavorite(conversation.item.assigned_number) > 0 ? (
                                            <i
                                              onClick={() => deleteFavorite(conversation.item.assigned_number)}
                                              className="far fa-star chat-favorite-icon"
                                            ></i>
                                          ) : (
                                            <i
                                              onClick={() => addFavorite(conversation.item.assigned_number)}
                                              className="far fa-star chat-important-icon"
                                            ></i>
                                          )}
                                          {!conversation.readConversation && (
                                            <div key={i} className="users-list-action">
                                              <div className="new-message-count">1</div>
                                            </div>
                                          )}
                                          <Badge
                                            className="assign-badge"
                                            onClick={() => assignConversationShowPopup(conversation)}
                                            pill
                                          >
                                            Assigned to{' '}
                                            {checkAssignConversationLength(conversation.item.assigned_number)}{' '}
                                            {`${
                                              checkAssignConversationLength(conversation.item.assigned_number) === 1
                                                ? 'person'
                                                : 'people'
                                            }`}
                                          </Badge>
                                          {members.notifies &&
                                            members.notifies.map((notify, i) => {
                                              if (notify.number === conversation.item.assigned_number) {
                                                return (
                                                  <div key={i} className="users-list-action">
                                                    <div className="new-message-count">{notify.newMsg}</div>
                                                  </div>
                                                )
                                              }
                                              return null
                                            })}
                                        </span>
                                      </div>
                                    </li>
                                    <div className="users-list-action">
                                      <div className="action-toggle">
                                        <DropMenu
                                          tab="favTab3"
                                          toNumber={conversation.item.assigned_number}
                                          readConversation={conversation.readConversation}
                                          fromNumber={adminPhoneNum}
                                          email={userName.userEmail}
                                          deleteHistory={deleteHistory}
                                          contactID={conversation.contactID}
                                          labelName={conversation.labelName}
                                          member={conversation.item}
                                          isContactDialog={isContactDialog}
                                          memberName={getAssignLabelName(conversation)}
                                        />
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              ))}
                          </ul>
                        </div>
                        <div>
                          {assignTotalCount > 1 && (
                            <ReactPaginate
                              previousLabel={'⟨'}
                              nextLabel={'⟩'}
                              // breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={assignTotalCount}
                              marginPagesDisplayed={0}
                              pageRangeDisplayed={2}
                              onPageChange={handlePageAssignClick}
                              containerClassName={'con-pagination'}
                              activeClassName={'active'}
                            />
                          )}
                        </div>
                      </TabPane>
                      <TabPane tabId="favTab4">
                        <div>
                          <ul className="list-group list-group-flush">
                            {unreadMembers &&
                              unreadMembers &&
                              unreadMembers.map((member, i) => (
                                <Card key={i} className="chat-name">
                                  <CardBody>
                                    <li
                                      key={i}
                                      onClick={() => {
                                        isContactInformation(false, member)
                                        setMemberIformation(member)
                                        setMemNumber(member.memberNum)
                                      }}
                                      className={`list-group-item ${
                                        member.memberNum === values.phoneNum ? 'open-chat' : ''
                                      }  ${
                                        checkAssignConversation(member.memberNum) && !checkNotifies(member.memberNum)
                                          ? 'list-chat'
                                          : !checkNotifies(member.memberNum) ||
                                            checkAssignConversation(member.memberNum)
                                          ? 'list-count-chat'
                                          : ''
                                      }`}
                                    >
                                      <figure className="avatar">
                                        <img src={silhoutte} className="avatar" alt="avatar" />
                                      </figure>
                                      <div className="users-list-body">
                                        <span onClick={() => setMemNumber(member.memberNum)}>
                                          {member.labelName === '' && getName(member).length === 0 ? (
                                            member.company === undefined || member.company === '' ? (
                                              <h5>{phoneNumFormat(member.memberNum)}</h5>
                                            ) : (
                                              <>
                                                <h5>{member.company}</h5>
                                                <h6>{phoneNumFormat(member.memberNum)}</h6>
                                              </>
                                            )
                                          ) : (
                                            <span>
                                              <div className="chat-labelName">
                                                <h5>
                                                  {member.labelName === ''
                                                    ? getLabelName(member) &&
                                                      getLabelName(member).labelName !== undefined
                                                      ? truncateString(getLabelName(member).labelName, 17)
                                                      : ''
                                                    : truncateString(member.labelName, 17)}
                                                </h5>
                                              </div>
                                              {member.labelName === '' ? (
                                                <>
                                                  <h5 id={`numbercount-${i}`}>
                                                    {getName(member).length > 0 &&
                                                      `or  ${getName(member).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`numbercount-${i}`)}
                                                    autohide={false}
                                                    target={`numbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`numbercount-${i}`)}
                                                  >
                                                    {getName(member).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName !==
                                                        (getLabelName(member) && getLabelName(member).labelName)
                                                          ? data.labelName === ''
                                                            ? data.company
                                                            : data.labelName
                                                          : member.company}
                                                        ,
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              ) : (
                                                <>
                                                  <h5 id={`numbercount-${i}`}>
                                                    {getName(member).length > 0 &&
                                                      `or  ${getName(member).length} other`}{' '}
                                                  </h5>
                                                  <Tooltip
                                                    placement="bottom"
                                                    isOpen={isToolTipOpen(`numbercount-${i}`)}
                                                    autohide={false}
                                                    target={`numbercount-${i}`}
                                                    toggle={() => toggleTooltip4(`numbercount-${i}`)}
                                                  >
                                                    {getName(member).map((data, i) => (
                                                      <div key={i}>
                                                        {data.labelName === '' ? data.company : data.labelName},
                                                      </div>
                                                    ))}
                                                  </Tooltip>
                                                </>
                                              )}
                                              <h6>{member.company}</h6>
                                              <h6>{phoneNumFormat(member.memberNum)}</h6>
                                            </span>
                                          )}
                                          {getFavorite(member.memberNum) > 0 ? (
                                            <i
                                              onClick={() => deleteFavorite(member.memberNum)}
                                              className="far fa-star chat-favorite-icon"
                                            ></i>
                                          ) : (
                                            <i
                                              onClick={() => addFavorite(member.memberNum)}
                                              className="far fa-star chat-important-icon"
                                            ></i>
                                          )}
                                          {checkAssignConversation(member.memberNum) > 0 && (
                                            <Badge
                                              className="assign-badge"
                                              onClick={() => assignConversationShowPopup(member)}
                                              pill
                                            >
                                              Assigned to {checkAssignConversationLength(member.memberNum)}{' '}
                                              {`${
                                                checkAssignConversationLength(member.memberNum) === 1
                                                  ? 'person'
                                                  : 'people'
                                              }`}
                                            </Badge>
                                          )}
                                          {members.notifies &&
                                            members.notifies.map((notify, i) => {
                                              if (notify.number === member.memberNum) {
                                                return (
                                                  <div key={i} className="users-list-action">
                                                    <div className="new-message-count">{notify.newMsg}</div>
                                                  </div>
                                                )
                                              }
                                              return null
                                            })}
                                        </span>
                                      </div>
                                    </li>
                                    <div className="users-list-action">
                                      <div className="action-toggle">
                                        <DropMenu
                                          tab="favTab4"
                                          toNumber={member.memberNum}
                                          readConversation={member.readConversation}
                                          fromNumber={adminPhoneNum}
                                          email={userName.userEmail}
                                          deleteHistory={deleteHistory}
                                          contactID={member.contactID}
                                          labelName={member.labelName}
                                          memberName={getLabelName(member)}
                                          favoriteMem={members.favoriteMem}
                                          member={member}
                                          isContactDialog={isContactDialog}
                                        />
                                      </div>
                                    </div>
                                  </CardBody>
                                </Card>
                              ))}
                          </ul>
                        </div>
                        <div>
                          {unreadTotalCount > 1 && (
                            <ReactPaginate
                              previousLabel={'⟨'}
                              nextLabel={'⟩'}
                              // breakLabel={'...'}
                              breakClassName={'break-me'}
                              pageCount={unreadTotalCount}
                              marginPagesDisplayed={0}
                              pageRangeDisplayed={2}
                              onPageChange={handlePageUnreadClick}
                              containerClassName={'con-pagination'}
                              activeClassName={'active'}
                            />
                          )}
                        </div>
                      </TabPane>
                    </TabContent>
                  </PerfectScrollbar>
                </div>
              </div>
            </div>
            <div className="chat">
              <div className="chat-header">
                <div className="chat-header-user">
                  <div className="conversation-header">
                    <h5>Conversations</h5>
                    <div className="user-number">
                      <small className="text-muted phoneNumber-admin">
                        <i>{adminPhoneNum ? phoneNumFormat(adminPhoneNum) : 'Phone Number'}</i>
                      </small>
                      <div
                        className="btn number-btn position-number-dropdown"
                        id="userPhonenumber"
                        onClick={userPhoneNumModal}
                      >
                        <i className="fas fa-caret-down"></i>
                        {totalMsgCount > 0 && (
                          <div className="unread-message-count total-msg-count ml-2">{totalMsgCount}</div>
                        )}
                      </div>
                      <Tooltip
                        placement="top"
                        isOpen={tooltipOpen2}
                        autohide={false}
                        target="userPhonenumber"
                        toggle={toggleTooltip2}
                      >
                        Phone Number
                      </Tooltip>
                    </div>
                  </div>
                </div>
              </div>
              {printerToogle && (
                <Printer
                  printerToogle={printerToogle}
                  printerModal={printerModal}
                  startDate={startDate}
                  endDate={endDate}
                  startDateChange={startDateChange}
                  endDateChange={endDateChange}
                  exportPDF={exportPDF}
                  styleMode={styleMode}
                />
              )}
              <div className={`chat-body ${messagesList.length === 0 ? 'no-message' : ''}`}>
                <PerfectScrollbar>
                  {messagesList.length === 0 ? (
                    <div className="no-message-container">
                      <i className="fas fa-comments"></i>
                      <p>Select a conversation to read messages</p>
                    </div>
                  ) : (
                    <div className="messages">
                      {values.phoneNum &&
                        messagesList &&
                        messagesList.length > 0 &&
                        messagesList.map((message, index) => {
                          if (
                            (values.phoneNum === message.to_number || values.phoneNum === message.distributionId) &&
                            adminPhoneNum === message.from_number &&
                            message.direction === 'out'
                          ) {
                            return (
                              <div key={index} className="message-item outgoing-message  mt-2">
                                <div className="message-row">
                                  <div className="message-text">
                                    {message.text && (
                                      <>
                                        <Message
                                          isModal={isModal}
                                          setIsModal={setIsModal}
                                          toggleModal={setIsModal}
                                          message={message}
                                        />
                                        <></>
                                      </>
                                    )}

                                    {message.media && (
                                      <div
                                        className={`message-content ${message.scheduleMsg ? 'schedule-message' : ''}`}
                                        ref={myRef}
                                      >
                                        {path.extname(message.media) === '.3gp' ||
                                        path.extname(message.media) === '.amr' ? (
                                          <a href={message.media} target="_blank" rel="noopener noreferrer">
                                            {path.basename(message.media)}
                                          </a>
                                        ) : (
                                          getMedia(message.media)
                                        )}
                                      </div>
                                    )}
                                    <div className="message-action">
                                      <span className="sender">
                                        {message.automation
                                          ? ''
                                          : message.userName !== ''
                                          ? message.userName
                                          : message.sender}
                                      </span>
                                      <p>
                                        {message.scheduleTime
                                          ? convertDateTime(message.scheduleTime)
                                          : convertDateTime(message.createdAt)}
                                      </p>
                                      {message.is_failed === true ? (
                                        <div className="error-close-icon"> {message.err_description}</div>
                                      ) : message.state === '1' ? (
                                        <i className="ti-double-check"></i>
                                      ) : (
                                        <i className="ti-check"></i>
                                      )}
                                    </div>
                                    {message.scheduleMsg && (
                                      <div className="chat-end-msg">
                                        <div className="chat-schedule-msg">
                                          Your message will be sent to{' '}
                                          <span className="chat-schedule-name">
                                            @
                                            {memberInformation.labelName &&
                                            memberInformation.labelName !== undefined &&
                                            memberInformation.labelName !== ''
                                              ? memberInformation.labelName
                                              : getLabelName(memberInformation) &&
                                                getLabelName(memberInformation).labelName !== undefined
                                              ? getLabelName(memberInformation).labelName
                                              : memberInformation.memberNum}{' '}
                                          </span>
                                          {convertScheduleDateTime(message.scheduleTime)}.{' '}
                                          <span className="chat-schedule-edit" onClick={() => toggleModal()}>
                                            {' '}
                                            Edit this message{' '}
                                          </span>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <div className="user-image">
                                    {message.automation ? (
                                      <img src={robot} className="robot" alt="avatar" />
                                    ) : message.avatar ? (
                                      <img
                                        src={`${CONFIG.serverURL}/users/${message.avatar}`}
                                        className="avatar"
                                        alt="avatar"
                                      />
                                    ) : (
                                      <img src={silhoutte} className="avatar" alt="avatar" />
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          } else if (
                            values.phoneNum === message.from_number &&
                            adminPhoneNum === message.to_number &&
                            message.direction === 'in'
                          ) {
                            return (
                              <div key={index} className="message-item  incoming-message">
                                <div className="incoming-sender">
                                  <div className="sender-user-image">
                                    {message.automation ? (
                                      <img src={robot} className="robot" alt="avatar" />
                                    ) : message.avatar ? (
                                      <img
                                        src={`${CONFIG.serverURL}/users/${message.avatar}`}
                                        className="avatar"
                                        alt="avatar"
                                      />
                                    ) : (
                                      <img src={silhoutte} className="avatar" alt="avatar" />
                                    )}
                                  </div>
                                  {message.text ? <Message message={message} /> : ''}
                                  {message.media ? (
                                    <div className="message-content mt-2 ">
                                      <a href={message.media} target="_blank" rel="noopener noreferrer">
                                        {path.extname(message.media) === '.3gp' ||
                                        path.extname(message.media) === '.amr'
                                          ? path.basename(message.media)
                                          : getMedia(message.media)}
                                      </a>
                                    </div>
                                  ) : (
                                    ''
                                  )}
                                </div>
                                <div className="message-action">{convertDateTime(message.createdAt)}</div>
                              </div>
                            )
                          }
                          if (message.assigner_name && message.assigned_number === values.phoneNum) {
                            return (
                              <div className="assigned-message" key={index}>
                                <div className="title">
                                  Message {message.state ? 'assigned' : 'unassigned'} to {message.assigned_name} by{' '}
                                  {message.assigner_name}
                                </div>
                                <div className="time">{convertDateTime(message.createdAt)}</div>
                              </div>
                            )
                          }
                          return true
                        })}
                      <div ref={messagesEndRef} id="end-message" />
                      <div className="chat-end-msg"></div>
                    </div>
                  )}
                </PerfectScrollbar>
              </div>
              <div className="chat-footer">
                <div className="chat-footer-form">
                  <div className="chat-image-upload">
                    <label id="#bb">
                      <i className="fas fa-paperclip"></i>
                      <input
                        type="file"
                        ref={uploadInput}
                        onChange={imageUpload}
                        accept="image/*|audio/*|video/*|application/*"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    name="msgText"
                    className="form-control"
                    placeholder="Type a message here…"
                    onChange={handleValues}
                    onKeyPress={handleValues}
                    value={values.msgText}
                  />
                  <div className="form-buttons">
                    <button
                      className="btn btn-primary btn-rounded btn-sm send-btn"
                      onClick={sendingMessage}
                      disabled={values.msgText.length === 0}
                    >
                      <i className="fas fa-paper-plane" />
                    </button>
                    <ScheduleSMS
                      toNumber={values.phoneNum}
                      fromNumber={favTab !== 'favTab3' ? adminPhoneNum : assignedMember.assigner_number}
                      message={values.msgText}
                      sender={adminUseremail}
                      media={uploadImgName}
                      updateValues={updateValues}
                      values={values}
                      tab={favTab}
                    />
                  </div>
                </div>
                <div className="message-action uplaodmsgtext">{uploadImgName}</div>
              </div>
            </div>
            {showContactInformationPane && (
              <ContactDetails
                isContactInformation={isContactInformation}
                memberInformation={memberInformation}
                callDetails={callDetails}
                voiceMailDetails={voicemails[0]}
                memberName={getLabelName(memberInformation)}
                setShowInfoPane={setShowInfoPane}
              />
            )}
            {showContactDialog && (
              <ContactDetailsSave
                isContactDialog={isContactDialog}
                showContactDialog={showContactDialog}
                toggleContactDialog={toggleContactDialog}
                fromNumber={adminPhoneNum}
                memberInformation={memberInformation}
              />
            )}
            {assignConversationModal && (
              <AssignConversation
                tab="favTab1"
                assignConversationShowPopup={assignConversationShowPopup}
                toggleAssignConversationPopup={toggleAssignConversationPopup}
                toNumber={assignMemberNum}
                fromNumber={adminPhoneNum}
                email={userName.userEmail}
                allUserNames={allUserNames}
                saveAssignConversation={saveAssignConversation}
                changeConversationAssignState={changeConversationAssignState}
                assignConversationModal={assignConversationModal}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
