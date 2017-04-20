import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
  deleteMonitorTicker,
  changeMonitorTickerPercentage,
  changeMonitorTickerLastPrice
} from '../actions'
import PriceAlertTicker from '../components/PriceAlertTicker'
import '../styles/PriceAlertPage.css'

class PriceAlertPage extends Component {

  static propTypes = {
    isCurrent: PropTypes.bool.isRequired
  }

  render() {
    const {
      isCurrent,
      tickers,
      onChangeMonitorTickerPercentage,
      onChangeMonitorTickerLastPrice,
      onDeleteMonitorTicker
    } = this.props;
    //show null if not current page
    if(!isCurrent){ return null; }

    let allTickers = Object.keys(tickers).sort( (a, b) => {
      var nameA = tickers[a].symbol.toUpperCase();
      var nameB = tickers[b].symbol.toUpperCase();
      if (nameA < nameB) { return -1; }
      if (nameA > nameB) { return 1; }
      return 0;
    }).map((key) => (
      <li key={key} >
        <PriceAlertTicker
          ticker={tickers[key]}
          onChangeMonitorTickerPercentage={onChangeMonitorTickerPercentage}
          onChangeMonitorTickerLastPrice={onChangeMonitorTickerLastPrice}
          onDeleteMonitorTicker={onDeleteMonitorTicker}
        />
      </li>
    ));

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">Price Alert</h1>
          </div>
        </header>
        <ul className="priceAlertUl" >
          { allTickers }
        </ul>
      </div>
    )
  }
}

const mapStateToProps = ({ monitorReducer }) => {
  const { tickers } = monitorReducer;
  return { tickers };
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

export default connect(mapStateToProps, mapDispatchToProps)(PriceAlertPage)
