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
    currentOrderFailedREason: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    addMoreHistoricalsOrder: PropTypes.func.isRequired,
    askCurrentOrder: PropTypes.func.isRequired
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

  render() {
    const { historicalsOrders, historicalsOrdersNextLink, isAskingCurrentOrder, currentOrder, currentOrderFailedREason, instruments, addMoreHistoricalsOrder } = this.props

    let recentOrders = historicalsOrders.map((order, i)=>{
      return (
        <div key={i} className="orderWrapper" onClick={()=> this.openModalAndAskCurrentOrder(order.id)} >
          <div>
            {instruments[order.instrument].symbol+": "+capFirst(order.type)+" "+capFirst(order.side)}
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
          <OrderDetail currentOrder={currentOrder}
                       isAskingCurrentOrder={isAskingCurrentOrder}
                       currentOrderFailedREason={currentOrderFailedREason}
                       instrument={instruments[currentOrder.instrument] || {}}
          />
        </Modal>
      </div>
    )
  }
}

export default Orders
