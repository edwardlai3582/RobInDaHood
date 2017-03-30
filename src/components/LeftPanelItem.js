import React, { PropTypes } from 'react'

const LeftPanelItem = ({ symbol, id, onClick, className }) => (
  <div id={id} onClick={onClick} className={className} >
    {symbol}
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
