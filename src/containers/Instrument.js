import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askFundamental,
         askNews,
         askPosition,
         askHistoricalsQuotes
       } from '../actions'
import Statistics from '../components/Statistics'
import News from '../components/News'
import Quotes from '../components/Quotes'
import Position from '../components/Position'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/Instrument.css'

class Instrument extends Component {
  static propTypes = {
    instrument: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    fundamentals: PropTypes.object.isRequired,
    newsAll: PropTypes.object.isRequired,
    historicalsQuotes: PropTypes.object.isRequired,
    positions: PropTypes.array.isRequired,
    eachPosition: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      quotes: {
        span: "day",
        interval: "5minute",
        bounds: "extended"
      }
    };
  }

  componentDidMount(){
    const { symbol, instrument, positions, dispatch } = this.props;
    const { span, interval, bounds } = this.state.quotes;
    dispatch(askFundamental(symbol));
    dispatch(askNews(symbol));
    dispatch(askHistoricalsQuotes(symbol, span, interval, bounds));
    for(let i=0; i< positions.length; i++){
      if(positions[i].instrument === instrument){
        dispatch(askPosition(positions[i].url))
      }
    }
  }

  changeHisQuotes = (span, interval, bounds)=>{
    this.setState({ quotes: { span: span, interval: interval, bounds: bounds } });
    this.props.dispatch(askHistoricalsQuotes(this.props.symbol, span, interval, bounds));
  }

  render() {
    const { symbol, instrument, type, fundamentals, instruments, newsAll, historicalsQuotes, eachPosition } = this.props
    const { span, interval, bounds } = this.state.quotes;
    let statisticsBlock = (fundamentals[symbol])? <Statistics fundamental={fundamentals[symbol]} /> : "Loading..."
    let newsBlock = (newsAll[symbol])? <News news={newsAll[symbol]} /> : "Loading..."
    let quotesBlock = (historicalsQuotes[symbol+span+interval+bounds])? <Quotes quotes={historicalsQuotes[symbol+span+interval+bounds]} /> : "Loading..."
    let descriptionBlock = (fundamentals[symbol])? fundamentals[symbol].description : "Loading..."
    let positionBlock = "";
    if(type === "position"){
      positionBlock = (eachPosition[instrument])? <Position position={eachPosition[instrument]} /> : "Loading..."
    }

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <h1 className="instrumentH1">{symbol}</h1>
        <h2 className="instrumentH2">{instruments[instrument].name}</h2>

        <SectionWrapper SectionTitle={""}>
          {quotesBlock}
          <button onClick={() => this.changeHisQuotes("day", "5minute", "extended")}>1D</button>
          <button onClick={() => this.changeHisQuotes("week", "10minute", "regular")}>1W</button>
          <button onClick={() => this.changeHisQuotes("year", "day", "regular")}>1M</button>
          <button onClick={() => this.changeHisQuotes("year", "day", "regular")}>3M</button>
          <button onClick={() => this.changeHisQuotes("year", "day", "regular")}>1Y</button>
          <button onClick={() => this.changeHisQuotes("5year", "week", "regular")}>5Y</button>
        </SectionWrapper>
        
        {(type === "position")?
          <SectionWrapper SectionTitle={"Position"}>
            {positionBlock}
          </SectionWrapper>
        :""}
        <SectionWrapper SectionTitle={"Recent News"}>
          {newsBlock}
        </SectionWrapper>
        <SectionWrapper SectionTitle={"Statistics"}>
          {statisticsBlock}
        </SectionWrapper>
        <SectionWrapper SectionTitle={"About"}>
          {descriptionBlock}
        </SectionWrapper>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { instrumentsReducer, fundamentalsReducer, newsReducer, quotesReducer, positionsReducer } = state
  const { instruments } = instrumentsReducer || { instruments: {}}
  const { fundamentals } = fundamentalsReducer || { fundamentals: {}}
  const { newsAll } = newsReducer || { newsAll: {}}
  const { historicalsQuotes } = quotesReducer || { historicalsQuotes: {}}
  const { positions, eachPosition } = positionsReducer || { positions:[], eachPosition: {}}
  return { instruments, fundamentals, newsAll, historicalsQuotes, positions, eachPosition }
}

export default connect(mapStateToProps)(Instrument)
