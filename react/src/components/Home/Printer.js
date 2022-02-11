import React from 'react'
import DatePicker from 'react-datepicker'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import './Home.css'

const Printer = (props) => {
  const { printerToogle, printerModal, startDate, endDate, startDateChange, endDateChange, exportPDF, styleMode } =
    props
  return (
    <div>
      <Modal
        isOpen={printerToogle}
        toggle={printerModal}
        className={`${styleMode}-modal print-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader className="print-header">
           Print Conversation
        </ModalHeader>
        <ModalBody className="print-body">
          <span className="tab-title">Please select a period of time.</span>
          <div className="mt-2 row">
            <div className="col-md-6 print-date">
              <DatePicker
                className="form-control calendar"
                onChange={startDateChange}
                maxDate={endDate}
                selected={startDate}
                placeholderText="Start Date"
              />
            </div>
            <div className="col-md-6">
              <DatePicker
                className="form-control calendar"
                onChange={endDateChange}
                selected={endDate}
                minDate={startDate}
                maxDate={new Date()}
              />
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button className="assign-footer-btn cancel-btn" onClick={printerModal}>
            Cancel
          </Button>
          <Button color="primary" className="cancel-btn" onClick={exportPDF}>
            Print
          </Button>
        </ModalFooter>
      </Modal>
    </div>
  )
}
export default Printer
