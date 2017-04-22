import React, { PropTypes } from 'react'
import '../styles/Position.css'
import { printDateOnly } from '../utils'

const Position = ({ position, quote }) => {
  const { quantity, average_buy_price } = position;
  const lastPrice = (quote.last_extended_hours_trade_price)? quote.last_extended_hours_trade_price : quote.last_trade_price;
  const equityValue = (lastPrice*quantity).toFixed(2);
  let totalReturn = (lastPrice - Number(average_buy_price))*quantity;
  if(totalReturn < 0) {
    totalReturn = "-US$"+(-1)*totalReturn.toFixed(2)
  }
  else {
    totalReturn = "US$"+totalReturn.toFixed(2)
  }

  const totalReturnPercentage = ((lastPrice - Number(average_buy_price))/Number(average_buy_price)*100).toFixed(2);
  let todaysReturn = 0;
  let todaysReturnPercentage = 0;
  if(printDateOnly(position.created_at) === printDateOnly(new Date().toISOString())) {
    todaysReturn = (lastPrice - Number(average_buy_price))*quantity;
    todaysReturnPercentage = ((lastPrice - Number(average_buy_price))/Number(average_buy_price)*100).toFixed(2);
  }
  else {
    todaysReturn = (lastPrice - Number(quote.previous_close))*quantity;
    todaysReturnPercentage = ((lastPrice - Number(quote.previous_close))/Number(quote.previous_close)*100).toFixed(2);
  }

  if(todaysReturn < 0) {
    todaysReturn = "-US$"+(-1)*todaysReturn.toFixed(2)
  }
  else {
    todaysReturn = "US$"+todaysReturn.toFixed(2)
  }

  return (
    <div className="positionWRapper">
      <div className="upperPosition">
        <div className="upperDiv">
          <div className="positionNum">{Number(quantity)}</div>
          <div className="positionType">Shares</div>
        </div>
        <div className="upperDiv">
          <div className="positionNum">${equityValue}</div>
          <div className="positionType">Equity Value</div>
        </div>
      </div>
      <div className="lowerPosition">
        <div className="lowerDiv">
          <div className="positionType">Average Cost</div>
          <div className="positionNum">${Number(average_buy_price).toFixed(2)}</div>
        </div>
        <div className="lowerDiv">
          <div className="positionType">Total Return</div>
          <div className="positionNum">{totalReturn} ({totalReturnPercentage}%)</div>
        </div>
        <div className="lowerDiv">
          <div className="positionType">Today's Return</div>
          <div className="positionNum">{todaysReturn} ({todaysReturnPercentage}%)</div>
        </div>
      </div>
    </div>
  )
}


Position.propTypes = {
  position: PropTypes.object.isRequired
}

export default Position
