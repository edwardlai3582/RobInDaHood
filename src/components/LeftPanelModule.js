import React, { Component, PropTypes } from 'react'
import '../styles/LeftPanelModule.css'
import arrow from '../styles/arrow.png';
import LeftPanelFolder from './LeftPanelFolder'

class LeftPanelModule extends Component {
  static propTypes = {
    quotes: PropTypes.object.isRequired,
    moduleOpen: PropTypes.bool.isRequired,
    toggleModule: PropTypes.func.isRequired,
    moduleName: PropTypes.string.isRequired,
    listsData: PropTypes.array.isRequired,
    selectedKey: PropTypes.string.isRequired,
    callback: PropTypes.func.isRequired
  }

  openClose = () => {
    this.props.toggleModule();
  }

  render() {
    let { quotes, listsData, callback, selectedKey, localLists, toggleLocallist, moduleOpen } =this.props;

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

    return (
      <div className="moduleWrapper" >
        <div onClick={this.openClose} className="moduleTitle">
          <img src={arrow}
               alt={moduleOpen? "open": "close"}
               className={moduleOpen? "moduleArrow open": "moduleArrow close"} />
          {this.props.moduleName}
        </div>
        {moduleOpen? data : null}
      </div>
    )
  }
}

export default LeftPanelModule
