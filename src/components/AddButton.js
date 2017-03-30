import React from 'react'
import '../styles/AddButton.css'

const AddButton = ({cb}) => (
  <div className="addButtonBorder" onClick={cb}>
    +
  </div>
)

export default AddButton
