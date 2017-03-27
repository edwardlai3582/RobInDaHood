import React, { PropTypes } from 'react'
import '../styles/Statistics.css'

const carry = (numString) => {
  const numNum = Number(numString);
  let res = "";
  if(numNum > 1000000000){
    res = Math.round(numNum/1000000000 * 100) / 100 + "B"
  }
  else if(numNum > 1000000){
    res = Math.round(numNum/1000000 * 1000) / 1000 + "M"
  }
  else {
    res = Number(numNum);
  }

  return res;
}

const Statistics = ({ fundamental }) => {
  return (
    <div className="statisticsWrapper">
      <div className="statisticsDiv">
        <div className="statisticsNum">${ Number(fundamental.open) }</div>
        <div className="statisticsType">Open</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">
          { carry(fundamental.volume) }
        </div>
        <div className="statisticsType">Volume</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">${ Number(fundamental.high) }</div>
        <div className="statisticsType">Today's High</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">{ carry(fundamental.average_volume) }</div>
        <div className="statisticsType">Average Volume</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">${ Number(fundamental.low) }</div>
        <div className="statisticsType">Today's Low</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">{ carry(fundamental.market_cap) }</div>
        <div className="statisticsType">Market Cap</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">${ Number(fundamental.high_52_weeks) }</div>
        <div className="statisticsType">52 Wk High</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">{(fundamental.pe_ratio === null)?"N/A": Number(fundamental.pe_ratio) }</div>
        <div className="statisticsType">P/E Ratio</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">${ Number(fundamental.low_52_weeks) }</div>
        <div className="statisticsType">52 Wk Low</div>
      </div>
      <div className="statisticsDiv">
        <div className="statisticsNum">{ Number(fundamental.dividend_yield) }</div>
        <div className="statisticsType">Div/Yield</div>
      </div>
    </div>
  )
}


Statistics.propTypes = {
  fundamental: PropTypes.object.isRequired
}

export default Statistics
