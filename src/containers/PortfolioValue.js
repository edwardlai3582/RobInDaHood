import React, { Component } from 'react'
import { connect } from 'react-redux'
import { PieChart, Pie, Tooltip, Cell } from 'recharts';
import SectionWrapper from '../components/SectionWrapper'
import PieChartTooltip from '../components/PieChartTooltip'
import '../styles/PortfolioValue.css'

class PortfolioValue extends Component {

  constructor(props) {
    super(props);
    this.state = {
      chartActiveIndex: -1
    };
  }

  handleMouseOver = (data, index) => {
    this.setState({
      chartActiveIndex: index,
    });
  }

  handleMouseOut = (data, index) => {
    this.setState({
      chartActiveIndex: -1,
    });
  }

  render() {
    const { positions, quotes, instruments } = this.props;
    const { chartActiveIndex } = this.state;

    //check all needed data exist
    for(let i=0; i< positions.length; i++) {
      if(!instruments[positions[i].instrument]) {
        return null;
      }
      let symbol = instruments[positions[i].instrument].symbol;
      if(!quotes[symbol]) {
        return null;
      }
    }

    let chartData=[];

    positions.forEach((position, index)=>{
      let symbol = instruments[position.instrument].symbol;
      let quantity = Number(position.quantity);
      let last_trade_price = Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price );
      let equityValue = quantity*last_trade_price;

      chartData.push({
        name:  `$${symbol}`,
        quantity: quantity,
        last_trade_price: last_trade_price,
        value: equityValue,
        total: Number(this.props.market_value)
      });
    })

    chartData.push({
      name:  "Cash",
      value: Number(this.props.equity)-Number(this.props.market_value),
      total: Number(this.props.market_value)
    });

    return (
      <SectionWrapper SectionTitle={"Portfolio Value"}>
        <div className="PortfolioValueWrapper">
          <div className="pieChartWrapper">
            <PieChart width={300} height={300}>
              <Pie
                isAnimationActive={false}
                onMouseOver={this.handleMouseOver}
                onMouseOut={this.handleMouseOut}
                data={chartData}
                cx={150}
                cy={140}
                outerRadius={80}
                stroke="teal"
                label={({name})=>`${name}`}
              >
                {
                  chartData.map((entry, index) => (
                    <Cell cursor="pointer" fill={index === chartActiveIndex ? "#40C9BD" : "#CFF1EE" } key={`cell-${index}`}/>
                  ))
                }
              </Pie>
              <Tooltip
                wrapperStyle={{ textAlign:"center", backgroundColor: 'white', color:'black', padding:'5px'}}
                content={<PieChartTooltip/>}
              />
            </PieChart>
          </div>
          <div className="valueWrapper">
            <div>{`Stocks: $${Number(this.props.market_value).toFixed(2)}`}</div>
            <div>{`Cash: $${(Number(this.props.equity)-Number(this.props.market_value)).toFixed(2)}`}</div>
          </div>
        </div>
      </SectionWrapper>
    )
  }
}



const mapStateToProps = ({ positionsReducer, quotesReducer, instrumentsReducer }, ownProps) => {
  const { positions } = positionsReducer;
  const { quotes } = quotesReducer;
  const { instruments } = instrumentsReducer;

  return {
    positions, quotes, instruments
  };
}

export default connect(mapStateToProps, null)(PortfolioValue)
