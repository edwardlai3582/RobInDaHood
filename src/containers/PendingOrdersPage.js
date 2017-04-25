import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { askCurrentOrder, cancelOrder } from '../actions'
import SectionWrapper from '../components/SectionWrapper'
import Orders from '../components/Orders'
import { askHistoricalsOrders } from '../actions'
import '../styles/HistoryPage.css'

class PendingOrdersPage extends Component {
  static propTypes = {
    isAskingCurrentOrder: PropTypes.bool.isRequired,
    currentOrder: PropTypes.object.isRequired,
    currentOrderFailedReason: PropTypes.string.isRequired,
    cancelCurrentOrderState: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired
  }

  componentDidMount() {
    this.props.onFetchHistoricalsOrders();
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

    const pendingOrdersArray = Object.keys(props.pendingOrders).map( orderID => props.pendingOrders[orderID] );
    //sort by date
    pendingOrdersArray.sort((a, b) => {
      a = new Date(a.created_at);
      b = new Date(b.created_at);
      return a>b ? -1 : a<b ? 1 : 0;
    });

    const pendingOrdersBlock = ( props.pendingOrders )?
      <Orders {...props}
              historicalsOrders={pendingOrdersArray}
              historicalsOrdersNextLink={""}
              forInstrument={ false }
              addMoreHistoricalsOrder={ () => console.log("this is for pending orders") }
              askCurrentOrder={ this.askCurrentOrder }
              cancelOrder={ this.cancelOrder }
      />
      : "Loading...";

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">Pending Orders</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={""}>
          { pendingOrdersBlock }
        </SectionWrapper>

      </div>
    )
  }
}

const mapStateToProps = ({ ordersReducer, instrumentsReducer  }) => {
  const {
    pendingOrders,
    isAskingCurrentOrder,
    currentOrder,
    currentOrderFailedReason,
    cancelCurrentOrderState
  } = ordersReducer;

  const { instruments } = instrumentsReducer;

  return {
    pendingOrders,
    isAskingCurrentOrder,
    currentOrder,
    currentOrderFailedReason,
    cancelCurrentOrderState,
    instruments
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchHistoricalsOrders: () => {
    dispatch(askHistoricalsOrders());
  },
  onFetchCurrentOrder: (orderId) => {
    dispatch(askCurrentOrder(orderId))
  },
  onCancelOrder: (cancelLink, orderId) => {
    dispatch(cancelOrder(cancelLink, orderId));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PendingOrdersPage)
