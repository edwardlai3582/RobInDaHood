import React, { Component, PropTypes } from 'react'
import NumericInput from 'react-numeric-input';
NumericInput.style.input.width = '65px';
NumericInput.style.input.height = '25px';
import '../styles/PriceAlertPage.css'

class PriceAlertTicker extends Component  {
  static propTypes = {
    ticker: PropTypes.object.isRequired
  }

  percentageFormat = (num) => {
    return num + '%';
  }

  priceFormat = (num) => {
    return '$' + num;
  }

  render() {
    const {
      ticker,
      onChangeMonitorTickerPercentage,
      onChangeMonitorTickerLastPrice,
      onDeleteMonitorTicker
    } = this.props;
    const { instrument_id, percentage, last_price, symbol} = ticker;

    return (
      <div className="priceAlertTicker" >
        <div className="priceAlertSymbol" > {`$${symbol}`} </div>
        <div className="priceAlertTickerSetting" >
          <NumericInput
            min={1}
            max={100}
            value={percentage}
            format={this.percentageFormat}
            onChange={(number)=>{onChangeMonitorTickerPercentage(instrument_id, number);}}
          />
          <span> of </span>
          <NumericInput
            min={0}
            step={0.01}
            precision={2}
            value={last_price}
            style={{ input: { width: '90px' } }}
            onChange={(number)=>{onChangeMonitorTickerLastPrice(instrument_id, number);}}
          />
        </div>
        <div className="priceAlertButtonWrapper">
          <button onClick={()=>{onDeleteMonitorTicker(instrument_id)}} className="priceAlertTickerButton" >
            REMOVE
          </button>
        </div>
      </div>
    )
  }
}

export default PriceAlertTicker
