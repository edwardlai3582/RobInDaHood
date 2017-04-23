import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell } from 'recharts'
import SectionWrapper from '../components/SectionWrapper'
import { askEarnings } from '../actions'
import '../styles/Earnings.css'

class CustomizedXLabel extends Component {
  render() {
    let { x, y, displayData, payload } = this.props;
    let index = -1;
    for(let i=0; i<displayData.length; i++ ){
      if(displayData[i].xIndex === payload.value){
        index = i;
        break;
      }
    }

    if(index === -1) { return null; }

    return (
    	<g transform={`translate(${x},${y + 20})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="white">
          <tspan x="0" dy="1em">{displayData[index].quarter}</tspan>
          <tspan x="0" dy="1em">{displayData[index].year}</tspan>
        </text>
      </g>
    );
  }
}

class CustomizedYLabel extends Component {
  render() {
    let { x, y, payload } = this.props;

    return (
    	<g transform={`translate(${x - 50},${y})`}>
        <text x={0} y={0} dy={16} textAnchor="middle" fill="white">
          <tspan x="0" dy="1em">{payload.value}</tspan>
        </text>
      </g>
    );
  }
}

class EarningsTooltip extends Component {
  render() {
    const { active } = this.props;

    if (active) {
      const { payload } = this.props;
      const eps = payload[0].payload;

      return (
        <div>
          <div style={{color: (eps.epsType === "actual")? "#40C9BD" : "#BDBDBD" }}>{`${eps.quarter} ${eps.year}`}</div>
          <div style={{color: (eps.epsType === "actual")? "#40C9BD" : "#BDBDBD" }}>{`${eps.epsType.toUpperCase()} EPS`}</div>
          <div style={{marginTop:"5px"}}>{eps.eps}</div>
        </div>
      );
    }

    return null;
  }
}


class Earnings extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {width: 0};
  }

  componentDidMount() {
    this.props.onFetchEarnings();
    window.addEventListener('resize', this.setEarningChartWidth);
    this.setEarningChartWidth();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.setEarningChartWidth);
  }

  setEarningChartWidth = () => {
    if(this.ew){
      this.setState({width: this.ew.offsetWidth });
      this.ew.style.height = ( this.ew.offsetWidth > 500 )? "250px" : this.ew.offsetWidth/2+"px";
    }
  }

  render() {
    const earnings = this.props.earnings;

    let displayData = [];
    if(earnings){
      for(let i = earnings.length-2; i > 0; i--) {
        if( i === earnings.length-7 ){ break; }
        let tempEstimate = {}
        let tempActual = {}

        tempEstimate.xIndex = 5 - (earnings.length-2 - i) ;
        tempEstimate.year = earnings[i].year;
        tempEstimate.quarter = `Q${earnings[i].quarter}`;
        tempEstimate.eps = ( earnings[i].eps.estimate )? Math.round(Number(earnings[i].eps.estimate) * 100) / 100 : null;
        tempEstimate.epsType = "estimate";

        tempActual.xIndex = 5 - (earnings.length-2 - i) ;
        tempActual.year = earnings[i].year;
        tempActual.quarter = `Q${earnings[i].quarter}`;
        tempActual.eps = ( earnings[i].eps.actual )? Math.round(Number(earnings[i].eps.actual) * 100) / 100 : null;
        tempActual.epsType = "actual";

        displayData.push(tempEstimate);
        displayData.push(tempActual);
      }
    }

    return (
      <SectionWrapper SectionTitle={"Earnings"}>
        <div className="earningsWrapper" ref={(div) => { this.ew = div; }} >
          <ResponsiveContainer width="100%" height="100%" minHeight={1} debounce={3}>
            <ScatterChart data={displayData}  margin={{top: 10, right: 30, bottom: 40, left: 30}}>
            	<XAxis dataKey={'xIndex'} stroke="white" axisLine={false} tickLine={false} domain={['dataMin', 'dataMax']} tick={<CustomizedXLabel displayData={displayData} />} />
            	<YAxis dataKey={'eps'} stroke="white" axisLine={false} tickLine={false} tick={<CustomizedYLabel/>} />
            	<Scatter name='A school' data={displayData} >
                {
                  displayData.map((entry, index) => (
                    <Cell cursor="pointer" fill={ (entry.epsType === "actual")? "#40C9BD" : "#BDBDBD" } key={`cell-${index}`} />
                  ))
                }
              </Scatter>
            	<Tooltip cursor={{strokeDasharray: '3 3'}} wrapperStyle={{ borderRadius: "5px", textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px'}} content={<EarningsTooltip/>} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        {
          (earnings)? (
            <div className="epsTextWrapper">
              <div>
                <h6 style={{color: "#BDBDBD"}} > Expected EPS &bull; </h6>
                <div>
                  {(earnings[earnings.length-2].eps.estimate)?
                    `${Number(earnings[earnings.length-2].eps.estimate) < 0 ? "-" : ""}US$${Math.abs(Number(earnings[earnings.length-2].eps.estimate)).toFixed(2)}`
                  : "N/A"}
                </div>
              </div>
              <div>
                <h6 style={{color: "#40C9BD"}} > Actual EPS &bull; </h6>
                <div>
                  {(earnings[earnings.length-2].eps.actual)?
                    `${Number(earnings[earnings.length-2].eps.actual) < 0 ? "-" : ""}US$${Math.abs(Number(earnings[earnings.length-2].eps.actual)).toFixed(2)}`
                  : (earnings[earnings.length-2].report)? (
                      <div>
                        <div>
                          {`${(earnings[earnings.length-2].report.verified)? "Available" : "Expected"} on ${earnings[earnings.length-2].report.date},`}
                        </div>
                        <div>
                          {(earnings[earnings.length-2].report.timing === "am")? "Pre-market" : "After-hours"}
                        </div>
                      </div>
                  ) : null }
                </div>
              </div>
            </div>
          ) : null
        }
      </SectionWrapper>
    )
  }
}

const mapStateToProps = ({ earningsReducer }, ownProps) => {
  const { earningsAll } = earningsReducer;
  return { earnings: earningsAll[ownProps.symbol] };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchEarnings: () => {
    dispatch(askEarnings(ownProps.symbol));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Earnings)
