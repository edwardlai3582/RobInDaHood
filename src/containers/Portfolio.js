import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askFundamental,
         askNews,
         askPosition,
         askHistoricalsQuotes, askQuotes,
         addToWatchlists, removeFromWatchlists
       } from '../actions'
import Statistics from '../components/Statistics'
import News from '../components/News'
import Quotes from '../components/Quotes'
import DummyQuotes from '../components/DummyQuotes'
import Position from '../components/Position'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/Portfolio.css'

class Portfolio extends Component {
  static propTypes = {

  }

  constructor(props) {
    super(props);
    this.state = {
      quotes: {
        span: "day",
        interval: "5minute",
        bounds: "trading",
        selectedButtonName: "1D"
      }
    };
  }

  componentDidMount(){

  }

  changeHisQuotes = (span, interval, bounds, selectedButtonName)=>{
    //this.setState({ quotes: { span: span, interval: interval, bounds: bounds, selectedButtonName: selectedButtonName } });
    //this.props.dispatch(askHistoricalsQuotes(this.props.symbol, span, interval, bounds));
  }


  render() {

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">Portfolio</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={"About"}>
          {"This is Portfolio page"}
        </SectionWrapper>
      </div>
    )
  }
}
/*
<SectionWrapper SectionTitle={""}>
  {quotesBlock}
  <div className="quotesButtonsWrapper">
    <button className={selectedButtonName==="1D"? "quotesButton selectedButton": "quotesButton"}
            onClick={() => this.changeHisQuotes("day", "5minute", "trading", "1D")}>1D</button>
    <button className={selectedButtonName==="1W"? "quotesButton selectedButton": "quotesButton"}
            onClick={() => this.changeHisQuotes("week", "10minute", "regular", "1W")}>1W</button>
    <button className={selectedButtonName==="1M"? "quotesButton selectedButton": "quotesButton"}
            onClick={() => this.changeHisQuotes("year", "day", "regular", "1M")}>1M</button>
    <button className={selectedButtonName==="3M"? "quotesButton selectedButton": "quotesButton"}
            onClick={() => this.changeHisQuotes("year", "day", "regular", "3M")}>3M</button>
    <button className={selectedButtonName==="1Y"? "quotesButton selectedButton": "quotesButton"}
            onClick={() => this.changeHisQuotes("year", "day", "regular", "1Y")}>1Y</button>
    <button className={selectedButtonName==="5Y"? "quotesButton selectedButton": "quotesButton"}
            onClick={() => this.changeHisQuotes("5year", "week", "regular", "5Y")}>5Y</button>
  </div>
</SectionWrapper>
*/
const mapStateToProps = state => {
  const { instrumentsReducer, fundamentalsReducer, newsReducer, quotesReducer, positionsReducer, watchlistsReducer } = state
  const { watchlists } = watchlistsReducer || { watchlists: []}
  const { instruments } = instrumentsReducer || { instruments: {}}
  const { fundamentals } = fundamentalsReducer || { fundamentals: {}}
  const { newsAll } = newsReducer || { newsAll: {}}
  const { historicalsQuotes, quotes } = quotesReducer || { historicalsQuotes: {}, quotes:{}}
  const { positions, eachPosition } = positionsReducer || { positions:[], eachPosition: {}}
  return { instruments, fundamentals, newsAll, historicalsQuotes, quotes, positions, eachPosition, watchlists }
}

export default connect(mapStateToProps)(Portfolio)
