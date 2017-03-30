import React, { Component, PropTypes } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import WithoutTimeTooltip   from './WithoutTimeTooltip'
import WithTimeTooltip from './WithTimeTooltip'
import '../styles/Quotes.css'

class QuotesForPortfolios extends Component {
  static propTypes = {
    historicals: PropTypes.array.isRequired,
    selectedButtonName: PropTypes.string.isRequired
  }

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
    const { selectedButtonName, historicals } = this.props;
    let data = historicals;//this.props.quotes.historicals
    if(selectedButtonName === "1M"){
      data = data.slice(Math.max(data.length - 30))
    }
    if(selectedButtonName === "3M"){
      data = data.slice(Math.max(data.length - 90))
    }

    const strokeColor = (data[0].close_price < data[data.length-1].close_price)? '#00FF73' : '#F33900';

    return (
      <div className="quotesWrapper" ref={(div) => { this.qw = div; }} >
        <LineChart width={this.state.width}
                   height={this.state.width>500? 250 : this.state.width/2 }
                   data={data}
                   margin={{ top: 15, right: 15, left: 0, bottom: 15 }}>
          <Line type="monotone" dataKey="adjusted_close_equity" stroke={strokeColor} dot={false} />
          <XAxis dataKey="begins_at" tick={false} hide={true} />
          <YAxis interval="preserveStartEnd" domain={['auto', 'auto']} tick={{fill: 'white'}} axisLine={{stroke:"white"}} tickLine={{stroke:"white"}} />
          {selectedButtonName==="1D" || selectedButtonName==="1W"?
            <Tooltip wrapperStyle={{ textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px'}} content={<WithTimeTooltip/>}/>:
            <Tooltip wrapperStyle={{ textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px' }} content={<WithoutTimeTooltip/>}/>
          }

        </LineChart>


      </div>
    )
  }
}

export default QuotesForPortfolios
