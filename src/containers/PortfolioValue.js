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

  fillColor = (entry, index) => {
    if( entry.name === "Gold used" && index === this.state.chartActiveIndex ) {
      return "gold";
    }
    else if( entry.name === "Gold used" ) {
      return "#FCFC83";
    }
    else if(index === this.state.chartActiveIndex) {
      return "#40C9BD";
    }
    else {
      return "#CFF1EE";
    }
  }

  render() {
    const { positions, quotes, instruments, market_value, equity, account } = this.props;
    if(!account) return null;

    let goldUsed = false;
    let cashName = "Cash";
    let cashValue = 0;
    if( account.type === "cash") {
      cashName = "Cash";
      cashValue = account.cash_balances.buying_power;
    }
    else {
      let { margin_limit, unallocated_margin_cash, } = account.margin_balances;
      goldUsed = ( Number(margin_limit) > Number(unallocated_margin_cash) )? true : false;

      if( Number(margin_limit) === 0 ) {
        cashName = "Cash";
        cashValue = unallocated_margin_cash;
      }
      else if( goldUsed ) {
        cashName = "Gold used";
        cashValue = Number(margin_limit) - Number(unallocated_margin_cash);
      }
      else {
        cashName = "Cash";
        cashValue = Number(unallocated_margin_cash) - Number(margin_limit);
      }
    }


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
      // if quantity = 0 dont show
      if( Number(position.quantity) === 0 ) {
        return;
      }

      let symbol = instruments[position.instrument].symbol;
      let quantity = Number(position.quantity);
      let last_trade_price = Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price );
      let equityValue = quantity*last_trade_price;

      chartData.push({
        name:  `$${symbol}`,
        quantity: quantity,
        last_trade_price: last_trade_price,
        value: equityValue,
        total: equity
      });
    })

    chartData.push({
      name:  cashName,
      value: cashValue
    });

    return (
      <SectionWrapper SectionTitle={"Account"}>
        <div>
          <div>
            Total market value
          </div>
          <div>
            {`$${ Number(market_value).toFixed(2) }`}
          </div>
        </div>
        <div className="PortfolioValueWrapper">
          <div className="pieChartWrapper">
            <PieChart width={350} height={300}>
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
                    <Cell cursor="pointer" fill={ this.fillColor(entry, index) } key={`cell-${index}`}/>
                  ))
                }
              </Pie>
              <Tooltip
                wrapperStyle={{ borderRadius: "5px", textAlign:"center", backgroundColor: 'white', color:'black', padding:'5px'}}
                content={<PieChartTooltip/>}
              />
            </PieChart>
          </div>

          {(goldUsed)? (
            <div className="valueWrapper">
              <div>{`Portfolio: $${equity}`}</div>
              <div>{`${cashName}: $${Number(cashValue).toFixed(2)}`}</div>
            </div>
          ) : (
            <div className="valueWrapper">
              <div>{`Stocks: $${equity}`}</div>
              <div>{`Cash: $${Number(cashValue).toFixed(2)}`}</div>
            </div>
          )}

        </div>
      </SectionWrapper>
    )
  }
}



const mapStateToProps = ({ positionsReducer, quotesReducer, instrumentsReducer, accountReducer }, ownProps) => {
  const { positions } = positionsReducer;
  const { quotes } = quotesReducer;
  const { instruments } = instrumentsReducer;
  const { account } = accountReducer;

  return {
    positions, quotes, instruments, account
  };
}

export default connect(mapStateToProps, null)(PortfolioValue)
