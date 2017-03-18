import React, { Component } from 'react'
import '../styles/Dashboard.css'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state={
      isResizing:false,
      lastDownX:0
    };
  }

  componentDidMount(){
    this.dbDrag.addEventListener('mousedown', (e) => {
      this.setState({
        isResizing : true,
        lastDownX : e.clientX
      });
    });

    document.addEventListener('mousemove',  (e) => {
      e.preventDefault();
      if (!this.state.isResizing){
        return;
      }

      if(e.clientX > 800 || e.clientX<100){
        return;
      }
      else {
        this.dbLeftPanel.style.width = e.clientX + "px";
        this.dbRightPanel.style.width = (this.dbContainer.getBoundingClientRect().width-e.clientX) + "px";
        this.dbRightPanel.style.left = e.clientX + "px";
      }
    });

    document.addEventListener('mouseup', (e) => {
        this.setState({isResizing : false});
    });
  }

  render() {
    const children = React.Children.toArray(this.props.children);
    const left = children[0];
    const right = children[1];

    return (
      <div className="dbContainer" ref={(div) => { this.dbContainer = div; }}>
        <div className="dbLeftPanel" ref={(div) => { this.dbLeftPanel = div; }}>
          {left}
        </div>
        <div className="dbRightPanel" ref={(div) => { this.dbRightPanel = div; }}>
            <div className="dbDrag" ref={(div) => { this.dbDrag = div; }}></div>
            {right}
        </div>
      </div>
    )
  }
}

export default Dashboard
