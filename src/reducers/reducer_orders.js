import * as actions from '../actions';

const ordersReducer = (state = {
  historicalsOrders: [],
  historicalsOrdersNextLink: "",
  isAskingCurrentOrder: false,
  currentOrder: {},
  currentOrderFailedReason: "",
  /////////CancelCurrentOrderState: noteven, ing, failed, succeeded
  cancelCurrentOrderState: "noteven",
  cancelFailedReason: "",
  placingOrder: false,
  orderPlacedResult: "",
  pendingOrders: [],
  /*
    symbol:{nextLink:"", orders:[]}
  */
  ownHistoricalsOrders: {}
}, action) => {
  switch (action.type) {
    case actions.ORDERS_REMOVE_FROM_PENDING_ORDERS:
      return {
        ...state,
        pendingOrders: state.pendingOrders.filter((orderID) => orderID !== action.orderID)
      }
    case actions.ORDERS_PUSH_TO_PENDING_ORDERS:
      return {
        ...state,
        pendingOrders: [...state.pendingOrders, action.orderID]
      }
    case actions.ORDERS_RESET_PLACE_ORDER_RELATED:
      return {
        ...state,
        placingOrder: false,
        orderPlacedResult: ""
      }
    case actions.ORDERS_PLACING_ORDER:
      return {
        ...state,
        placingOrder: true,
        orderPlacedResult: ""
      }
    case actions.ORDERS_ORDER_PLACED:
      return {
        ...state,
        placingOrder: false,
        orderPlacedResult: "succeeded"
      }
    case actions.ORDERS_ORDER_DIDNT_PLACE:
      return {
        ...state,
        placingOrder: false,
        orderPlacedResult: action.reason
      }
    case actions.ORDERS_CANCELLING_CURRENT_ORDER:
      return {
        ...state,
        cancelCurrentOrderState: "ing",
        cancelFailedReason: ""
      }
    case actions.ORDERS_CANCEL_CURRENT_ORDER_FAILED:
      return {
        ...state,
        cancelCurrentOrderState: "failed",
        cancelFailedReason: action.reason
      }
    case actions.ORDERS_CANCEL_CURRENT_ORDER_SUCCEEDED:
      return {
        ...state,
        cancelCurrentOrderState: "succeeded"
      }
    case actions.ORDERS_DELETE_HIS__ORDERS_NEXT_LINK:
      return {
        ...state,
        historicalsOrdersNextLink: ""
      }
    case actions.ORDERS_REFILL_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: action.orders,
        historicalsOrdersNextLink: (action.next)? action.next : ""
      }
    case actions.ORDERS_ADD_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: state.historicalsOrders.concat(action.orders),
        historicalsOrdersNextLink: (action.next)? action.next : ""
      }
    case actions.ORDERS_DELETE_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: [],
        historicalsOrdersNextLink: ""
      }
    case actions.ORDERS_ASKING_CURRENT_ORDER:
      return {
        ...state,
        isAskingCurrentOrder: true,
        currentOrder: {},
        currentOrderFailedReason: '',
        cancelCurrentOrderState: "noteven",
        cancelFailedReason: ""
      }
    case actions.ORDERS_ASK_CURRENT_ORDER_FAILED:
      return {
        ...state,
        isAskingCurrentOrder: false,
        currentOrder: {},
        currentOrderFailedReason: action.reason
      }
    case actions.ORDERS_ADD_CURRENT_ORDER:
      return {
        ...state,
        isAskingCurrentOrder: false,
        currentOrder: action.order,
        currentOrderFailedReason: ''
      }
    case actions.ORDERS_REFILL_OWN_HIS_ORDERS:
      let tempObj = {};
      tempObj[action.symbol] = {};
      tempObj[action.symbol].orders = action.orders;
      tempObj[action.symbol].nextLink = action.nextLink;
      return {
        ...state,
        ownHistoricalsOrders: Object.assign({}, state.ownHistoricalsOrders, tempObj)
      }
    case actions.ORDERS_ADD_OWN_HIS_ORDERS:
      tempObj = {};
      tempObj[action.symbol] = {};
      tempObj[action.symbol].orders = state.ownHistoricalsOrders[action.symbol].orders.concat(action.orders);
      tempObj[action.symbol].nextLink = action.nextLink;
      return {
        ...state,
        ownHistoricalsOrders: Object.assign({}, state.ownHistoricalsOrders, tempObj)
      }
    default:
      return state
  }
}

export default ordersReducer
