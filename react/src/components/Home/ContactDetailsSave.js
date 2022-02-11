import React, { useState, Fragment } from 'react'
import { useDispatch } from 'react-redux'
import './message.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { updateContact } from '../../actions/message.action'
import ContactDelete from './ContactDelete'

const ContactDetailsSave = (props) => {
  const dispatch = useDispatch()
  const [name, updateNameValue] = useState(props.memberInformation.labelName)
  const [company, updateCompanyValue] = useState(props.memberInformation.company)
  const [email, updateEmailValue] = useState(props.memberInformation.email)
  const [street, updateStreetValue] = useState(props.memberInformation.street)
  const [street2, updateStreet2Value] = useState(props.memberInformation.street2)
  const [city, updateCityValue] = useState(props.memberInformation.city)
  const [zip, updateZipValue] = useState(props.memberInformation.zip)
  const [state, updateStateValue] = useState(props.memberInformation.state)
  const { addContact } = props
  const [showDeleteDialog, setshowDeleteDialog] = useState(false)
  const [contact_id, setContact_id] = useState('')
  const [phoneNum, setPhoneNum] = useState(
    props.memberInformation.phoneNumber ? props.memberInformation.phoneNumber : props.memberInformation.memberNum,
  )
  const [contactNumberList, setContactNumberList] = useState(
    props.memberInformation.phoneNumbers ? props.memberInformation.phoneNumbers : [{ contact_number: '' }],
  )
  let contactID = props.memberInformation.contactID ? props.memberInformation.contactID : props.memberInformation._id
  const owner_id = localStorage.getItem('user_id')

  const updateContactData = () => {
    let contactID = props.memberInformation.contactID ? props.memberInformation.contactID : props.memberInformation._id
    let userID = props.memberInformation.userID ? props.memberInformation.userID : owner_id
    dispatch(
      updateContact(
        name,
        company,
        email,
        street,
        street2,
        city,
        zip,
        state,
        phoneNum,
        contactNumberList,
        props.fromNumber,
        contactID,
        userID,
      ),
    )
    props.toggleContactDialog(!props.showContactDialog)
  }

  const AddContactDatalis = () => {
    let contactID = props.memberInformation.contactID ? props.memberInformation.contactID : props.memberInformation._id
    let userID = props.memberInformation.userID ? props.memberInformation.userID : owner_id
    dispatch(
      updateContact(
        name,
        company,
        email,
        street,
        street2,
        city,
        zip,
        state,
        phoneNum,
        contactNumberList,
        props.fromNumber,
        contactID,
        userID,
      ),
    )
    props.toggleContactDialog(!props.showContactDialog)
  }

  const changeNameValue = (e) => {
    updateNameValue(e.target.value)
  }
  const changeCompanyValue = (e) => {
    updateCompanyValue(e.target.value)
  }
  const changeEmailValue = (e) => {
    updateEmailValue(e.target.value)
  }
  const changeStreetValue = (e) => {
    updateStreetValue(e.target.value)
  }
  const changeStreet2Value = (e) => {
    updateStreet2Value(e.target.value)
  }
  const changeCityValue = (e) => {
    updateCityValue(e.target.value)
  }
  const changeZipValue = (e) => {
    updateZipValue(e.target.value)
  }
  const changeStateValue = (e) => {
    updateStateValue(e.target.value)
  }
  const handlePhoneNumberChange = (e) => {
    setPhoneNum(e.target.value)
  }

  // handle input change
  const handleContactNumberChange = (e, index) => {
    const { name, value } = e.target
    const list = [...contactNumberList]
    list[index][name] = value
    setContactNumberList(list)
  }

  // handle click event of the Remove button
  const handleRemoveClick = (index) => {
    const list = [...contactNumberList]
    list.splice(index, 1)
    setContactNumberList(list)
  }

  // handle click event of the Add button
  const handleAddClick = () => {
    setContactNumberList([...contactNumberList, { contact_number: '' }])
  }

  const toggle = () => {
    props.toggleContactDialog(!props.showContactDialog)
  }

  const isContactDialog = (val, contactid) => {
    setshowDeleteDialog(val)
    if (contactid) {
      setContact_id(contactid)
    }
  }

  const toggleDeleteDialog = (val) => {
    setshowDeleteDialog(val)
  }

  return (
    <Fragment>
      <Modal
        isOpen={props.showContactDialog}
        toggle={toggle}
        className={`light-modal update-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader className="update-header">
          {addContact ? 'Add Contact Details' : 'Update Contact Details'}
        </ModalHeader>
        <ModalBody>
          <div className="contact">
            <div className="row">
              <div className="input-group update-div col-6">
                <input
                  type="text"
                  name="name"
                  className="form-control update-input"
                   placeholder="Contact Name"
                  value={name || ''}
                  onChange={changeNameValue}
                />
              </div>
              <div className="input-group col-6">
                <input
                  type="text"
                  name="company"
                  className="form-control update-input"
                  placeholder="Company Name"
                  value={company || ''}
                  onChange={changeCompanyValue}
                />
              </div>
            </div>
            <div className="row mt-1">
              <div className="input-group update-div col-6">
                <input
                  type="text"
                  name="email"
                  className="form-control update-input"
                  placeholder="Email"
                  value={email || ''}
                  onChange={changeEmailValue}
                />
              </div>
              <div className="input-group col-6">
                <input
                  type="text"
                  name="contact_number"
                  className="form-control update-input"
                  placeholder="Contact Number"
                  value={phoneNum || ''}
                  onChange={(e) => handlePhoneNumberChange(e)}
                />
              </div>
            </div>
            {contactNumberList.map((x, i) => {
              return (
                <div key={i} className="row mt-1">
                  <div className="input-group col-7">
                    <input
                      type="text"
                      name="contact_number"
                      className="form-control update-input"
                      placeholder="Contact Number"
                      value={x.contact_number || x.contact_number === '' ? x.contact_number : x || ''}
                      // onChange={changeContactNumberValue}
                      onChange={(e) => handleContactNumberChange(e, i)}
                    />
                    {contactNumberList.length !== 1 && (
                      <button className="btn btn-danger ml-1 mr-1 btn-floating" onClick={() => handleRemoveClick(i)}>
                        <i className="fas fa-times-circle"></i>
                      </button>
                    )}
                    {contactNumberList.length - 1 === i && (
                      <button className="btn btn-info add-btn btn-floating" onClick={handleAddClick}>
                        <i className="fas fa-plus-circle"></i>
                      </button>
                    )}
                    {/* {contactNumberList.length !== 1 && <i className="text-danger fas fa-times-circle" onClick={() => handleRemoveClick(i)}></i>}
                    {contactNumberList.length - 1 === i && <i className="text-info fas fa-plus-circle" onClick={handleAddClick}></i>} */}
                  </div>
                </div>
              )
            })}
            {/* <div className="row mt-1">
              <div className="input-group col-11">
                <input
                  type="text"
                  name="contact_number"
                  className="form-control"
                  placeholder="Contact Number"
                  value={contact_number}
                  onChange={changeContactNumberValue}
                />
              </div>
            </div> */}
            <div className="row mt-1">
              <div className="input-group col-12">
                <input
                  type="text"
                  name="street"
                  className="form-control update-input"
                  placeholder="Street"
                  value={street || ''}
                  onChange={changeStreetValue}
                />
              </div>
            </div>
            <div className="row mt-1">
              <div className="input-group col-12">
                <input
                  type="text"
                  name="street2"
                  className="form-control update-input"
                  placeholder="Street2"
                  value={street2 || ''}
                  onChange={changeStreet2Value}
                />
              </div>
            </div>
            <div className="row mt-1">
              <div className="input-group update-div col-4">
                <input
                  type="text"
                  name="city"
                  className="form-control update-input"
                  placeholder="City"
                  value={city || ''}
                  onChange={changeCityValue}
                />
              </div>
              <div className="input-group zip-update-div col-4">
                <input
                  type="text"
                  name="zip"
                  className="form-control update-input"
                  placeholder="Zipcode"
                  value={zip || ''}
                  onChange={changeZipValue}
                />
              </div>
              <div className="input-group state-update-div col-4">
                <input
                  type="text"
                  name="state"
                  className="form-control update-input"
                  placeholder="State"
                  value={state || ''}
                  onChange={changeStateValue}
                />
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter className="modalFooter">
          <Button color="btn btn-danger" className="deleteBtn" onClick={() => isContactDialog(true, contactID)}>
            {'Delete'}
          </Button>
          <Button color="primary" className="updateBtn" onClick={addContact ? AddContactDatalis : updateContactData}>
            {addContact ? 'Add Contact' : 'Update'}
          </Button>
          <Button className="assign-footer-btn updateBtn" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>
      {showDeleteDialog && (
        <ContactDelete
          isContactDialog={isContactDialog}
          showDeleteDialog={showDeleteDialog}
          toggleDeleteDialog={toggleDeleteDialog}
          contact_id={contact_id}
          toggleContactDialog={props.toggleContactDialog}
          showContactDialog={props.showContactDialog}
        />
      )}
    </Fragment>
  )
}

export default ContactDetailsSave;
