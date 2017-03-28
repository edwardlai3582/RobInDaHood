import React, { Component, PropTypes } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import WithoutTimeTooltip   from './WithoutTimeTooltip'
import WithTimeTooltip from './WithTimeTooltip'
import '../styles/Quotes.css'

class Quotes extends Component {
  static propTypes = {
    quotes: PropTypes.object.isRequired,
    selectedButtonName: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {height: 0, width: 0};
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
  }

  render() {
    const { selectedButtonName } = this.props;
    let data = this.props.quotes.historicals;
    if(selectedButtonName === "1M"){
      data = data.slice(Math.max(data.length - 30))
    }
    if(selectedButtonName === "3M"){
      data = data.slice(Math.max(data.length - 90))
    }

    return (
      <div className="quotesWrapper" ref={(div) => { this.qw = div; }} >
        <LineChart width={this.state.width}
                   height={this.state.width/2}
                   data={data}
                   margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
          <Line type="monotone" dataKey="close_price" stroke="#00FF73" dot={false} />
          <XAxis dataKey="begins_at" tick={false} hide={true} />
          <YAxis interval="preserveStartEnd" domain={['auto', 'auto']} tick={{fill: 'white'}} axisLine={{stroke:"white"}} tickLine={{stroke:"white"}} />
          {selectedButtonName==="1D" || selectedButtonName==="1W"?
            <Tooltip wrapperStyle={{ textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px'}} content={<WithTimeTooltip/>}/>:
            <Tooltip wrapperStyle={{ textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px' }} content={<WithoutTimeTooltip/>}/>
          }

        </LineChart>

        <div className="quotesButtonsWrapper">
          <button className={selectedButtonName==="1D"? "quotesButton selectedButton": "quotesButton"}
                  onClick={() => this.props.changeHisQuotes("day", "5minute", "trading", "1D")}>1D</button>
          <button className={selectedButtonName==="1W"? "quotesButton selectedButton": "quotesButton"}
                  onClick={() => this.props.changeHisQuotes("week", "10minute", "regular", "1W")}>1W</button>
          <button className={selectedButtonName==="1M"? "quotesButton selectedButton": "quotesButton"}
                  onClick={() => this.props.changeHisQuotes("year", "day", "regular", "1M")}>1M</button>
          <button className={selectedButtonName==="3M"? "quotesButton selectedButton": "quotesButton"}
                  onClick={() => this.props.changeHisQuotes("year", "day", "regular", "3M")}>3M</button>
          <button className={selectedButtonName==="1Y"? "quotesButton selectedButton": "quotesButton"}
                  onClick={() => this.props.changeHisQuotes("year", "day", "regular", "1Y")}>1Y</button>
          <button className={selectedButtonName==="5Y"? "quotesButton selectedButton": "quotesButton"}
                  onClick={() => this.props.changeHisQuotes("5year", "week", "regular", "5Y")}>5Y</button>
        </div>
      </div>
    )
  }
}

export default Quotes
