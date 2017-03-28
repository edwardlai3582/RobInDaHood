import React, { Component } from 'react'
import '../styles/Dashboard.css'

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state={
      isResizing:false,
      lastDownX:0,
      rightWidth: ""
    };
  }

  mousedown = (e) => {
    this.setState({
      isResizing : true,
      lastDownX : e.clientX
    });
  }

  mousemove = (e) => {
    e.preventDefault();
    if (!this.state.isResizing){
      return;
    }

    if(e.clientX > 150 || e.clientX<110){
      return;
    }
    else {
      this.dbLeftPanel.style.width = e.clientX + "px";
      this.dbRightPanel.style.width = (this.dbContainer.getBoundingClientRect().width-e.clientX) + "px";
      this.dbRightPanel.style.left = e.clientX + "px";
      this.setState({rightWidth: this.dbRightPanel.getBoundingClientRect().width + "px"})
    }
  }

  mouseup = (e) => {
      this.setState({isResizing : false});
  }

  resize = (e) => {
    //document.body.clientWidth;
    //console.log(document.body.clientWidth);
    //console.log(this.dbContainer.getBoundingClientRect().width);
    //console.log(this.dbLeftPanel.getBoundingClientRect().width);
    this.setState({rightWidth: this.dbContainer.getBoundingClientRect().width - this.dbLeftPanel.getBoundingClientRect().width + "px"})
  }

  componentDidMount(){
    this.dbDrag.addEventListener('mousedown', this.mousedown);
    document.addEventListener('mousemove', this.mousemove);
    document.addEventListener('mouseup', this.mouseup);
    window.addEventListener('resize', this.resize);
  }

  componentWillUnmount(){
    this.dbDrag.removeEventListener('mousedown', this.mousedown);
    document.removeEventListener('mousemove', this.mousemove);
    document.removeEventListener('mouseup', this.mouseup);
    window.removeEventListener('resize', this.resize);
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
            {React.cloneElement(right, {width: this.state.rightWidth})}
        </div>
      </div>
    )
  }
}

export default Dashboard
