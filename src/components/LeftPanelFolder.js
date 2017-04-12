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
    quotes: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      folderIsOpen: false
    };
  }

  handleClick = (id) => {
    this.props.callback(this.props.moduleData[id]);
  }

  openClose = () => {
    this.setState({folderIsOpen: !this.state.folderIsOpen});
  }

  render() {
    let { quotes } =this.props;

    let data = this.props.moduleData.map((instrument, index) => {
      return(
        <LeftPanelItem
          key={instrument.symbol}
          symbol={instrument.symbol}
          id={index}
          onClick={()=>this.handleClick(index)}
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

    /*
    let open = false;
    if(this.props.moduleName === "WATCHLIST"){
      open = this.props.watchlistsModuleOpen;
    }
    if(this.props.moduleName === "POSITIONS"){
      open = this.props.positionsModuleOpen;
    }
    */
    let open = this.state.folderIsOpen;

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
