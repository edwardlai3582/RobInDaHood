import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Tab, Tabs} from 'react-draggable-tab'
import { deleteTab, reorderTab, selectTab } from '../actions'
import Instrument from './Instrument'
import PortfolioPage from './PortfolioPage'
import HistoryPage from './HistoryPage'
import '../styles/Tabs.css'

const tabsClassNames = {
  tabWrapper: 'myWrapper',
  tabBar: 'myTabBar',
  tabBarAfter: 'myTabBarAfter',
  tab:      'myTab',
  tabTitle: 'myTabTitle',
  tabCloseIcon: 'tabCloseIcon',
  tabBefore: 'myTabBefore',
  tabAfter: 'myTabAfter'
};

const tabsStyles = {
  tabWrapper: {
    position: 'relative',
    top: '0px',
    height: 'auto',
    marginTop: '0px',
    backgroundColor: 'none'//'#076258'
  },
  tabBar: {paddingRight: "0"},
  tabTitle: {},
  tabTitleActive:{marginTop: '4px'},
  tabCloseIcon: {marginTop: '4px',opacity: '1',right: '5px', filter:'none', color:'rgb(170, 170, 170)', textShadow:'none'},
  tabCloseIconOnHover:{backgroundColor: 'none', color: 'white'},
  tab: {marginLeft: "2px", backgroundImage: '', backgroundColor: 'teal'},
  tabBefore: {display:'none'},//backgroundImage: 'linear-gradient(#343434, #222222)'
  tabAfter: {display:'none'},
  tabOnHover: {backgroundImage:''},
  tabActive: {backgroundImage: '', backgroundColor: '#40C9BD', color:'white'},
  tabBeforeActive: {display:'none'},//backgroundImage: 'linear-gradient(#454545, #333333)'
  tabAfterActive: {display:'none'},
  tabBarAfter: {height:'0px', borderBottom:'0px'}
};

class RightPanel extends Component {
  static propTypes = {
    tabs: PropTypes.object.isRequired,
    keys: PropTypes.array.isRequired,
    selectedKey: PropTypes.string.isRequired,
    width: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  handleTabSelect = (e, key, currentTabs) => {
    this.props.dispatch(selectTab(key));
  }

  handleTabClose = (e, key, currentTabs) =>  {
    let newKeys = currentTabs.map( tab => tab.key );
    this.props.dispatch(deleteTab(key, newKeys));
  }

  handleTabPositionChange = (e, key, currentTabs) => {
    let newKeys = currentTabs.map( tab => tab.key );
    this.props.dispatch(reorderTab(newKeys));
  }

  render() {
    const { tabs, keys, selectedKey } = this.props;
    let newTabs = keys.map((key)=>{
      let isCurrent = (selectedKey === tabs[key].key)

      if(tabs[key].type === "watchlist" || tabs[key].type === "position"){
        return (<Tab key={tabs[key].key} title={"$"+tabs[key].title}><Instrument isCurrent={isCurrent} symbol={tabs[key].title} instrument={tabs[key].instrument} type={tabs[key].type} /></Tab>);
      }
      else if (tabs[key].type === "portfolio") {
        return (<Tab key={tabs[key].key} title={tabs[key].title}><PortfolioPage isCurrent={isCurrent} /></Tab>);
      }
      else if (tabs[key].type === "history") {
        return (<Tab key={tabs[key].key} title={tabs[key].title}><HistoryPage isCurrent={isCurrent} /></Tab>);
      }
      else{
        return (<Tab key={tabs[key].key} title={tabs[key].title}><div>NOTHING HERE</div></Tab>);
      }
    });

    return (
      <Tabs
        selectedTab={selectedKey}
        onTabSelect={this.handleTabSelect}
        onTabClose={this.handleTabClose}
        onTabPositionChange={this.handleTabPositionChange}
        tabsClassNames={tabsClassNames}
        tabsStyles={Object.assign(tabsStyles, {tabWrapper:{width: this.props.width}})}
        tabs={newTabs}
      />
    )
  }
}

const mapStateToProps = state => {
  const { tabsReducer } = state
  const { tabs, keys, selectedKey } = tabsReducer || { tabs: {}, keys:[], selectedKey:"noTAbKey" }

  return { tabs, keys, selectedKey }
}

export default connect(mapStateToProps)(RightPanel)

/*
shortCutKeys={
  {
    'close': ['alt+command+w', 'alt+ctrl+w'],
    'create': ['alt+command+t', 'alt+ctrl+t'],
    'moveRight': ['alt+command+tab', 'alt+ctrl+tab'],
    'moveLeft': ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
  }
}
*/
