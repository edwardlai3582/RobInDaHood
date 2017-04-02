import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askHistoricalsOrders, askCurrentOrder, cancelOrder
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
    cancelCurrentOrderState: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired
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

  cancelOrder = (cancelLink, orderId) => {
      this.props.dispatch(cancelOrder(cancelLink, orderId));
  }

  render() {
    const props = { ...this.props };

    //show null if not cuttent page
    if(!this.props.isCurrent){ return null; }

    const historicalsOrdersBlock = ( props.historicalsOrders )?
      <Orders {...props}
              forInstrument={ false }
              addMoreHistoricalsOrder={ this.addMoreHistoricalsOrder }
              askCurrentOrder={ this.askCurrentOrder }
              cancelOrder={ this.cancelOrder }
      />
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
  const { historicalsOrders, historicalsOrdersNextLink, isAskingCurrentOrder, currentOrder, currentOrderFailedREason, cancelCurrentOrderState  } = ordersReducer || {
    historicalsOrders: [],
    historicalsOrdersNextLink: "",
    isAskingCurrentOrder: false,
    currentOrder: {},
    currentOrderFailedREason: '',
    cancelCurrentOrderState: 'noteven'
   }
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { historicalsOrders, historicalsOrdersNextLink, isAskingCurrentOrder, currentOrder, currentOrderFailedREason, cancelCurrentOrderState, instruments }
}

export default connect(mapStateToProps)(HistoryPage)
