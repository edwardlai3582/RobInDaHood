import React, { Component, PropTypes } from 'react'
import Modal from 'react-modal'
import OrderDetail from './OrderDetail'
import { capFirst, printDate } from '../utils'
import '../styles/Orders.css'

const customStyles = {
  content : {
    top                   : '50px',
    backgroundColor       : 'black',
    textAlign             : 'center',
    padding               : '0px',
    border                : '0px solid black',
    overflowY             : 'auto'
  },
  overlay :{ zIndex: 999 }
};

class Orders extends Component {
  static propTypes = {
    historicalsOrders: PropTypes.array.isRequired,
    historicalsOrdersNextLink: PropTypes.string.isRequired,
    isAskingCurrentOrder: PropTypes.bool.isRequired,
    currentOrder: PropTypes.object.isRequired,
    currentOrderFailedReason: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    addMoreHistoricalsOrder: PropTypes.func.isRequired,
    askCurrentOrder: PropTypes.func.isRequired,
    cancelCurrentOrderState: PropTypes.string.isRequired,
    forInstrument: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  openModalAndAskCurrentOrder = (orderId) => {
    this.props.askCurrentOrder(orderId);
    this.setState({ modalIsOpen: true });
  }

  typeName = (trigger, type) => {
    let typeName = ""
    if(trigger === "immediate" && type === "market") {typeName="Market"}
    else if(trigger === "immediate" && type === "limit") {typeName="Limit"}
    else if(trigger === "stop" && type === "market") {typeName="Stop Loss"}
    else if(trigger === "stop" && type === "limit") {typeName="Stop Limit"}

    return typeName;
  }

  render() {
    const { historicalsOrders, historicalsOrdersNextLink,
            isAskingCurrentOrder, currentOrder, currentOrderFailedReason,
            forInstrument, instruments,
            addMoreHistoricalsOrder, cancelOrder, cancelCurrentOrderState
          } = this.props



    let recentOrders = historicalsOrders.map((order, i)=>{
      return (
        <div key={i} className="orderWrapper" onClick={()=> this.openModalAndAskCurrentOrder(order.id)} >
          <div>
            {((forInstrument)? "" : instruments[order.instrument].symbol+": ")+this.typeName(order.trigger, order.type)+" "+capFirst(order.side)}
            <div className="orderHisDate">
              {printDate(order.updated_at)}
            </div>
          </div>
          <div>
            {(order.state === "filled")?
              "$"+(Number(order.quantity) * Number(order.average_price)).toFixed(2) : capFirst(order.state)}
          </div>
        </div>
      )
    })

    return (
      <div className="OrdersWrapper" >
        <div className="recentOrdersWrapper">
          {recentOrders}
        </div>
        {(historicalsOrdersNextLink === "")? null:
          (<div className="orderMoreButtonWrapper">
            <button onClick={addMoreHistoricalsOrder} className="orderMoreButton">
              More
            </button>
          </div>)}
        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Order Modal"
        >
          <OrderDetail
            currentOrder={currentOrder}
            isAskingCurrentOrder={isAskingCurrentOrder}
            currentOrderFailedReason={currentOrderFailedReason}
            instrument={instruments[currentOrder.instrument] || {}}
            cancelOrder={cancelOrder}
            cancelCurrentOrderState={cancelCurrentOrderState}
          />
        </Modal>
      </div>
    )
  }
}

export default Orders
