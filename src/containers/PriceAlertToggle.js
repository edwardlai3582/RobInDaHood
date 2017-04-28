import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  deleteMonitorTicker,
  addMonitorTicker
} from '../actions'
import '../styles/PriceAlertToggle.css'

class PriceAlertToggle extends Component  {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    last_price: PropTypes.number.isRequired,
    instrument_id: PropTypes.string.isRequired
  }

  handleTogglePriceAlert = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    this.props.onToggleMonitorTicker(value);
  }

  render() {
    const { ticker } = this.props;
    const isIn = (ticker)? true : false;

    return (
      <div className="priceAlertWrapper" >
        <h5>PRICE ALERT</h5>
        <label className="switch">
          <input
            name="isInMonitor"
            type="checkbox"
            className="tgl tgl-flat"
            checked={isIn}
            onChange={this.handleTogglePriceAlert} />
          <div className="slider round"></div>
        </label>
      </div>
    )
  }
}

const mapStateToProps = ({ monitorReducer }, ownProps) => {
  const { tickers } = monitorReducer;
  return { ticker: tickers[ownProps.instrument_id] };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onToggleMonitorTicker: (value) => {
    if(value) {
      dispatch(addMonitorTicker(ownProps.instrument_id, ownProps.symbol, 3, ownProps.last_price));
    }
    else {
      dispatch(deleteMonitorTicker(ownProps.instrument_id));
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceAlertToggle)
