import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askFundamental
       } from '../actions'
import Statistics from '../components/Statistics'
import '../styles/Instrument.css'

class Instrument extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    fundamentals: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount(){
    this.props.dispatch(askFundamental(this.props.symbol))
  }

  render() {
    const { symbol, url, fundamentals, instruments } = this.props
    let statisticsBlock = (fundamentals[symbol])? <Statistics fundamental={fundamentals[symbol]} /> : "Loading..."

    return (
      <div className="instrumentWrapper">
        <h1 className="instrumentH1">{symbol}</h1>
        <h2>{instruments[url].name}</h2>
        {statisticsBlock}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { instrumentsReducer, fundamentalsReducer } = state
  const { instruments } = instrumentsReducer || { instruments: {}}
  const { fundamentals } = fundamentalsReducer || { fundamentals: {}}
  return { instruments, fundamentals }
}

export default connect(mapStateToProps)(Instrument)
