import React, { PropTypes } from 'react'
import '../styles/Input.css'

const Input = ({ type, focus, value, onChange, label, message}) => (
  <div className="loginInputWrapper">
    <label>
      {label}
      <br/>
      <input className="loginInput" type={type} value={value} onChange={onChange} autoFocus={focus}/>
    </label>
    <div className="message">{message}</div>
  </div>
)
//onChange={e => onChange(e.target.value)}
Input.propTypes = {
  type: PropTypes.string.isRequired,
  focus: PropTypes.bool.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export default Input
