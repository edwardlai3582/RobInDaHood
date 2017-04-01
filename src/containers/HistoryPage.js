import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import {
         askHistoricalsOrders, askCurrentOrder
       } from '../actions'
import SectionWrapper from '../components/SectionWrapper'
import Orders from '../components/Orders'
import '../styles/HistoryPage.css'



class HistoryPage extends Component {
  static propTypes = {
    historicalsOrders: PropTypes.array.isRequired,
    historicalsOrdersNextLink: PropTypes.string.isRequired,
    isAskingCurrentOrder: PropTypes.bool.isRequired,
    currentOrder: PropTypes.object.isRequired,
    currentOrderFailedREason: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
  }

  componentDidMount(){
    this.props.dispatch(askHistoricalsOrders());
  }

  addMoreHistoricalsOrder = () => {
    this.props.dispatch(askHistoricalsOrders(this.props.historicalsOrdersNextLink))
  }

  askCurrentOrder = (orderId) => {
    this.props.dispatch(askCurrentOrder(orderId));
  }

  render() {
    const props = { ...this.props };
    const historicalsOrdersBlock = ( props.historicalsOrders )?
      <Orders {...props} addMoreHistoricalsOrder={this.addMoreHistoricalsOrder} askCurrentOrder={this.askCurrentOrder} />
      : "Loading...";

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">History</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={"Recent Orders"}>
          { historicalsOrdersBlock }
        </SectionWrapper>


      </div>
    )
  }
}

const mapStateToProps = state => {
  const { ordersReducer, instrumentsReducer } = state
  const { historicalsOrders, historicalsOrdersNextLink, isAskingCurrentOrder, currentOrder, currentOrderFailedREason } = ordersReducer || {
    historicalsOrders: [],
    historicalsOrdersNextLink: "",
    isAskingCurrentOrder: false,
    currentOrder: {},
    currentOrderFailedREason: ''
   }
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { historicalsOrders, historicalsOrdersNextLink, isAskingCurrentOrder, currentOrder, currentOrderFailedREason, instruments }
}

export default connect(mapStateToProps)(HistoryPage)
