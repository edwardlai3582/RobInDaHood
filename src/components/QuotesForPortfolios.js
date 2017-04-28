import React, { Component, PropTypes } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts';
import WithoutTimeTooltip   from './WithoutTimeTooltip'
import WithTimeTooltip from './WithTimeTooltip'
import { dateDiffInDays } from '../utils'
import '../styles/Quotes.css'

class QuotesForPortfolios extends Component {
  static propTypes = {
    historicals: PropTypes.array.isRequired,
    previous_close: PropTypes.number.isRequired,
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
    const { selectedButtonName, previous_close, historicals } = this.props;
    let data = [];
    if(selectedButtonName === "1M"){
      historicals.forEach((eachData)=>{
        if(dateDiffInDays(eachData.begins_at) <= 31){
          data.push(eachData);
        }
      })
    }
    else if(selectedButtonName === "3M"){
      historicals.forEach((eachData)=>{
        if(dateDiffInDays(eachData.begins_at) <= 92){
          data.push(eachData);
        }
      })
    }
    else {
      data = historicals;
    }
    //console.log(data);
    //console.log(previous_close);
//console.log(data[data.length-1]);
    const strokeColor = (selectedButtonName==="1D")? (
      (previous_close < data[data.length-1].adjusted_close_equity)? '#00FF73' : '#F35A2B'
    ):(data[0].not_reg_close_equity < data[data.length-1].not_reg_close_equity)? '#00FF73' : '#F35A2B';
/*
<Line type="monotone" dataKey="not_reg_close_equity" stroke={strokeColor} dot={false} />
<Line type="monotone" dataKey="reg_close_equity" stroke={strokeColor} strokeWidth="3" dot={false} />
*/
    return (
      <div className="quotesWrapper" ref={(div) => { this.qw = div; }} >
        <ResponsiveContainer width="100%" height="100%" minHeight={1} debounce={3}>
          <LineChart data={data} margin={{ top: 15, right: 15, left: 0, bottom: 15 }}>

            <Line isAnimationActive={false} type="monotone" dataKey="adjusted_open_equity" stroke={strokeColor} strokeWidth="3" dot={false} />

            <XAxis dataKey="begins_at" tick={false} hide={true} />
            <YAxis interval="preserveStartEnd" domain={['auto', 'auto']} tick={{fill: 'white'}} axisLine={{stroke:"white"}} tickLine={{stroke:"white"}} />
            {selectedButtonName==="1D" || selectedButtonName==="1W"?
              <Tooltip wrapperStyle={{ borderRadius: "5px", textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px'}} content={<WithTimeTooltip/>}/>:
              <Tooltip wrapperStyle={{ borderRadius: "5px", textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px' }} content={<WithoutTimeTooltip/>}/>
            }
            {(selectedButtonName==="1D")? (
              <ReferenceLine y={Number(previous_close)} stroke="white" strokeDasharray="3 3" />
            ):null}
          </LineChart>
        </ResponsiveContainer>

      </div>
    )
  }
}

export default QuotesForPortfolios
