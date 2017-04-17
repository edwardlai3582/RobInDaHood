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
    currentOrderFailedReason: PropTypes.string.isRequired,
    cancelCurrentOrderState: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired
  }

  componentDidMount(){
    this.props.onFetchHistoricalsOrders();
  }

  componentWillReceiveProps(nextProps){
    if(nextProps.isCurrent && !this.props.isCurrent){
      this.props.onFetchHistoricalsOrders();
    }
  }

  addMoreHistoricalsOrder = () => {
    this.props.onFetchHistoricalsOrders(this.props.historicalsOrdersNextLink);
  }

  askCurrentOrder = (orderId) => {
    this.props.onFetchCurrentOrder(orderId);
  }

  cancelOrder = (cancelLink, orderId) => {
      this.props.onCancelOrder(cancelLink, orderId);
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

const mapStateToProps = ({ ordersReducer, instrumentsReducer  }) => {
  const {
    historicalsOrders,
    historicalsOrdersNextLink,
    isAskingCurrentOrder,
    currentOrder,
    currentOrderFailedReason,
    cancelCurrentOrderState
  } = ordersReducer;

  const { instruments } = instrumentsReducer;

  return {
    historicalsOrders,
    historicalsOrdersNextLink,
    isAskingCurrentOrder,
    currentOrder,
    currentOrderFailedReason,
    cancelCurrentOrderState,
    instruments
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchHistoricalsOrders: (link) => {
    if(!link) {
      dispatch(askHistoricalsOrders());
    }
    else{
      dispatch(askHistoricalsOrders(link));
    }
  },
  onFetchCurrentOrder: (orderId) => {
    dispatch(askCurrentOrder(orderId))
  },
  onCancelOrder: (cancelLink, orderId) => {
    dispatch(cancelOrder(cancelLink, orderId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(HistoryPage)
