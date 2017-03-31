import React, { Component, PropTypes } from 'react'
import { capFirst, printDate } from '../utils'
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
      return (<div>Loading...</div>)
    }
    else if (currentOrderFailedREason !== ""){
      return (<div>{currentOrderFailedREason}</div>)
    }
    else{
      return (
        <div>
          <header style={{backgroundColor: "teal"}} >
            <h6>
              {capFirst(currentOrder.type)+" "+capFirst(currentOrder.side)}
            </h6>
            <h2>
              {instrument.name}
            </h2>
          </header>
          <section style={{backgroundColor: "white", color: "black"}} >
            <div>{currentOrder.state}</div>
            <div>{currentOrder.time_in_force}</div>
            <div>{printDate(currentOrder.updated_at)}</div>
            <div>{currentOrder.type}</div>
            <div>{currentOrder.quantity}</div>
          </section>
        </div>
      )
    }
  }
}

export default OrderDetail
