import React, { Component, PropTypes } from 'react'
import SectionWrapper from './SectionWrapper'
import '../styles/Margin.css'


class Margin extends Component {
  static propTypes = {
    ownInstrument: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
  }

  getOvernightBuyingPowerForInstrument = () => {
    const overnight_ratio = Number(this.props.account.margin_balances.overnight_ratio);
    const overnight_buying_power = Number(this.props.account.margin_balances.overnight_buying_power);
    const margin_initial_ratio = Number(this.props.ownInstrument.margin_initial_ratio);

    return overnight_buying_power / Math.max(overnight_ratio, margin_initial_ratio);
  }

  isInstant = () => {
    const margin_limit = Number(this.props.account.margin_balances.margin_limit);
    return (margin_limit === 0);
  }

  getDayTradeBuyingPowerForInstrument = () => {
    const day_trade_ratio_from_account = Number(this.props.account.margin_balances.day_trade_ratio);
    const day_trade_ratio_from_instrument = Number(this.props.ownInstrument.day_trade_ratio);
    const day_trade_buying_power = Number(this.props.account.margin_balances.day_trade_buying_power);

    return day_trade_buying_power / Math.max(day_trade_ratio_from_account, day_trade_ratio_from_instrument);
  }

  getBuyingPowerForInstrument = () => {
    const { type, cash_balances, margin_balances } = this.props.account;
    if( type === "cash" ) {
      return Number(cash_balances.buying_power);
    }
    else {
      let temp2 = this.getOvernightBuyingPowerForInstrument();
      let temp1 = temp2;
      if(this.isInstant()) {
        temp1 = Math.min(temp2, this.getDayTradeBuyingPowerForInstrument());
      }
      if( Number(margin_balances.margin_limit) === 0  ) {
        return temp1;
      }
      return Math.min(temp1, Number(margin_balances.unallocated_margin_cash));
    }
  }

  render() {
    const { ownInstrument } = this.props;

    return (
      <SectionWrapper SectionTitle={"Margin Requirements"}>
        <div className="marginEach">
          <div className="marginEachTitle"> Initial Requirement </div>
          <div className="marginEachValue"> {`${Number(ownInstrument.margin_initial_ratio)*100}%`} </div>
        </div>
        <div className="marginEach">
          <div className="marginEachTitle"> Maintenance Requirement </div>
          <div className="marginEachValue"> {`${Number(ownInstrument.maintenance_ratio)*100}%`} </div>
        </div>
        <div className="marginEach">
          <div className="marginEachTitle"> {`Buying Power for ${ownInstrument.symbol}`}  </div>
          <div className="marginEachValue"> {`$${this.getBuyingPowerForInstrument().toFixed(2)}`} </div>
        </div>
      </SectionWrapper>
    )
  }
}


export default Margin
