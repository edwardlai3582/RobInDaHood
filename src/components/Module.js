import React, { Component } from 'react'
import '../styles/Module.css'

class Module extends Component {
  constructor(props) {
    super(props);
    this.state={

    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount(){

  }

  handleClick = event => {
    this.props.callback(this.props.moduleData[event.target.id]);
  }

  render() {
    let data = this.props.moduleData.map((instrument, index) => {
      return(<div  key={index} id={index} onClick={this.handleClick}>{instrument.symbol}</div>)
    });

    return (
      <div>
        <div>{this.props.moduleName}</div>
        {data}
      </div>
    )
  }
}

export default Module
