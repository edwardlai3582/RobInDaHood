import React, { Component } from 'react'
import '../styles/Quotes.css'

class DummyQuotes extends Component {

  constructor(props) {
    super(props);
    this.state = {width: 0};
  }

  componentDidMount() {
    window.addEventListener('resize', this.resetDimensions);
    this.resetDimensions();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resetDimensions);
  }

  resetDimensions = () => {
    this.setState({width: this.qw.offsetWidth });
    this.qw.style.height = this.qw.offsetWidth>500? "250px" :  this.qw.offsetWidth/2+"px";
  }

  render() {
    return (
      <div className="quotesWrapper" ref={(div) => { this.qw = div; }} >

      </div>
    )
  }
}

export default DummyQuotes
