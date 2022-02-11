import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import Notification from 'react-web-notification'
import alertIcon from '../../asset/media/img/VentureTel-SMS-Logo.png'
import alertAudio from '../../asset/media/mp3/drop.mp3'
import './Home.css'

const Notifications = (props) => {
  const { notification } = useSelector((state) => state.message)
  const { soundAlert } = useSelector((state) => state.message.numbers)

  const { state, fromNumber } = notification
  const [title, updateTitle] = useState('')
  const [options, updateOptions] = useState({})
  const [soundNotify, setSoundAlert] = useState(false)
  const [audio] = useState(new Audio(alertAudio))

  const handleNotificationOnClick = (e, tag) => {
    window.open('https://venturetel.app/home')
  }

  const handleNotificationOnError = (e, tag) => {
    console.log(e, 'Notification error tag:' + tag)
  }

  const handleNotificationOnClose = (e, tag) => {
    console.log(e, 'Notification closed tag:' + tag)
  }

  const handleNotificationOnShow = (e, tag) => {
    if (soundNotify) audio.play()
    console.log(e, 'Notification shown tag:' + tag)
  }

  const handleButtonClick = () => {
    const title = 'SMS Desktop Alert'
    const body = 'You have unread text messages from ' + phoneNumFormat(fromNumber)
    const icon = alertIcon
    const options = {
      body: body,
      icon: icon,
      lang: 'en',
      sound: alertAudio,
    }
    updateTitle(title)
    updateOptions(options)
  }
  const phoneNumFormat = (number) => {
    if (number) {
      const phone_number = parsePhoneNumberFromString(number)
      const phoneNumber = phone_number.formatNational()
      return phoneNumber
    } else return number
  }
  useEffect(() => {
    if (state) {
      handleButtonClick()
      if (soundNotify) audio.play()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notification])
  useEffect(() => {
    setSoundAlert(soundAlert)
  }, [soundAlert])

  return (
    <div>
      <Notification
        onShow={handleNotificationOnShow}
        onClick={handleNotificationOnClick}
        onClose={handleNotificationOnClose}
        onError={handleNotificationOnError}
        timeout={20000}
        title={title}
        options={options}
      />
    </div>
  )
}

export default Notifications
