import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import PriceAlertTicker from './PriceAlertTicker'
import '../styles/PriceAlertPage.css'

class PriceAlertPage extends Component {

  static propTypes = {
    isCurrent: PropTypes.bool.isRequired
  }

  render() {
    const {
      isCurrent,
      tickers,
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
        <PriceAlertTicker instrument_id={tickers[key].instrument_id} />
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

export default connect(mapStateToProps, null)(PriceAlertPage)
