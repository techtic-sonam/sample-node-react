import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Sidebar from '../Sidebar/Sidebar'
import { getCallForward } from '../../actions/message.action'
import Dialog from '../Sidebar/Dialog'
import './dashboard.css'
import { Pie, HorizontalBar } from 'react-chartjs-2'
import { Line } from 'react-chartjs-2'
import {
  getAllUsers,
  // getActiveCallDetails,
  getCallHistory,
  getDevices,
  getNumbers,
  getAccountInfo,
  getMessageReport,
  getTopSenders,
} from '../../actions/dashboard.action'

import moment from 'moment'
import _ from 'lodash'
import UserHeader from '../Header/UserHeader'

const Dashboard = (props) => {
  const dispatch = useDispatch()
  const [contactToogle, updateContactUs] = useState(false)
  const [setNumberToogle, updateSetNumber] = useState(false)
  const [reportData, setReportData] = useState({})
  const { styleMode, isAdmin } = useSelector((state) => state.message.numbers)
  const { users, devices, numbers, callHistory, accountInfo, messageReport, getTopSender } = useSelector(
    (state) => state.dashboard,
  )
  // const { users, devices, numbers, calls, callHistory } = useSelector((state) => state.dashboard)

  const startDate = moment(moment().subtract(30, 'days')).unix()
  const endDate = moment().unix()

  if (isAdmin === false) {
    props.history.push('/home')
  }

  useEffect(() => {
    dispatch(getMessageReport())
    dispatch(getTopSenders())
    dispatch(getAllUsers())
    dispatch(getDevices())
    // dispatch(getActiveCallDetails())
    dispatch(getCallHistory(startDate, endDate))
    dispatch(getNumbers())
    dispatch(getAccountInfo())
    // eslint-disable-next-line
  }, [])

  const contactUsModal = () => {
    updateContactUs(!contactToogle)
  }

  const changeSetNumberModal = () => {
    if (!setNumberToogle) {
      dispatch(getCallForward())
    }
    updateSetNumber(!setNumberToogle)
  }

  var numbersArray = _.keys(numbers)
  var numbersArrayValues = _.values(numbers)

  const numbersData = {
    labels: ['Assigned', 'Spare'],
    datasets: [
      {
        data: [
          numbersArrayValues.filter((number) => number.used_by === 'callflow').length,
          numbersArrayValues.filter((number) => number.used_by !== 'callflow').length,
        ],
        backgroundColor: ['#FF6384', '#63FF84'],
      },
    ],
  }

  const sendersData = {
    labels: getTopSender.map((item) => item.senderName),
    datasets: [
      {
        label: '# of SMS count',
        axis: 'y',
        data: getTopSender.map((item) => item.count),
        backgroundColor: [
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
        ],
        borderColor: [
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
          '#3f51b5',
        ],
        borderWidth: 1,
      },
    ],
  }

  const devicesData = {
    labels: ['Registered', 'Unregistered'],
    datasets: [
      {
        data: [
          devices.filter((device) => device.registered === true).length,
          devices.filter((device) => device.registered === false).length,
        ],
        backgroundColor: ['#84FF63', '#8463FF'],
      },
    ],
  }
  // const messagesData = {
  //   labels: ['Sent', 'Received'],
  //   datasets: [
  //     {
  //       data: [messageReport ? messageReport.totalSendCount : 0, messageReport ? messageReport.totalReceivedCount : 0],
  //       backgroundColor: ['#FF6384', '#8463FF'],
  //     },
  //   ],
  // }
  let dataArray = []
  for (let index = 0; index < 30; index++) {
    dataArray.push({
      label: moment(moment().subtract(index, 'days')).date(),
      value:
        callHistory &&
        callHistory.filter((call) => moment(call.datetime).date() === moment(moment().subtract(index, 'days')).date())
          .length,
    })
  }

  const data = {
    labels: dataArray.reverse().map((data) => {
      return data.label
    }),
    datasets: [
      {
        label: 'Calls',
        fill: false,
        lineTension: 0.1,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderCapStyle: 'butt',
        borderDash: [],
        borderDashOffset: 0.0,
        borderJoinStyle: 'miter',
        pointBorderColor: 'rgba(75,192,192,1)',
        pointBackgroundColor: 'rgba(75,192,192,1)',
        pointBorderWidth: 1,
        pointHoverRadius: 5,
        pointHoverBackgroundColor: 'rgba(75,192,192,1)',
        pointHoverBorderColor: 'rgba(220,220,220,1)',
        pointHoverBorderWidth: 2,
        pointRadius: 2,
        pointHitRadius: 10,
        data: dataArray.map((data) => {
          return data.value
        }),
      },
    ],
  }
  useEffect(() => {
    if (messageReport && messageReport.reports.length > 0) {
      const labels = []
      const sendData = []
      const receivedData = []
      messageReport.reports.forEach((item) => {
        labels.push(new Date(item.date).getDate())
        receivedData.push(item.dayReceivedCount)
        sendData.push(item.daySentCount)
      })
      const report = {
        labels: labels,
        datasets: [
          {
            label: 'Sent',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(255,99,132,0.4)',
            borderColor: 'rgba(255,99,132,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(255,99,132,1)',
            pointBackgroundColor: 'rgba(255,99,132,1)',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(255,99,132,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 2,
            pointHitRadius: 10,
            data: sendData,
          },
          {
            label: 'Recevied',
            fill: false,
            lineTension: 0.1,
            backgroundColor: 'rgba(132,99,255,0.4)',
            borderColor: 'rgba(132,99,255,1)',
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            pointBorderColor: 'rgba(132,99,255,1)',
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBackgroundColor: 'rgba(132,99,255,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            data: receivedData,
          },
        ],
      }
      setReportData(report)
    }
  }, [messageReport])
  return (
    <div className={styleMode ? styleMode : 'light'}>
      <div className="layout-admin">
        <Sidebar contactUsModal={contactUsModal} changeSetNumberModal={changeSetNumberModal} history={props.history} />
        <Dialog
          contactUsModal={contactUsModal}
          contactToogle={contactToogle}
          changeSetNumberModal={changeSetNumberModal}
          setNumberToogle={setNumberToogle}
        />

        <div className="content">
          <UserHeader changeSetNumberModal={changeSetNumberModal} history={props.history} />
          <div className="right-dash">
            {/* <div className="right-dash-heading">
              <div onClick={() => props.history.push('/dashboard')}>Dashboard</div>
              <div onClick={() => props.history.push('/admindid')}>Numbers</div>
            </div> */}

            <div className="right-dash-middle">
              <div className="row">
                <div className="col-md-6">
                  <div className="dashboard-box">
                    <div className="dash-row">
                      <div className=" col-xl-5 col-md-4 admin-users">
                        <div className="dash-box-heading">
                          <h3>Total Users</h3>
                          <p className="dashboard-user">{users.length}</p>
                        </div>
                      </div>
                      <div className="col-md-8 account-col">
                        <div className="dash-box-account">
                          <span>
                            Account Realm: <p className="account-data">{accountInfo.realm}</p>
                          </span>
                          <span>
                            Account ID: <p className="account-data account-id">{localStorage.getItem('account_id')}</p>
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="box-btm-cont">
                          <Pie
                            variant="subheading"
                            color="inherit"
                            className="p-8 mb-8"
                            data={numbersData}
                            width={200}
                            height={200}
                            options={{
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="box-btm-cont">
                          <Pie
                            variant="subheading"
                            color="inherit"
                            className="p-8 mb-8"
                            data={devicesData}
                            width={200}
                            height={200}
                            options={{
                              maintainAspectRatio: false,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="row dash-footer">
                      <div className="col-md-6 number-data">
                        {' '}
                        <h3>Total Numbers {numbersArray.length}</h3>
                      </div>
                      <div className="col-md-6 number-data">
                        <h3>Total Devices {devices.length}</h3>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dashboard-box">
                    <div className="sms-sender">
                      <h3>Top SMS Senders Last 30 Days</h3>
                    </div>
                    <div className="box-btm-cont">
                      <HorizontalBar
                        data={sendersData}
                        width={250}
                        height={270}
                        options={{
                          scales: {
                            xAxes: [
                              {
                                ticks: {
                                  precision: 0,
                                },
                              },
                            ],
                          },
                          indexAxis: 'y',
                          plugins: {
                            title: { display: false, font: { size: 12, family: 'rubik' } },
                            legend: { display: false, position: 'right' },
                          },
                          maintainAspectRatio: false,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="row chart-data">
                <div className="col-md-6">
                  <div className="dashboard-chart">
                    <h3>SMS Sent/Received Last 30 Days</h3>
                    <Line height={80} data={reportData} />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="dashboard-chart">
                    <h3>Phone Calls Last 30 days: {callHistory.length}</h3>
                    <Line height={80} data={data} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
