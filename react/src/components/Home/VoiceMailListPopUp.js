import React, { Fragment } from 'react'
import './message.css'
import { parsePhoneNumber } from 'libphonenumber-js'
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from 'reactstrap'
import CONFIG from '../../constants/config'
import telIcon from '../../asset/media/svg/telicon-2.2.0.svg'
import axios from 'axios'
import InfiniteScroll from "react-infinite-scroll-component";
import Audioplayer from '../Voicemails/Audioplayer'
import * as CONSTS from '../../constants/const'

export class VoiceMailListPopUp extends React.Component {
  state = {
    voiceMails: this.props.VoiceMails.messages.slice(0, 20),
    hasMore: this.props.voiceMailCounter > 0 ? true : false,
    vmbox_id: this.props.VoiceMails.vmbox.id,
    account_id :localStorage.getItem('account_id'),
    auth_token : localStorage.getItem('token'),
    audioPlay: false,
    audioId: '',
    counter: this.props.VoiceMails.messages.length,
  };
  
  convertDateTime = (time) => {
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

  getDuration = (totalSeconds) => {
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

  getPhoneNumber = (number) => {
    let phone_number = ''
    if (!number.includes('+')) {
      if (number.length === 11) {
        phone_number = parsePhoneNumber('+' + number)
        let phone_num = phone_number.formatInternational()
        return phone_num
      } else if (number.length === 10) {
        phone_number = parsePhoneNumber('+1' + number)
        let phone_num = phone_number.formatInternational()
        return phone_num
      } else {
        return number
      }
    } else {
      phone_number = parsePhoneNumber(number)
      let phone_num = phone_number.formatInternational()
      return phone_num
    }
  }

  audioPlayer = (key) => {
    this.setState({
      audioId: key,
      media_id: key,
      audioPlay: !this.state.audioPlay,
    })
  }

  voicemailChangeStatus = (folderName, vmbox_id, media_id) => {
    if (window.confirm('Are you sure wish to change status of this Voicemail?')) {
      let URL = `${CONFIG.API_URL}/accounts/${this.state.account_id}/vmboxes/${vmbox_id}/messages/${media_id}`
      this.setState({
        loader: true,
      })

      axios
        .post(URL, { data: { folder: folderName } })
        .then((res) => {
          this.props.getallVmboxes()
          this.props.getmainvmboxes()
          this.setState({
            loader: false,
          })
        })
        .catch((error) => {
          console.log(error)
          this.setState({
            loader: false,
          })
        })
    }
  }

  audioPlayerEnd = (key, vmbox_id, media_id, state) => {
    if (state === 'new') {
      let url = `${CONFIG.API_URL}/accounts/${this.state.account_id}/vmboxes/${vmbox_id}/messages/${media_id}`
      axios
        .post(url)
        .then((res) => {
          this.props.getallVmboxes()
          this.props.getmainvmboxes()
        })
        .catch((error) => {
          console.log(error)
        })
    }
    this.setState({
      audioId: key,
      audioPlay: !this.state.audioPlay,
    })
  }
  fetchMoreData = () => {
    // a fake async api call like which sends
    // 20 more records in 1.5 secs
    let voiceMailsLength = this.state.voiceMails.length;
    if (voiceMailsLength >= this.props.VoiceMails.messages.length) {
      this.setState({ hasMore: false });
      return;
    }

    let count = (voiceMailsLength) ? voiceMailsLength : 0;
    let len = 20;
    if (count <= this.props.VoiceMails.messages.length) {
      setTimeout(() => {
        // let newCount = ((this.props.VoiceMails.messages.length - (count + len)) < len) ? this.props.VoiceMails.messages.length - (count + len) : count + len;
        let newCount = count + len;
        this.setState({ counter: newCount})
        this.setState({
          voiceMails: this.state.voiceMails.concat(this.props.VoiceMails.messages.slice(count, newCount))
        });
      }, 500);
    }
  };

  render() {
    return (
      <Fragment>
        <Modal
          isOpen={this.props.showVoiceMailDialog}
          toggle={() => this.props.toggleVoiceMailDialog(!this.props.showVoiceMailDialog)}
          className={`light-modal modal-dialog modal-dialog-centered modal-dialog-zoom modal-xl`}
        >
        <ModalHeader toggle={() => this.props.toggleVoiceMailDialog(!this.props.showVoiceMailDialog)}>
          <i className="fas fa-voicemail"></i> Voicemail Details
        </ModalHeader>
        <ModalBody>
          <div className="row text-left">
            <div className="voicemailtable">
              <div className="mb-2 row">
                <div className="col-md-3">DATE TIME</div>
                <div className="col-md-2 text-center">FROM</div>
                <div className="col-md-2 text-center">TO</div>
                <div className="col-md-1 text-center">DURATION</div>
                <div className="col-md-4 text-center">ACTION</div>
                </div>
                <InfiniteScroll
                  dataLength={this.state.voiceMails.length}
                  next={this.fetchMoreData}
                  hasMore={this.state.hasMore}
                  loader={<h4>Loading...</h4>}
                  maxHeight={200}
                  endMessage={''}
                >
                {this.state.voiceMails.map((voiceMail, index) => (
                  <div key={index}>
                  {voiceMail.caller_id_number === this.props.memberInformation.memberNum ? (
                  <div className="row" key={index}>
                    <div className="col-md-3">
                      <div className="text-left name">{this.convertDateTime((voiceMail.timestamp - 62167219200) * 1000)}</div>
                    </div>
                    <div className="col-md-2">
                      <div className="text-left name"> {this.getPhoneNumber(voiceMail.from.split('@')[0])}</div>
                    </div>
                    <div className="col-md-2">
                      <div className="text-left name"> {this.getPhoneNumber(voiceMail.to.split('@')[0])}</div>
                    </div>
                    <div className="col-md-1">
                      <div className="name d-inline-block mr-2"> {this.getDuration(voiceMail.length / 1000)}</div>
                    </div>
                    <div className="col-md-4">
                      {this.state.audioPlay && voiceMail.media_id === this.state.audioId ? (
                      <div className="row">
                        <div className="col-md-10">
                          <Audioplayer props={this.state} />
                        </div>
                        <div className="col-md-2">
                          <button
                            className="audio-close"
                              onClick={() => this.audioPlayerEnd(this.state.audioPlay, this.state.vmbox_id, voiceMail.media_id, voiceMail.folder)}
                          >
                            Close
                          </button>
                        </div>
                      </div>
                      ) : (
                      <div className="mailchange">
                        <svg className="audioplay gray-icon" onClick={() => this.audioPlayer(voiceMail.media_id)}>
                          <use href={`${telIcon}#play--circle`} />
                        </svg>
                          {/* <a href={URL}> */}
                          <a href={`${CONFIG.API_URL}/accounts/${this.state.account_id}/vmboxes/${this.props.VoiceMails.vmbox.id}/messages/${voiceMail.media_id}/raw?auth_token=${this.state.auth_token}`}>
                            <svg className="gray-icon">
                              <use href={`${telIcon}#download-cloud`} />
                            </svg>
                          </a>
                      </div>
                      )}
                    </div>
                    {
                      // this.setState(prevState => {
                      //   return {counter: prevState.counter + 1}
                      // })
                   }
                  </div>
                  ):('')}
                  </div>
                ))}
                </InfiniteScroll>
                { this.props.voiceMailCounter === 0 ? (
                  <div className="col-12 text-center">{CONSTS.EMPTY_VOICEMAIL_LIST_MESSAGE}</div>
                ) : ('')}
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
          </ModalFooter>
        </Modal>
      </Fragment>
    );
  }
}

