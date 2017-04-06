import React, { Component, PropTypes } from 'react'
import '../styles/HistoryPriceDisplay.css'
import { displayPercentage, printDateOnly, dateDiffInDays } from '../utils'

class HistoryPriceDisplay extends Component {
  static propTypes = {
    historicals: PropTypes.array.isRequired,
    previous_close: PropTypes.string.isRequired,
    selectedButtonName: PropTypes.string.isRequired
  }

  render() {
    const {
      selectedButtonName, historicals,
      previous_close, last_trade_price, updated_at, last_extended_hours_trade_price
     } = this.props;

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

    let displayBlock = null;
    if(selectedButtonName === "1D"){
      displayBlock = (
        <div>
          <p>
            <span className={
                (Number(last_trade_price).toFixed(2) > Number(previous_close))?
                  "greenUp"
                  :
                  (Number(last_trade_price).toFixed(2) === Number(previous_close))?
                  "whiteNomove":"redDown"
            }>
              { (Number(last_trade_price) - Number(previous_close) >0)? '+' : (Number(last_trade_price) - Number(previous_close) < 0)? '-' : ''}
              { 'US$' }
              { Math.abs((Number(last_trade_price) - Number(previous_close)).toFixed(2)) }
              { ' (' }
              { displayPercentage(last_trade_price, previous_close) }
              { ')' }
            </span>
            <span style={{fontWeight: 'bold'}}>
              { ` ${printDateOnly(updated_at)}` }
            </span>
          </p>
          { (last_extended_hours_trade_price)? (
              <p>
                { (Number(last_extended_hours_trade_price) - Number(last_trade_price) >0)? '+' : (Number(last_extended_hours_trade_price) - Number(last_trade_price) < 0)? '-' : ''}
                { 'US$' }
                { Math.abs((Number(last_extended_hours_trade_price) - Number(last_trade_price)).toFixed(2)) }
                { ' (' }
                { displayPercentage(Number(last_extended_hours_trade_price)-Number(last_trade_price)+Number(previous_close), previous_close) }
                { `) After Hours` }
              </p>
            ): null
          }
        </div>
      );
    }
    else if(data[0]) {
      let firstDayPrice = data[0].close_price;
      let lastDayPrice = data[data.length-1].close_price;

      displayBlock = (
        <p>
          <span className={
              (Number(lastDayPrice).toFixed(2) > Number(firstDayPrice))?
                "greenUp"
                :
                (Number(lastDayPrice).toFixed(2) === Number(firstDayPrice))?
                "whiteNomove":"redDown"
          }>
            { (Number(lastDayPrice) - Number(firstDayPrice) >0)? '+' : (Number(lastDayPrice) - Number(firstDayPrice) < 0)? '-' : ''}
            { 'US$' }
            { Math.abs((Number(lastDayPrice) - Number(firstDayPrice)).toFixed(2)) }
            { ' (' }
            { displayPercentage(lastDayPrice, firstDayPrice) }
            { ')' }
          </span>
          <span style={{fontWeight: 'bold'}}>
            { ` Past ${
              (selectedButtonName === "1W")? "Week" :
              (selectedButtonName === "1M")? "Month" :
              (selectedButtonName === "3M")? "3M" :
              (selectedButtonName === "1Y")? "Year" :
              "5 Years"
            }` }
          </span>
        </p>
      );
    }



    return (
      <div>
        { displayBlock }
      </div>
    )
  }
}

export default HistoryPriceDisplay
/*

*/
