import React, { Component, PropTypes } from 'react'
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
      let offsetRight = this.dbContainer.getBoundingClientRect().width - (e.clientX - this.dbContainer.offsetLeft);
      if(offsetRight > 1000 || offsetRight<400){
        return;
      }
      else {
        this.dbLeftPanel.style.right = offsetRight + "px";
        this.dbRightPanel.style.width = offsetRight + "px";
      }
    });

    document.addEventListener('mouseup', (e) => {
        this.setState({isResizing : false});
    });
  }

  render() {
    return (
      <div className="dbContainer" ref={(div) => { this.dbContainer = div; }}>
        <div className="dbLeftPanel" ref={(div) => { this.dbLeftPanel = div; }}>
          left content!
        </div>
        <div className="dbRightPanel" ref={(div) => { this.dbRightPanel = div; }}>
            <div className="dbDrag" ref={(div) => { this.dbDrag = div; }}></div>
            <div>
              right content!
            </div>
        </div>
      </div>
    )
  }
}



export default Dashboard
