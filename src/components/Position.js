import React, { PropTypes } from 'react'

const Position = ({ position, quotes }) => {
  const { quantity, average_buy_price } = position;
  const lastPrice = (quotes.last_extended_hours_trade_price)? quotes.last_extended_hours_trade_price : quotes.last_trade_price;
  const equityValue = lastPrice*quantity;
  const totalReturn = (lastPrice - Number(average_buy_price))*quantity;
  const todaysReturn = (lastPrice - Number(quotes.previous_close))*quantity;;

  return (
    <div className="">
      <div>
        {Number(quantity)}
      </div>
      <div>
        ${equityValue}
      </div>
      <div>
        ${Number(average_buy_price).toFixed(2)}
      </div>
      <div>
        {totalReturn.toFixed(2)}
      </div>
      <div>
        {todaysReturn.toFixed(2)}
      </div>
    </div>
  )
}


Position.propTypes = {
  position: PropTypes.object.isRequired
}

export default Position
