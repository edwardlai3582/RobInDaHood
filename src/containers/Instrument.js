import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askFundamental,
         askNews,
         askPosition
       } from '../actions'
import Statistics from '../components/Statistics'
import News from '../components/News'
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
    positions: PropTypes.array.isRequired,
    eachPosition: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount(){
    const { symbol, instrument, positions, dispatch } = this.props
    dispatch(askFundamental(symbol))
    dispatch(askNews(symbol))
    for(let i=0; i< positions.length; i++){
      if(positions[i].instrument === instrument){
        dispatch(askPosition(positions[i].url))
      }
    }
  }

  render() {
    const { symbol, instrument, type, fundamentals, instruments, newsAll, eachPosition } = this.props
    let statisticsBlock = (fundamentals[symbol])? <Statistics fundamental={fundamentals[symbol]} /> : "Loading..."
    let newsBlock = (newsAll[symbol])? <News News={newsAll[symbol]} /> : "Loading..."
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
  const { instrumentsReducer, fundamentalsReducer, newsReducer, positionsReducer } = state
  const { instruments } = instrumentsReducer || { instruments: {}}
  const { fundamentals } = fundamentalsReducer || { fundamentals: {}}
  const { newsAll } = newsReducer || { newsAll: {}}
  const { positions, eachPosition } = positionsReducer || { positions:[], eachPosition: {}}
  return { instruments, fundamentals, newsAll, positions, eachPosition }
}

export default connect(mapStateToProps)(Instrument)
