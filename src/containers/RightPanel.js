import React, { Component } from 'react'
import { connect } from 'react-redux'
import {Tab, Tabs} from 'react-draggable-tab'

class RightPanel extends Component {
  constructor(props) {
    super(props);
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
  }
  handleTabSelect(e, key, currentTabs) {
    console.log('handleTabSelect key:', key);
    this.setState({selectedTab: key, tabs: currentTabs});
  }

  handleTabClose(e, key, currentTabs) {
    console.log('tabClosed key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabPositionChange(e, key, currentTabs) {
    console.log('tabPositionChanged key:', key);
    this.setState({tabs: currentTabs});
  }

  handleTabAddButtonClick(e, currentTabs) {
    // key must be unique
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
  }
  render() {
    return (
      <Tabs
        selectedTab={this.state.selectedTab ? this.state.selectedTab : "tab1"}
        onTabSelect={this.handleTabSelect.bind(this)}
        onTabClose={this.handleTabClose.bind(this)}
        onTabAddButtonClick={this.handleTabAddButtonClick.bind(this)}
        onTabPositionChange={this.handleTabPositionChange.bind(this)}
        tabs={this.state.tabs}
      />
    )
  }
}

export default connect(null)(RightPanel)

/*
tabsClassNames={tabsClassNames}
tabsStyles={tabsStyles}
shortCutKeys={
  {
    'close': ['alt+command+w', 'alt+ctrl+w'],
    'create': ['alt+command+t', 'alt+ctrl+t'],
    'moveRight': ['alt+command+tab', 'alt+ctrl+tab'],
    'moveLeft': ['shift+alt+command+tab', 'shift+alt+ctrl+tab']
  }
}
*/
