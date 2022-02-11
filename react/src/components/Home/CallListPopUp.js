import React, { Fragment } from 'react'
import './message.css'
import { parsePhoneNumber } from 'libphonenumber-js'
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
} from 'reactstrap'
import InfiniteScroll from "react-infinite-scroll-component";
import * as CONSTS from '../../constants/const'

export class CallListPopUp extends React.Component {
    state = {
        calls: this.props.CallLists.slice(0, 20),
        hasMore: this.props.callCounter > 0 ? true : false
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

    getDuration= (totalSeconds) => {
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
        // if (number !== isNaN) {
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
        // }
    }

    fetchMoreData = () => {
        // a fake async api call like which sends
        // 20 more records in 1.5 secs
        let callsLength = this.state.calls.length;
        if (callsLength >= this.props.CallLists.length) {
            this.setState({ hasMore: false });
            return;
        }

        let count = (callsLength) ? callsLength: 0;
        let len = 20;
        if (count <= this.props.CallLists.length) {
            setTimeout(() => {
                // let newCount = ((this.props.CallLists.length - (count + len)) < len) ? this.props.CallLists.length - (count + len) : count + len;
                let newCount = count + len;
                this.setState({
                    calls: this.state.calls.concat(this.props.CallLists.slice(count, newCount))
                });
            }, 500);
        }
    };

    render() {
    return (
        <Fragment>
            <Modal
                isOpen={this.props.showCallListDialog}
                toggle={() => this.props.toggleCallListDialog(!this.props.showCallListDialog)}
                className={`light-modal modal-dialog modal-dialog-centered modal-dialog-zoom modal-lg`}
            >
                <ModalHeader toggle={() => this.props.toggleCallListDialog(!this.props.showCallListDialog)}>
                    <i className="fas fa-history"></i> Call History Details 
                </ModalHeader>
                <ModalBody>
                    <div className="row text-left">
                        <div className="voicemailtable">
                            <div className="mb-2 row1">
                                <div className="col-md-3">FROM</div>
                                <div className="col-md-3">TO</div>
                                <div className="col-md-4">DATE TIME</div>
                                <div className="col-md-2">DURATION</div>
                            </div>
                            <InfiniteScroll
                                dataLength={this.state.calls.length}
                                next={this.fetchMoreData}
                                hasMore={this.state.hasMore}
                                loader={<h4>Loading...</h4>}
                                maxHeight={200}
                                endMessage={''}
                                >
                                {this.state.calls.map((call, index) => (
                                    <div className="row" key={index}>
                                        <div className="col-md-3">
                                            <div className="text-left name"> {this.getPhoneNumber(call.from.split('@')[0])}</div>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="text-left name"> {this.getPhoneNumber(call.to.split('@')[0])}</div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="text-left name">{this.convertDateTime((call.timestamp - 62167219200) * 1000)}</div>
                                        </div>
                                        <div className="col-md-2">
                                            <div className="text-center name"> {this.getDuration(call.billing_seconds)}</div>
                                        </div>
                                    </div>
                                ))}
                            </InfiniteScroll>
                            { this.props.callCounter === 0 ? (
                                <div className="col-12 text-center">{CONSTS.EMPTY_CALL_LIST_MESSAGE}</div>
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

