import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'

import SectionWrapper from '../components/SectionWrapper'
import EarningsChart from '../components/EarningsChart'
import { askEarnings } from '../actions'
import '../styles/Earnings.css'

class Earnings extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired
  }


  componentDidMount() {
    this.props.onFetchEarnings();
  }

  render() {
    const earnings = this.props.earnings;

    if(!earnings || earnings.length === 0) return null;

    let localLast = (earnings.length > 2)? earnings.length-2 : earnings.length-1;

    let displayData = [];
    for(let i = localLast; i > 0; i--) {
      if( i === earnings.length-7 ){ break; }
      let tempEstimate = {}
      let tempActual = {}

      tempEstimate.xIndex = 5 - (localLast - i) ;
      tempEstimate.year = earnings[i].year;
      tempEstimate.quarter = `Q${earnings[i].quarter}`;
      tempEstimate.eps = ( earnings[i].eps.estimate )? Math.round(Number(earnings[i].eps.estimate) * 100) / 100 : null;
      tempEstimate.epsType = "estimate";

      tempActual.xIndex = 5 - (localLast - i) ;
      tempActual.year = earnings[i].year;
      tempActual.quarter = `Q${earnings[i].quarter}`;
      tempActual.eps = ( earnings[i].eps.actual )? Math.round(Number(earnings[i].eps.actual) * 100) / 100 : null;
      tempActual.epsType = "actual";

      displayData.push(tempEstimate);
      displayData.push(tempActual);
    }

    return (
      <SectionWrapper SectionTitle={"Earnings"}>
        <EarningsChart data={displayData} />

        <div className="epsTextWrapper">
          <div>
            <h6 style={{color: "#BDBDBD"}} > Expected EPS &bull; </h6>
            <div>
              {(earnings[localLast].eps.estimate)?
                `${Number(earnings[localLast].eps.estimate) < 0 ? "-" : ""}US$${Math.abs(Number(earnings[localLast].eps.estimate)).toFixed(2)}`
              : "N/A"}
            </div>
          </div>
          <div>
            <h6 style={{color: "#40C9BD"}} > Actual EPS &bull; </h6>
            <div>
              {(earnings[localLast].eps.actual)?
                `${Number(earnings[localLast].eps.actual) < 0 ? "-" : ""}US$${Math.abs(Number(earnings[localLast].eps.actual)).toFixed(2)}`
              : (earnings[localLast].report)? (
                  <div>
                    <div>
                      {`${(earnings[localLast].report.verified)? "Available" : "Expected"} on ${earnings[localLast].report.date},`}
                    </div>
                    <div>
                      {(earnings[localLast].report.timing === "am")? "Pre-market" : "After-hours"}
                    </div>
                  </div>
              ) : null }
            </div>
          </div>
        </div>
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
