import React, { PropTypes } from 'react'
import '../styles/LeftPanelItem.css'

const LeftPanelItem = ({ symbol, id, onClick, className, children }) => (
  <div id={id} onClick={onClick} className={`leftPanelItemWrapper ${className}`} >
    <div className="symbolDiv">{symbol}</div>
    {(React.Children.toArray(children).length === 0)? null : <div className="infoDiv">{children}</div> }
  </div>
)

LeftPanelItem.propTypes = {
  symbol: PropTypes.string.isRequired,
  id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number
      ]),
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string.isRequired
}

export default LeftPanelItem
