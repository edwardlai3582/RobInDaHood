import React, { Component, PropTypes } from 'react'
//import { connect } from 'react-redux'
//import { toggleWatchlistsModule,togglePositionsModule} from '../actions'

import '../styles/LeftPanelFolder.css'
import arrow from '../styles/arrow.png';
import LeftPanelItem from '../components/LeftPanelItem'
import { displayPercentage } from '../utils'

class LeftPanelFolder extends Component {
  static propTypes = {
    //watchlistsModuleOpen: PropTypes.bool.isRequired,
    //quotes: PropTypes.object.isRequired,
    //dispatch: PropTypes.func.isRequired
    moduleName: PropTypes.string.isRequired,
    moduleData: PropTypes.array.isRequired,
    selectedKey: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired,
    toggleLocallist: PropTypes.func.isRequired,
    quotes: PropTypes.object.isRequired
  }

  handleClick = (id) => {
    this.props.callback(this.props.moduleData[id]);
  }

  openClose = () => {
    this.props.toggleLocallist();
  }

  render() {
    let { quotes } =this.props;

    let data = this.props.moduleData.map((instrument, index) => {
      if(!quotes[instrument.symbol]) return null;

      let last_price = (quotes[instrument.symbol].last_extended_hours_trade_price)? quotes[instrument.symbol].last_extended_hours_trade_price : quotes[instrument.symbol].last_trade_price;
      let colorClassName = (Number(last_price) > Number(quotes[instrument.symbol].previous_close))?
        "greenUp" : (Number(last_price) === Number(quotes[instrument.symbol].previous_close))?
        "whiteNomove":"redDown";

      return(
        <LeftPanelItem
          key={instrument.symbol}
          symbol={instrument.symbol}
          id={index}
          onClick={()=>this.handleClick(index)}
          className={this.props.selectedKey === instrument.symbol? "moduleDiv selectedModuleDiv" : "moduleDiv"}
        >
          <div className={colorClassName}>
            { `$${Number(last_price).toFixed(2)}` }
          </div>
          <div className={colorClassName}>
            { displayPercentage(last_price, quotes[instrument.symbol].previous_close) }
          </div>
        </LeftPanelItem>
      );
    });

    /*
    let open = false;
    if(this.props.moduleName === "WATCHLIST"){
      open = this.props.watchlistsModuleOpen;
    }
    if(this.props.moduleName === "POSITIONS"){
      open = this.props.positionsModuleOpen;
    }
    */
    let open = this.props.open;

    return (
      <div className="moduleWrapper" >
        <div onClick={this.openClose} className="folderTitle">
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
/*
const mapStateToProps = state => {
  const { uiReducer, quotesReducer } = state
  const { watchlistsModuleOpen, positionsModuleOpen } = uiReducer || { watchlistsModuleOpen: false, positionsModuleOpen:false }
  const { quotes } = quotesReducer || { quotes: {} }

  return { watchlistsModuleOpen, positionsModuleOpen, quotes }
}

export default connect(mapStateToProps)(LeftPanelFolder)
*/
export default LeftPanelFolder
