import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {Tab, Tabs} from 'react-draggable-tab'
import { deleteTab, reorderTab } from '../actions'
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
    top: '5px',
    height: 'auto',
    marginTop: '0px'
  },
  tabBar: {},
  tabTitle: {},
  tabCloseIcon: {},
  tab: {backgroundImage: 'linear-gradient(#343434, #222222)'},
  tabBefore: {backgroundImage: 'linear-gradient(#343434, #222222)'},
  tabAfter: {backgroundImage: 'linear-gradient(#343434, #222222)'},
  tabActive: {backgroundImage: 'linear-gradient(#454545, #333333)'},
  tabBeforeActive: {backgroundImage: 'linear-gradient(#454545, #333333)'},
  tabAfterActive: {backgroundImage: 'linear-gradient(#454545, #333333)'},
  tabBarAfter: {height:'0px'}
};

class RightPanel extends Component {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    selectedTab: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      tabs:[]
    }
    /*
    this.state = {
      tabs:[
        (<Tab key={'tab0'} title={'tab 1'}>
          <div>
            <h1>This tab can close</h1>
          </div>
        </Tab>),
        (<Tab key={'tab1'} title={'Tab 2'} >
          <div>
            <h1>This is tab3</h1>
          </div>
        </Tab>),
        (<Tab key={'tab2'} title={'3ndTab Too long Toooooooooooooooooo long'}>
          <div>
            <pre>Lorem ipsum dolor sit amet, consectetur adipisicing elit,
            </pre>
          </div>
        </Tab>)
      ]
    };
    */
  }
  handleTabSelect = (e, key, currentTabs) => {
    console.log('handleTabSelect key:', key);
    //this.props.dispatch(reorderTab(key, currentTabs));
    //this.setState({selectedTab: key, tabs: currentTabs});
  }

  handleTabClose = (e, key, currentTabs) =>  {
    console.log('tabClosed key:', key);
    //this.props.dispatch(deleteTab(currentTabs));
    //this.setState({tabs: currentTabs});
  }

  handleTabPositionChange = (e, key, currentTabs) => {
    console.log('tabPositionChanged key:', key);
    //this.props.dispatch(reorderTab(key, currentTabs));
    //this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick(e, currentTabs) {
    // key must be unique
    /*
    const key = 'newTab_' + Date.now();
    let newTab = (<Tab key={key} title='untitled'>
                    <div>
                      <h1>New Empty Tab</h1>
                    </div>
                  </Tab>);
    let newTabs = currentTabs.concat([newTab]);

    this.setState({
      tabs: newTabs,
      selectedTab: key
    });
    */
  }

  render() {
    let newTabs = this.props.tabs.map((tab)=>{
      return (<Tab key={tab.key} title={tab.title}><div>{tab.title}</div></Tab>)
    });

    return (
      <Tabs
        selectedTab={this.props.selectedTab ? this.props.selectedTab : "tab1"}
        onTabSelect={this.handleTabSelect.bind(this)}
        onTabClose={this.handleTabClose.bind(this)}
        onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
        onTabPositionChange={this.handleTabPositionChange.bind(this)}
        tabsClassNames={tabsClassNames}
        tabsStyles={tabsStyles}
        tabs={newTabs}
      />
    )
  }
}

const mapStateToProps = state => {
  const { tabsReducer } = state
  const { tabs, selectedTab } = tabsReducer || { tabs: [], selectedTab:"" }

  return { tabs, selectedTab }
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
