import React, { PropTypes } from 'react'

const Position = ({ position }) => {
  return (
    <div className="">
      <div>
        {position.quantity}
      </div>
      <div>
        {position.average_buy_price}
      </div>
    </div>
  )
}


Position.propTypes = {
  position: PropTypes.object.isRequired
}

export default Position
