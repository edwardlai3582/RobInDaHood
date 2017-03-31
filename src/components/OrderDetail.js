import React, { Component, PropTypes } from 'react'
import { capFirst, printDateOnly, formatAMPM } from '../utils'
import '../styles/OrderDetail.css'

class OrderDetail extends Component {
  static propTypes = {
    instrument: PropTypes.object.isRequired,
    currentOrder: PropTypes.object.isRequired,
    isAskingCurrentOrder: PropTypes.bool.isRequired,
    currentOrderFailedREason: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    let { currentOrder, isAskingCurrentOrder, currentOrderFailedREason, instrument } = this.props;

    if(isAskingCurrentOrder){
      return (<div className="orderDetailLoadingWrapper">Loading...</div>)
    }
    else if (currentOrderFailedREason !== ""){
      return (<div>{currentOrderFailedREason}</div>)
    }
    else{
      let timeInForce = ""
      if ( currentOrder.time_in_force === "gfd" ){ timeInForce = "Good for day" }
      else if ( currentOrder.time_in_force === "gtc" ){ timeInForce = "Good til canceled" }
      else if ( currentOrder.time_in_force === "ioc" ){ timeInForce = "Immediate or cancel" }
      else if ( currentOrder.time_in_force === "fok" ){ timeInForce = "Fill or kill" }
      else if ( currentOrder.time_in_force === "opg" ){ timeInForce = "On the Open" }
      else { timeInForce = currentOrder.time_in_force }

      return (
        <div className="orderDetailWrapper" >
          <header>
            <h6>
              {capFirst(currentOrder.type)+" "+capFirst(currentOrder.side)}
            </h6>
            <h2>
              {instrument.name}
            </h2>
          </header>
          <div className="OrderDetailUlWrapper">
            <ul>
              <li>
                <div className="orderDetailType" > Order Status </div>
                <div className="orderDetailValue">
                  {capFirst(currentOrder.state)}
                </div>
              </li>
              <li>
                <div className="orderDetailType" > Time In Force </div>
                <div className="orderDetailValue">
                  {timeInForce}
                </div>
              </li>
              <li>
                <div className="orderDetailType" > Submitted </div>
                <div className="orderDetailValue">
                  {printDateOnly(currentOrder.created_at)}
                </div>
              </li>
              <li>
                <div className="orderDetailType" > Entered Price </div>
                <div className="orderDetailValue">
                  {capFirst(currentOrder.type)}
                </div>
              </li>
              <li>
                <div className="orderDetailType" > Entered Quantity </div>
                <div className="orderDetailValue">
                  {Number(currentOrder.quantity)}
                </div>
              </li>
              <li>
                <div className="orderDetailType" > Filled </div>
                <div className="orderDetailValue">
                  {(Number(currentOrder.cumulative_quantity) === 0)?
                    "N/A"
                    :printDateOnly(currentOrder.last_transaction_at)+" at "+formatAMPM(currentOrder.last_transaction_at)
                  }
                </div>
              </li>
              <li>
                <div className="orderDetailType" > Filled Quantity</div>
                <div className="orderDetailValue">
                  {(Number(currentOrder.cumulative_quantity) === 0)?
                    Number(currentOrder.cumulative_quantity)
                    :Number(currentOrder.cumulative_quantity)+" shares at $"+Number(currentOrder.average_price)
                  }
                </div>
              </li>
              {(currentOrder.executions.length === 0)? "": (
                <li>
                  <div className="orderDetailType" > Settlement Date</div>
                  <div className="orderDetailValue">
                    { printDateOnly(currentOrder.executions[currentOrder.executions.length-1].settlement_date) }
                  </div>
                </li>
              )}
              <li>
                <div className="orderDetailType" > Total Notional</div>
                <div className="orderDetailValue">
                  {(currentOrder.state === "cancelled")? "Canceled" : "$"+(Number(currentOrder.cumulative_quantity)*Number(currentOrder.average_price)).toFixed(2)}
                </div>
              </li>
            </ul>
          </div>
        </div>
      )
    }
  }
}

export default OrderDetail
