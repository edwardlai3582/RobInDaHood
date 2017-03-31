import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import {
         askHistoricalsOrders, askCurrentOrder
       } from '../actions'
import SectionWrapper from '../components/SectionWrapper'
import OrderDetail from '../components/OrderDetail'
import { capFirst, printDate } from '../utils'
import '../styles/HistoryPage.css'

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

class HistoryPage extends Component {
  static propTypes = {
    historicalsOrders: PropTypes.array.isRequired,
    isAskingCurrentOrder: PropTypes.bool.isRequired,
    currentOrder: PropTypes.object.isRequired,
    currentOrderFailedREason: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false };
  }

  componentDidMount(){
    this.props.dispatch(askHistoricalsOrders());
  }

  openModalAndAskCurrentOrder = (orderId) => {
    this.props.dispatch(askCurrentOrder(orderId));
    this.setState({ modalIsOpen: true });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  afterOpenModal = () => {

  }

  render() {
    const { historicalsOrders, isAskingCurrentOrder, currentOrder, currentOrderFailedREason, instruments } = this.props
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
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">History</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={"Recent Orders"}>
          {recentOrders}
        </SectionWrapper>

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
/*


*/
const mapStateToProps = state => {
  const { ordersReducer, instrumentsReducer } = state
  const { historicalsOrders, isAskingCurrentOrder, currentOrder, currentOrderFailedREason } = ordersReducer || {
    historicalsOrders: [],
    isAskingCurrentOrder: false,
    currentOrder: {},
    currentOrderFailedREason: ''
   }
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { historicalsOrders, isAskingCurrentOrder, currentOrder, currentOrderFailedREason, instruments }
}

export default connect(mapStateToProps)(HistoryPage)
