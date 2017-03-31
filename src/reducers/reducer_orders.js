import {
  REFILL_HIS_ORDERS, ADD_HIS_ORDERS, DELETE_HIS_ORDERS
} from '../actions'

const ordersReducer = (state = {
  historicalsOrders: []
}, action) => {
  switch (action.type) {
    case REFILL_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: action.orders
      }
    case ADD_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: state.historicalsOrders.concat(action.orders)
      }
    case DELETE_HIS_ORDERS:
      return {
        ...state,
        historicalsOrders: []
      }
    default:
      return state
  }
}

export default ordersReducer
