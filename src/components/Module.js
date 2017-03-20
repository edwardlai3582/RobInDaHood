import React, { Component } from 'react'
import '../styles/Module.css'
import arrow from '../styles/arrow.png';

class Module extends Component {
  constructor(props) {
    super(props);
    this.state={
      open: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){

  }

  handleClick = event => {
    this.props.callback(this.props.moduleData[event.target.id]);
  }

  openClose = () => {
    this.setState({open: !this.state.open});
  }

  render() {
    let data = this.props.moduleData.map((instrument, index) => {
      return(
        <div key={instrument.symbol}
             id={index}
             onClick={this.handleClick}
             className={this.props.selectedKey === instrument.symbol? "selectedModuleDiv" : ""}
        >
          {instrument.symbol}
        </div>
      );
    });

    return (
      <div>
        <div onClick={this.openClose}>
          <img src={arrow} className={this.state.open? "moduleArrow open": "moduleArrow close"} />
          {this.props.moduleName}
        </div>
        {this.state.open? data : ""}
      </div>
    )
  }
}

export default Module
