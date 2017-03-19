import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {  } from '../actions'
import '../styles/Instrument.css'

class Instrument extends Component {
  static propTypes = {
    url: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { };
  }

  componentDidMount(){
    console.log(this.props.url);
  }

  render() {

    return (
      <div className="instrumentWrapper">
        {this.props.instruments[this.props.url].name}<br/>
        {this.props.instruments[this.props.url].symbol}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { instrumentsReducer } = state
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { instruments }
}

export default connect(mapStateToProps)(Instrument)
