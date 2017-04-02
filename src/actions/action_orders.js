import { askWatchlists } from './action_watchlists'
import { askPositions }  from './action_positions'
////////////ORDERS
export const ADD_HIS_ORDERS = 'ADD_HIS_ORDERS'
export const REFILL_HIS_ORDERS = 'REFILL_HIS_ORDERS'
export const DELETE_HIS_ORDERS = 'DELETE_HIS_ORDERS'
export const ASKING_CURRENT_ORDER = 'ASKING_CURRENT_ORDER'
export const CANCELLING_CURRENT_ORDER = 'CANCELLING_CURRENT_ORDER'
export const CANCEL_CURRENT_ORDER_FAILED = 'CANCEL_CURRENT_ORDER_FAILED'
export const CANCEL_CURRENT_ORDER_SUCCEEDED = 'CANCEL_CURRENT_ORDER_SUCCEEDED'
export const ASK_CURRENT_ORDER_FAILED = 'ASK_CURRENT_ORDER_FAILED'
export const ADD_CURRENT_ORDER = 'ADD_CURRENT_ORDER'
export const DELETE_HIS__ORDERS_NEXT_LINK = 'DELETE_HIS__ORDERS_NEXT_LINK'

export const refillHistoricalsOrders = (orders, next) => ({
  type: REFILL_HIS_ORDERS,
  orders,
  next
})

export const addHistoricalsOrders = (orders, next) => ({
  type: ADD_HIS_ORDERS,
  orders,
  next
})

export const deleteHistoricalsOrders = () => ({
  type: DELETE_HIS_ORDERS
})

export const deleteHistoricalsOrdersNextLink = () => ({
  type: DELETE_HIS__ORDERS_NEXT_LINK
})

export const askHistoricalsOrders = (...theArgs) => (dispatch, getState) => {
  let link = (theArgs.length === 0)? "https://api.robinhood.com/orders" : theArgs[0];
  dispatch(deleteHistoricalsOrdersNextLink());
  return fetch(link, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    if(theArgs.length === 0){
      //console.log(jsonResult.results)
      dispatch(refillHistoricalsOrders(jsonResult.results, jsonResult.next));
    }
    else {
      console.log("more order histories!")
      //console.log(jsonResult.results)
      dispatch(addHistoricalsOrders(jsonResult.results, jsonResult.next));
    }
    /*
      if(jsonResult.next){
        dispatch(askHistoricalsOrders(jsonResult.next));
      }
    */
  })
  .catch(function(reason) {
    console.log(reason);
  });
}

export const addCurrentOrder = (order) => ({
  type: ADD_CURRENT_ORDER,
  order
})

export const askingCurrentOrder = () => ({
  type: ASKING_CURRENT_ORDER
})

export const askingCurrentOrderFailed = (reason) => ({
  type: ASK_CURRENT_ORDER_FAILED,
  reason
})

export const askCurrentOrder = (orderId) => (dispatch, getState) => {
  dispatch(askingCurrentOrder());

  return fetch(`https://api.robinhood.com/orders/${orderId}/`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    if(jsonResult.deatil){
      console.log(jsonResult.deatil);
      dispatch(askingCurrentOrderFailed(jsonResult.deatil));
    }
    else{
      console.log(jsonResult)
      dispatch(addCurrentOrder(jsonResult));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingCurrentOrderFailed(JSON.stringify(reason)));
  });
}

export const cancelCurrentOrderSucceeded = () => ({
  type: CANCEL_CURRENT_ORDER_SUCCEEDED
})

export const cancelCurrentOrderFailed = (reason) => ({
  type: CANCEL_CURRENT_ORDER_FAILED,
  reason
})

export const cancellingCurrentOrder = () => ({
  type: CANCELLING_CURRENT_ORDER
})

export const cancelOrder = (cancelLink, orderId) => (dispatch, getState) => {
  dispatch(cancellingCurrentOrder());
  return fetch(cancelLink, {
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    if(Object.keys(jsonResult).length === 0){
      dispatch(cancelCurrentOrderSucceeded());
      dispatch(askCurrentOrder(orderId));
      dispatch(askHistoricalsOrders());
      //reload watchlist & positions after order cancelled
      dispatch(askWatchlists());
      dispatch(askPositions());
    }
    else{
      console.log(jsonResult);
      dispatch(cancelCurrentOrderFailed(JSON.stringify(jsonResult)));
      dispatch(askCurrentOrder(orderId));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(cancelCurrentOrderFailed(JSON.stringify(reason)));
    dispatch(askCurrentOrder(orderId));
  });
}
