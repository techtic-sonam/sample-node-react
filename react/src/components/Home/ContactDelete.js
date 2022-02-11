import React, { Fragment } from 'react'
import { useDispatch } from 'react-redux'
import './message.css'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { deleteContact } from '../../actions/message.action'

const ContactDelete = (props) => {
  const dispatch = useDispatch()

  const contactId = props.contact_id

  const deleteContactData = () => {
    dispatch(deleteContact(contactId))
    props.toggleDeleteDialog(!props.showDeleteDialog)
    props.toggleContactDialog(!props.showDeleteDialog)
  }

  const toggle = () => {
    props.toggleDeleteDialog(!props.showDeleteDialog)
  }

  return (
    <Fragment>
      <Modal
        isOpen={props.showDeleteDialog}
        toggle={toggle}
        className={`modalHeader del-contact-modal modal-dialog modal-dialog-centered modal-dialog-zoom`}
      >
        <ModalHeader></ModalHeader>
        <ModalBody className="delete-body">
          <div className="delete-icon">
            <i className="fas fa-trash"></i>
          </div>
          <div>
            <h5>
              Are you sure you want to <br /> delete this contact?
            </h5>
          </div>
        </ModalBody>
        <ModalFooter className="delete-footer">
          <Button className="assign-footer-btn cancel-btn" onClick={toggle}>
            {'Cancel'}
          </Button>
          <Button color="primary" className="deleteContact" onClick={deleteContactData}>
            {'Delete'}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  )
}

export default ContactDelete
