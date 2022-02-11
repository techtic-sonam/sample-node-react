import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'

import { addNewContact, editContact, deleteContact } from '../../actions/distribution.action'

import './styles.css'

const ContactModal = (props) => {
  const dispatch = useDispatch()
  const { styleMode } = useSelector((state) => state.message.numbers)
  const { isModal, toggleModal, distributionId } = props

  const [newContact, setNewContact] = useState({
    name: '',
    phoneNumber: '',
    status: false,
    distributionId: '',
  })

  const addContact = () => {
    if (distributionId === '') return
    const contact = {
      name: newContact.name,
      phoneNumber: '+1' + newContact.phoneNumber,
      status: newContact.status,
      distributionId: distributionId,
    }
    dispatch(addNewContact(contact))
    props.toggleModal()
  }

  const updateContact = () => {
    if (distributionId === '') return
    const contact = {
      name: newContact.name,
      phoneNumber: newContact.phoneNumber.includes('+1') ? newContact.phoneNumber : '+1' + newContact.phoneNumber,
      status: newContact.status,
      distributionId: distributionId,
    }
    dispatch(editContact(props.editData._id, contact))
    props.toggleModal()
  }

  const delContact = () => {
    if (distributionId === '') return
    dispatch(deleteContact(props.editData._id, newContact.distributionId))
    props.toggleModal()
  }

  useEffect(() => {
    setNewContact({ ...newContact, distributionId: distributionId })
    // eslint-disable-next-line
  }, [distributionId])

  useEffect(() => {
    if (Object.keys(props.editData).length > 0) {
      console.log(props.editData)

      setNewContact({
        ...newContact,
        name: props.editData.name,
        phoneNumber: props.editData.phoneNumber,
        status: props.editData.status,
      })
    } else {
      setNewContact({
        ...newContact,
        name: '',
        phoneNumber: '',
        status: false,
      })
    }
    // eslint-disable-next-line
  }, [props.editData])

  return (
    <Modal
      isOpen={isModal}
      toggle={toggleModal}
      className={`${styleMode}-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
    >
      <ModalHeader toggle={toggleModal}>
        <i className="ti-pencil-alt"></i> {Object.keys(props.editData).length > 0 ? 'Edit Contact' : 'Add New Contact'}
      </ModalHeader>
      <ModalBody>
        <div className="contact">
          <span className="tab-title">
            Please {Object.keys(props.editData).length > 0 ? 'edit' : 'add new'} contact.
          </span>
          <div className="mt-2" />
          <input
            type="text"
            name="label"
            className="form-control mt-2"
            value={newContact.name}
            onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
            placeholder="Contact Name"
          />
          <input
            type="text"
            name="label"
            className="form-control mt-2"
            value={newContact.phoneNumber}
            onChange={(e) => setNewContact({ ...newContact, phoneNumber: e.target.value })}
            placeholder="Phone Number (10 digits)"
          />
          <div className="form-item custom-control custom-switch mt-2">
            <input
              type="checkbox"
              className="custom-control-input"
              id="statusmodal"
              checked={newContact.status}
              onChange={(e) => setNewContact({ ...newContact, status: e.target.checked })}
            />
            <label className="custom-control-label" htmlFor="statusmodal">
              Inactive / Active
            </label>
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        {Object.keys(props.editData).length > 0 && (
          <Button color="danger" onClick={delContact}>
            Delete
          </Button>
        )}
        <Button color="secondary" onClick={toggleModal}>
          Cancel
        </Button>
        <Button color="primary" onClick={Object.keys(props.editData).length > 0 ? updateContact : addContact}>
          {Object.keys(props.editData).length > 0 ? 'Edit Contact' : 'Add Contact'}
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ContactModal
