import React, { Component } from 'react'
import { connect } from 'react-redux'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/BuyingPower.css'

class BuyingPower extends Component {

  getBuyingPower = () => {
    const { type, cash_balances, margin_balances } = this.props.account;
    if( type === "cash" ) {
      return Number(cash_balances.buying_power);
    }
    else {
      let temp = Number(margin_balances.overnight_buying_power) / Number(margin_balances.overnight_ratio);
      if( Number(margin_balances.margin_limit) === 0 ) {
        return temp;
      }
      else {
        return Math.min(temp, Number(margin_balances.unallocated_margin_cash) );
      }
    }
  }

  getGoldUsed = () => {
    const { type, margin_balances } = this.props.account;
    if( type === "cash" ) {
      return 0;
    }
    else {
      let margin_limit = Number(margin_balances.margin_limit);
      let unallocated_margin_cash = Number(margin_balances.unallocated_margin_cash);
      let isGold = ( margin_limit !== 0 )? true : false;
      if( isGold && ( margin_limit !== 0 ) ) {
        if( margin_limit > unallocated_margin_cash ) {
          return margin_limit - unallocated_margin_cash;
        }
        return 0;
      }
      return 0;
    }
  }

  getGoldWithheld = () => {
    const { type, margin_balances } = this.props.account;
    if( type === "cash" ) {
      return 0;
    }
    else {
      let margin_limit = Number(margin_balances.margin_limit);
      let cash_held_for_orders = Number(margin_balances.cash_held_for_orders);
      let isGold = ( margin_limit !== 0 )? true : false;
      if( isGold && ( margin_limit !== 0 ) ) {
        return Math.max( 0, ( margin_limit - this.getGoldUsed() - this.getBuyingPower() - cash_held_for_orders ) )
      }
      return 0;
    }
  }

  getRobinhoodGold = () => {
    const { type, margin_balances } = this.props.account;
    if( type === "cash" ) {
      return 0;
    }
    else {
      return Number(margin_balances.margin_limit);
    }
  }

  render() {
    if(!this.props.account) return null;
    if(this.props.account.type === "cash"){
      if(!this.props.account.cash_balances) return null;
    }
    else{
      if(!this.props.account.margin_balances) return null;
    }

    return (
      <SectionWrapper SectionTitle={"Buying Power"}>
        <div className="buyingPowerWrapper">
          <div className="each">
            <div>
              Robinhood Gold
            </div>
            <div>
            </div>
            <div>
              {`$${ this.getRobinhoodGold().toFixed(2) }`}
            </div>
          </div>
          <div className="each">
            <div>
              Gold used
            </div>
            <div>
              -
            </div>
            <div>
              {`$${ this.getGoldUsed().toFixed(2) }`}
            </div>
          </div>
          <div className="each">
            <div>
              Gold withheld
            </div>
            <div>
              -
            </div>
            <div>
              {`$${ this.getGoldWithheld().toFixed(2) }`}
            </div>
          </div>
          <div className="each">
            <div>
              Buying power
            </div>
            <div>
            </div>
            <div>
              {`$${ this.getBuyingPower().toFixed(2) }`}
            </div>
          </div>

        </div>
      </SectionWrapper>
    )
  }
}

const mapStateToProps = ({ accountReducer }, ownProps) => {
  const { account } = accountReducer;

  return {
    account
  };
}

export default connect(mapStateToProps, null)(BuyingPower)
