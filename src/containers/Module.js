import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleWatchlistsModule } from '../actions'
import '../styles/Module.css'
import arrow from '../styles/arrow.png';

class Module extends Component {
  static propTypes = {
    watchlistsModuleOpen: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick = event => {
    this.props.callback(this.props.moduleData[event.target.id]);
  }

  openClose = () => {
    this.props.dispatch(toggleWatchlistsModule());
  }

  render() {
    let data = this.props.moduleData.map((instrument, index) => {
      return(
        <div key={instrument.symbol}
             id={index}
             onClick={this.handleClick}
             className={this.props.selectedKey === instrument.symbol? "selectedModuleDiv" : ""}
        >
          {instrument.symbol}
        </div>
      );
    });

    let open = this.props.watchlistsModuleOpen;

    return (
      <div>
        <div onClick={this.openClose}>
          <img src={arrow}
               alt={open? "open": "close"}
               className={open? "moduleArrow open": "moduleArrow close"} />
          {this.props.moduleName}
        </div>
        {open? data : ""}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { uiReducer } = state
  const { watchlistsModuleOpen } = uiReducer || { watchlistsModuleOpen: false }

  return { watchlistsModuleOpen }
}

export default connect(mapStateToProps)(Module)
