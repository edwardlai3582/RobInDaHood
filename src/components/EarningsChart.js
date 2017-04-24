import React, { Component, PropTypes } from 'react'
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell } from 'recharts'
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

class EarningsChart extends Component {
  static propTypes = {
    data: PropTypes.array.isRequired
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
    this.setState({width: this.ew.offsetWidth });
    //console.log(this.state.width);
    this.ew.style.height = ( this.ew.offsetWidth > 500 )? "250px" : this.ew.offsetWidth/2+"px";
  }

  render() {
    const { data } = this.props;

    return (
      <div className="earningsWrapper" ref={(div) => { this.ew = div; }} >
        <ResponsiveContainer width="100%" height="100%" minHeight={1} debounce={3}>
          <ScatterChart data={data}  margin={{top: 10, right: 30, bottom: 40, left: 30}}>
            <XAxis dataKey={'xIndex'} stroke="white" axisLine={false} tickLine={false} domain={['dataMin', 'dataMax']} tick={<CustomizedXLabel displayData={data} />} />
            <YAxis dataKey={'eps'} stroke="white" axisLine={false} tickLine={false} tick={<CustomizedYLabel/>} />
            <Scatter isAnimationActive={false} name='A school' data={data} >
              {
                data.map((entry, index) => (
                  <Cell cursor="pointer" fill={ (entry.epsType === "actual")? "#40C9BD" : "#BDBDBD" } key={`cell-${index}`} />
                ))
              }
            </Scatter>
            <Tooltip cursor={{strokeDasharray: '3 3'}} wrapperStyle={{ borderRadius: "5px", textAlign:"center", width: 100, backgroundColor: 'white', color:'black', padding:'5px'}} content={<EarningsTooltip/>} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    )
  }
}

export default EarningsChart
