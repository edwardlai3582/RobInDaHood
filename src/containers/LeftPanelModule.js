import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleWatchlistsModule,
         togglePositionsModule
       } from '../actions'
import '../styles/LeftPanelModule.css'
import arrow from '../styles/arrow.png';
import LeftPanelItem from '../components/LeftPanelItem'

const displayPercentage = (newString, oldString) => {
  let newNum = Number(newString);
  let oldNum = Number(oldString);
  let negPos = (newNum - oldNum > 0)? "+" : "";

  return  negPos + ((newNum - oldNum) / oldNum * 100).toFixed(2) + "%"
}

class LeftPanelModule extends Component {
  static propTypes = {
    watchlistsModuleOpen: PropTypes.bool.isRequired,
    quotes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  shouldComponentUpdate(nextProps, nextState) {
    return true;
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
    let { quotes } =this.props;

    let data = this.props.moduleData.map((instrument, index) => {
      return(
        <LeftPanelItem
          key={instrument.symbol}
          symbol={instrument.symbol}
          id={index}
          onClick={this.handleClick}
          className={this.props.selectedKey === instrument.symbol? "moduleDiv selectedModuleDiv" : "moduleDiv"}
        >

        {(quotes[instrument.symbol])?
          (quotes[instrument.symbol].last_extended_hours_trade_price)?(
            <div className={
                (Number(quotes[instrument.symbol].last_extended_hours_trade_price) > Number(quotes[instrument.symbol].previous_close))?
                  "greenUp"
                  :
                  (Number(quotes[instrument.symbol].last_extended_hours_trade_price) === Number(quotes[instrument.symbol].previous_close))?
                  "whiteNomove":"redDown"
            }>
              {displayPercentage(quotes[instrument.symbol].last_extended_hours_trade_price, quotes[instrument.symbol].previous_close)}
            </div>
          ):(
            <div className={
                (Number(quotes[instrument.symbol].last_trade_price) > Number(quotes[instrument.symbol].previous_close))?
                  "greenUp"
                  :
                  (Number(quotes[instrument.symbol].last_trade_price) === Number(quotes[instrument.symbol].previous_close))?
                  "whiteNomove":"redDown"
            }>
              {displayPercentage(quotes[instrument.symbol].last_trade_price, quotes[instrument.symbol].previous_close)}
            </div>

        ): null}

      </LeftPanelItem>
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
        <div onClick={this.openClose} className="moduleTitle">
          <img src={arrow}
               alt={open? "open": "close"}
               className={open? "moduleArrow open": "moduleArrow close"} />
          {this.props.moduleName}
        </div>
        {open? data : null}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { uiReducer, quotesReducer } = state
  const { watchlistsModuleOpen, positionsModuleOpen } = uiReducer || { watchlistsModuleOpen: false, positionsModuleOpen:false }
  const { quotes } = quotesReducer || { quotes: {} }

  return { watchlistsModuleOpen, positionsModuleOpen, quotes }
}

export default connect(mapStateToProps)(LeftPanelModule)
