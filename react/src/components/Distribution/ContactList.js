import React, { useState } from 'react'
import { Button } from 'reactstrap'
import { parsePhoneNumberFromString } from 'libphonenumber-js'

import ContactModal from './ContactModal'

import './styles.css'

const ContactList = (props) => {
  const { contactsList, distributionId, uniqueId } = props

  const [isModal, setIsModal] = useState(false)
  const [contact, setContact] = useState({})

  const toggleModal = () => {
    setIsModal(!isModal)
  }

  const editContact = (data) => {
    setContact(data)
    toggleModal()
  }

  const addContact = () => {
    setContact({})
    toggleModal()
  }

  const phoneNumberFormat = (number) => {
    if (number) {
      const phone_number = parsePhoneNumberFromString(number)
      if (!phone_number) {
        var cleaned = ('' + number).replace(/\D/g, '')
        var match = cleaned.match(/^(1|)?(\d{3})(\d{3})(\d{4})$/)
        if (match) {
          return ['(', match[2], ') ', match[3], '-', match[4]].join('')
        }
        return null
      } else {
        const phoneNumber = phone_number.formatNational()
        return phoneNumber
      }
    } else return number
  }

  return (
    <div className="contactList">
      {distributionId !== '' && (
        <>
          <div className="d-flex justify-content-end align-items-center mb-2">
            <Button color="primary" onClick={addContact}>
              Add Contact
            </Button>
          </div>
          <div className="mb-2">
            Distribution ID: <span className="text-primary">{uniqueId}</span>
          </div>
          <table className="table table-striped mb-0 client-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Phone Number</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {contactsList.length > 0 &&
                contactsList.map((list, index) => (
                  <tr key={index}>
                    <td className="td-center">{index + 1}</td>
                    <td className="td-center">{list.name}</td>
                    <td className="td-center">{phoneNumberFormat(list.phoneNumber)}</td>
                    <td className="td-center">
                      <div className="form-item custom-control custom-switch mt-2">
                        <input
                          type="checkbox"
                          className="custom-control-input"
                          id="status"
                          checked={list.status}
                          readOnly
                        />
                        <label className="custom-control-label" htmlFor="status" />
                      </div>
                    </td>
                    <td className="td-center">
                      <i className="fas fa-cog" onClick={() => editContact(list)}></i>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          <ContactModal
            isModal={isModal}
            setIsModal={setIsModal}
            toggleModal={toggleModal}
            distributionId={distributionId}
            editData={contact}
          />
        </>
      )}
    </div>
  )
}

export default ContactList
