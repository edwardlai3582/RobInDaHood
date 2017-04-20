import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import NumericInput from 'react-numeric-input';
NumericInput.style.input.width = '65px';
NumericInput.style.input.height = '25px';
import {
  deleteMonitorTicker,
  changeMonitorTickerPercentage,
  changeMonitorTickerLastPrice
} from '../actions'
import '../styles/PriceAlertPage.css'

class PriceAlertTicker extends Component  {
  static propTypes = {
    instrument_id: PropTypes.string.isRequired
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
      instrument_id,
      onChangeMonitorTickerPercentage,
      onChangeMonitorTickerLastPrice,
      onDeleteMonitorTicker
    } = this.props;
    const { percentage, last_price, symbol} = ticker;

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

const mapStateToProps = ({ monitorReducer }, ownProps) => {
  const { tickers } = monitorReducer;
  return { ticker: tickers[ownProps.instrument_id] };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChangeMonitorTickerPercentage: (instrument_id, percentage) => {
    dispatch(changeMonitorTickerPercentage(instrument_id, percentage));
  },
  onChangeMonitorTickerLastPrice: (instrument_id, last_price) => {
    dispatch(changeMonitorTickerLastPrice(instrument_id, last_price));
  },
  onDeleteMonitorTicker: (instrument_id) => {
      dispatch(deleteMonitorTicker(instrument_id));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceAlertTicker)
