import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleWatchlistsModule,
         togglePositionsModule
       } from '../actions'
import '../styles/LeftPanelModule.css'
import arrow from '../styles/arrow.png';
import LeftPanelItem from '../components/LeftPanelItem'

class LeftPanelModule extends Component {
  static propTypes = {
    watchlistsModuleOpen: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  handleClick = event => {
    this.props.callback(this.props.moduleData[event.target.id]);
  }

  openClose = () => {
    if(this.props.moduleName === "WATCHLIST"){
      this.props.dispatch(toggleWatchlistsModule());
    }
    if(this.props.moduleName === "POSITIONS"){
      this.props.dispatch(togglePositionsModule());
    }
  }

  render() {
    let data = this.props.moduleData.map((instrument, index) => {
      return(
        <LeftPanelItem
          key={instrument.symbol}
          symbol={instrument.symbol}
          id={index}
          onClick={this.handleClick}
          className={this.props.selectedKey === instrument.symbol? "moduleDiv selectedModuleDiv" : "moduleDiv"}
        />
      );
    });

    let open = false;
    if(this.props.moduleName === "WATCHLIST"){
      open = this.props.watchlistsModuleOpen;
    }
    if(this.props.moduleName === "POSITIONS"){
      open = this.props.positionsModuleOpen;
    }

    return (
      <div className="moduleWrapper" >
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
  const { watchlistsModuleOpen, positionsModuleOpen } = uiReducer || { watchlistsModuleOpen: false, positionsModuleOpen:false }

  return { watchlistsModuleOpen, positionsModuleOpen }
}

export default connect(mapStateToProps)(LeftPanelModule)
