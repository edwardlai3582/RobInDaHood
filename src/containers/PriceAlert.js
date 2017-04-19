import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import NumericInput from 'react-numeric-input';
NumericInput.style.input.width = '80px';
NumericInput.style.input.height = '25px';

import {
  deleteMonitorTicker,
  addMonitorTicker,
  changeMonitorTickerPercentage
} from '../actions'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/PriceAlert.css'

class PriceAlert extends Component  {
  static propTypes = {
    symbol: PropTypes.string.isRequired,
    last_price: PropTypes.number.isRequired,
    instrument_id: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      isInMonitor: false,
      percentage: 3
    }
  }

  componentDidMount() {
    if(this.props.ticker){
      this.setState({isInMonitor: true});
      this.setState({percentage: this.props.ticker.percentage});
    }
    else {
      this.setState({isInMonitor: false});
    }
  }

  componentWillUnmount() {

  }

  handleTogglePriceAlert = (event) => {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    //const name = target.name;
    this.setState({isInMonitor: value});
    if(!value) {
      this.setState({percentage: 3});
    }
    this.props.onToggleMonitorTicker(value);
  }

  myFormat = (num) => {
    return num + '%';
  }

  handlePercentageChange = (number) => {
    //console.log(number);
    this.props.onChangeMonitorTickerPercentage(number);
  }

  render() {
    const { isInMonitor, percentage } = this.state;

    return (
      <SectionWrapper SectionTitle={""}>
        <div className="priceAlertWrapper" >
          <h5>PRICE ALERT</h5>
          { (isInMonitor)? (
            <NumericInput
              min={1}
              max={100}
              value={percentage}
              format={this.myFormat}
              onChange={this.handlePercentageChange}
            />
          ) : null }
          <label className="switch">
            <input
              name="isInMonitor"
              type="checkbox"
              className="tgl tgl-flat"
              checked={isInMonitor}
              onChange={this.handleTogglePriceAlert} />
            <div className="slider round"></div>
          </label>
        </div>
      </SectionWrapper>
    )
  }
}

const mapStateToProps = ({ monitorReducer }, ownProps) => {
  const { tickers } = monitorReducer;
  return { ticker: tickers[ownProps.instrument_id] };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onChangeMonitorTickerPercentage: (percentage) => {
    dispatch(changeMonitorTickerPercentage(ownProps.instrument_id, percentage));
  },
  onToggleMonitorTicker: (value) => {
    if(value) {
      dispatch(addMonitorTicker(ownProps.instrument_id, ownProps.symbol, 3, ownProps.last_price));
    }
    else {
      dispatch(deleteMonitorTicker(ownProps.instrument_id));
    }
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PriceAlert)
