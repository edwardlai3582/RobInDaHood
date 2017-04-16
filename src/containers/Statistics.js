import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { askFundamental } from '../actions'
import SectionWrapper from '../components/SectionWrapper'
import StatisticsCard from '../components/StatisticsCard'
import '../styles/Statistics.css'
import { carry } from '../utils'

class Statistics extends Component  {
  static propTypes = {
    symbol: PropTypes.string.isRequired
  }

  componentDidMount() {
    this.props.onFetchFundamental();
  }

  render() {
    const fundamental = this.props.fundamental;
    if(!fundamental) return null;

    return (
      <SectionWrapper SectionTitle={"Statistics"}>
        <div className="statisticsWrapper">
          <StatisticsCard type={"Open"} num={`$ ${Number(fundamental.open)}`} />
          <StatisticsCard type={"Volume"} num={`${carry(fundamental.volume)}`} />
          <StatisticsCard type={`Today's High`} num={`$ ${Number(fundamental.high)}`} />
          <StatisticsCard type={"Average Volume"} num={`${carry(fundamental.average_volume)}`} />
          <StatisticsCard type={`Today's Low`} num={`$ ${Number(fundamental.low)}`} />
          <StatisticsCard type={"Market Cap"} num={`${carry(fundamental.market_cap)}`} />
          <StatisticsCard type={"52 Wk High"} num={`$ ${Number(fundamental.high_52_weeks)}`} />
          <StatisticsCard type={"P/E Ratio"} num={(fundamental.pe_ratio === null)? "N/A": `${Number(fundamental.pe_ratio)}` } />
          <StatisticsCard type={"52 Wk Low"} num={`$ ${Number(fundamental.low_52_weeks)}`} />
          <StatisticsCard type={"Div/Yield"} num={`${Number(fundamental.dividend_yield)}`} />
        </div>
      </SectionWrapper>
    )
  }
}

const mapStateToProps = ({ fundamentalsReducer }, ownProps) => {
  const { fundamentals } = fundamentalsReducer;
  return { fundamental: fundamentals[ownProps.symbol] };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchFundamental: () => {
    dispatch(askFundamental(ownProps.symbol));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Statistics)
