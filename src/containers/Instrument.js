import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askFundamental,
         askNews
       } from '../actions'
import Statistics from '../components/Statistics'
import News from '../components/News'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/Instrument.css'

class Instrument extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    fundamentals: PropTypes.object.isRequired,
    newsAll: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount(){
    this.props.dispatch(askFundamental(this.props.symbol))
    this.props.dispatch(askNews(this.props.symbol))
  }

  render() {
    const { symbol, url, fundamentals, instruments, newsAll } = this.props
    let statisticsBlock = (fundamentals[symbol])? <Statistics fundamental={fundamentals[symbol]} /> : "Loading..."
    let newsBlock = (newsAll[symbol])? <News News={newsAll[symbol]} /> : "Loading..."
    let descriptionBlock = (fundamentals[symbol])? fundamentals[symbol].description : "Loading..."

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <h1 className="instrumentH1">{symbol}</h1>
        <h2 className="instrumentH2">{instruments[url].name}</h2>
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
  const { instrumentsReducer, fundamentalsReducer, newsReducer } = state
  const { instruments } = instrumentsReducer || { instruments: {}}
  const { fundamentals } = fundamentalsReducer || { fundamentals: {}}
  const { newsAll } = newsReducer || { newsAll: {}}
  return { instruments, fundamentals, newsAll }
}

export default connect(mapStateToProps)(Instrument)
