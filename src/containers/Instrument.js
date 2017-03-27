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
    this.state = { };
  }

  componentDidMount(){
    const { symbol, instrument, positions, dispatch } = this.props;
    dispatch(askFundamental(symbol));
    dispatch(askNews(symbol));
    dispatch(askHistoricalsQuotes(symbol));
    for(let i=0; i< positions.length; i++){
      if(positions[i].instrument === instrument){
        dispatch(askPosition(positions[i].url))
      }
    }
  }

  render() {
    const { symbol, instrument, type, fundamentals, instruments, newsAll, historicalsQuotes, eachPosition } = this.props
    let statisticsBlock = (fundamentals[symbol])? <Statistics fundamental={fundamentals[symbol]} /> : "Loading..."
    let newsBlock = (newsAll[symbol])? <News news={newsAll[symbol]} /> : "Loading..."
    let quotesBlock = (historicalsQuotes[symbol])? <Quotes quotes={historicalsQuotes[symbol]} /> : "Loading..."
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

        {quotesBlock}

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
