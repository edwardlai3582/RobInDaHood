import React, { Component, PropTypes } from 'react'
import { capFirst, printDateOnly, formatAMPM } from '../utils'
import '../styles/OrderDetail.css'

class OrderDetail extends Component {
  static propTypes = {
    instrument: PropTypes.object.isRequired,
    currentOrder: PropTypes.object.isRequired,
    isAskingCurrentOrder: PropTypes.bool.isRequired,
    currentOrderFailedReason: PropTypes.string.isRequired,
    cancelCurrentOrderState: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { currentOrder, isAskingCurrentOrder, currentOrderFailedReason, cancelCurrentOrderState, instrument, cancelOrder } = this.props;

    if(isAskingCurrentOrder){
      return (<div className="orderDetailLoadingWrapper">Loading...</div>)
    }
    else if (currentOrderFailedReason !== ""){
      return (<div>{currentOrderFailedReason}</div>)
    }
    else{
      let timeInForce = ""
      if ( currentOrder.time_in_force === "gfd" ){ timeInForce = "Good for day" }
      else if ( currentOrder.time_in_force === "gtc" ){ timeInForce = "Good til canceled" }
      else if ( currentOrder.time_in_force === "ioc" ){ timeInForce = "Immediate or cancel" }
      else if ( currentOrder.time_in_force === "fok" ){ timeInForce = "Fill or kill" }
      else if ( currentOrder.time_in_force === "opg" ){ timeInForce = "On the Open" }
      else { timeInForce = currentOrder.time_in_force }

      let typeName = ""
      if(currentOrder.trigger === "immediate" && currentOrder.type === "market") {typeName="Market"}
      else if(currentOrder.trigger === "immediate" && currentOrder.type === "limit") {typeName="Limit"}
      else if(currentOrder.trigger === "stop" && currentOrder.type === "market") {typeName="Stop Loss"}
      else if(currentOrder.trigger === "stop" && currentOrder.type === "limit") {typeName="Stop Limit"}

      return (
        <div className="orderDetailWrapper" >
          <header>
            <h6>
                {`${typeName} ${capFirst(currentOrder.side)}`}
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
                  {(currentOrder.type==="market")?"Market":`$${Number(currentOrder.price).toFixed(2)}`}
                </div>
              </li>
              {(currentOrder.stop_price)?(
                <li>
                  <div className="orderDetailType" > Stop Price </div>
                  <div className="orderDetailValue">
                    {`$${Number(currentOrder.stop_price).toFixed(2)}`}
                  </div>
                </li>
              ):null}
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
                    :Number(currentOrder.cumulative_quantity)+" shares at $"+Number(currentOrder.average_price).toFixed(2)
                  }
                </div>
              </li>
              {(currentOrder.executions.length === 0)? "": (
                <li>
                  <div className="orderDetailType" > Settlement Date</div>
                  <div className="orderDetailValue">
                    { currentOrder.executions[currentOrder.executions.length-1].settlement_date }
                  </div>
                </li>
              )}
              <li>
                <div className="orderDetailType" > Total Notional</div>
                <div className="orderDetailValue">
                  {(currentOrder.state === "filled")? (
                    "$"+(Number(currentOrder.cumulative_quantity)*Number(currentOrder.average_price)).toFixed(2)
                  ): (
                    capFirst(currentOrder.state)
                  )}
                </div>
              </li>
            </ul>

            {(currentOrder.cancel)?
              (cancelCurrentOrderState === "ing")?
                (<div className="cancelOrderDiv">CANCELLING</div>)
                :
                (<button
                  className="cancelOrderButton"
                  onClick={()=>cancelOrder(currentOrder.cancel, currentOrder.id)}
                >
                  CANCEL ORDER
                </button>)
              : null
            }
          </div>
        </div>
      )
    }
  }
}

export default OrderDetail
