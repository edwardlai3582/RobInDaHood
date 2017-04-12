import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { toggleWatchlistsModule,
         togglePositionsModule,
       } from '../actions'
import '../styles/LeftPanelModule.css'
import arrow from '../styles/arrow.png';
import LeftPanelFolder from '../components/LeftPanelFolder'

class LeftPanelModule extends Component {
  static propTypes = {
    watchlistsModuleOpen: PropTypes.bool.isRequired,
    positionsModuleOpen: PropTypes.bool.isRequired,
    quotes: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,

    moduleName: PropTypes.string.isRequired,
    listsData: PropTypes.array.isRequired,
    selectedKey: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
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
    let { quotes, listsData, callback, selectedKey, localLists, toggleLocallist } =this.props;

    let data = listsData.map((listData,index) => {
        return (<LeftPanelFolder
          key={index}
          index={index}
          open={localLists[index].open}
          moduleName={`${localLists[index].name}`}
          moduleData={listData}
          selectedKey={selectedKey}
          callback={callback}
          quotes={quotes}
          toggleLocallist={()=>toggleLocallist(index)}
        />)
    })

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
