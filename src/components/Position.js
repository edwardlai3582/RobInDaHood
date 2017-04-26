import React, { PropTypes } from 'react'
import '../styles/Position.css'

const Position = ({ position, quote }) => {
  const quantity = Number(position.quantity);
  const average_buy_price = Number(position.average_buy_price);
  const intraday_average_buy_price = Number(position.intraday_average_buy_price);
  const intraday_quantity = Number(position.intraday_quantity);
  const previous_close = Number(quote.previous_close);

  const lastPrice = (quote.last_extended_hours_trade_price)? quote.last_extended_hours_trade_price : quote.last_trade_price;
  const equityValue = (lastPrice*quantity).toFixed(2);
  let totalReturn = (lastPrice - average_buy_price)*quantity;
  if(totalReturn < 0) {
    totalReturn = "-US$"+(-1)*totalReturn.toFixed(2)
  }
  else {
    totalReturn = "+US$"+totalReturn.toFixed(2)
  }
  const totalReturnPercentage = ( ( lastPrice - average_buy_price ) / average_buy_price*100 ).toFixed(2);
//console.log(position);
  let todaysReturn = 0;
  let todaysReturnPercentage = 0;
  if( intraday_average_buy_price > 0 && intraday_quantity > 0 ) {
    let TodayOnlyReturn = (lastPrice - intraday_average_buy_price) * intraday_quantity;
    let notTodayQuantity = quantity - intraday_quantity;

    todaysReturn = (lastPrice - previous_close) * notTodayQuantity + TodayOnlyReturn;
    todaysReturnPercentage =  ( (todaysReturn / ( previous_close * quantity )) * 100 ).toFixed(2);
  }
  else {
    todaysReturn = (lastPrice - previous_close)*quantity;
    todaysReturnPercentage = ( (lastPrice - previous_close) / previous_close * 100 ).toFixed(2);
  }

  if(todaysReturn < 0) {
    todaysReturn = "-US$"+(-1)*todaysReturn.toFixed(2)
  }
  else {
    todaysReturn = "+US$"+todaysReturn.toFixed(2)
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
