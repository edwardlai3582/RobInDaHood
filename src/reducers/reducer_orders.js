import {
  REFILL_HIS_ORDERS, ADD_HIS_ORDERS, DELETE_HIS_ORDERS, DELETE_HIS__ORDERS_NEXT_LINK,
  ASKING_CURRENT_ORDER, ASK_CURRENT_ORDER_FAILED, ADD_CURRENT_ORDER,
  CANCELLING_CURRENT_ORDER, CANCEL_CURRENT_ORDER_FAILED, CANCEL_CURRENT_ORDER_SUCCEEDED
} from '../actions'

const ordersReducer = (state = {
  historicalsOrders: [],
  historicalsOrdersNextLink: "",
  isAskingCurrentOrder: false,
  currentOrder: {},
  currentOrderFailedReason: "",
  //CancelCurrentOrderState: noteven, ing, failed, succeeded
  cancelCurrentOrderState: "noteven",
  cancelFailedReason: ""
}, action) => {
  switch (action.type) {
    case CANCELLING_CURRENT_ORDER:
      return {
        ...state,
        cancelCurrentOrderState: "ing",
        cancelFailedReason: ""
      }
    case CANCEL_CURRENT_ORDER_FAILED:
      return {
        ...state,
        cancelCurrentOrderState: "failed",
        cancelFailedReason: action.reason
      }
    case CANCEL_CURRENT_ORDER_SUCCEEDED:
      return {
        ...state,
        cancelCurrentOrderState: "succeeded"
      }
    case DELETE_HIS__ORDERS_NEXT_LINK:
      return {
        ...state,
        historicalsOrdersNextLink: ""
      }
    case REFILL_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: action.orders,
        historicalsOrdersNextLink: (action.next)? action.next : ""
      }
    case ADD_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: state.historicalsOrders.concat(action.orders),
        historicalsOrdersNextLink: (action.next)? action.next : ""
      }
    case DELETE_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: [],
        historicalsOrdersNextLink: ""
      }
    case ASKING_CURRENT_ORDER:
      return {
        ...state,
        isAskingCurrentOrder: true,
        currentOrder: {},
        currentOrderFailedReason: '',
        cancelCurrentOrderState: "noteven",
        cancelFailedReason: ""
      }
    case ASK_CURRENT_ORDER_FAILED:
      return {
        ...state,
        isAskingCurrentOrder: false,
        currentOrder: {},
        currentOrderFailedReason: action.reason
      }
    case ADD_CURRENT_ORDER:
      return {
        ...state,
        isAskingCurrentOrder: false,
        currentOrder: action.order,
        currentOrderFailedReason: ''
      }
    default:
      return state
  }
}

export default ordersReducer
