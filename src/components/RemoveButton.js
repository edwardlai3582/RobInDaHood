import React from 'react'
import '../styles/RemoveButton.css'

const RemoveButton = ({cb}) => (
  <div className="removeButtonBorder" onClick={cb}>
    <div className="removeSign"></div>
  </div>
)

export default RemoveButton
