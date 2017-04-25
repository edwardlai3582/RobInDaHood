import { askWatchlists } from './action_watchlists'
import { askPositions }  from './action_positions'
////////////ORDERS
export const ORDERS_ADD_HIS_ORDERS = 'ORDERS_ADD_HIS_ORDERS'
export const ORDERS_REFILL_HIS_ORDERS = 'ORDERS_REFILL_HIS_ORDERS'
export const ORDERS_DELETE_HIS_ORDERS = 'ORDERS_DELETE_HIS_ORDERS'
export const ORDERS_ASKING_CURRENT_ORDER = 'ORDERS_ASKING_CURRENT_ORDER'
export const ORDERS_CANCELLING_CURRENT_ORDER = 'ORDERS_CANCELLING_CURRENT_ORDER'
export const ORDERS_CANCEL_CURRENT_ORDER_FAILED = 'ORDERS_CANCEL_CURRENT_ORDER_FAILED'
export const ORDERS_CANCEL_CURRENT_ORDER_SUCCEEDED = 'ORDERS_CANCEL_CURRENT_ORDER_SUCCEEDED'
export const ORDERS_ASK_CURRENT_ORDER_FAILED = 'ORDERS_ASK_CURRENT_ORDER_FAILED'
export const ORDERS_ADD_CURRENT_ORDER = 'ORDERS_ADD_CURRENT_ORDER'
export const ORDERS_DELETE_HIS__ORDERS_NEXT_LINK = 'ORDERS_DELETE_HIS__ORDERS_NEXT_LINK'
export const ORDERS_PLACING_ORDER = 'ORDERS_PLACING_ORDER'
export const ORDERS_ORDER_PLACED = 'ORDERS_ORDER_PLACED'
export const ORDERS_ORDER_DIDNT_PLACE = 'ORDERS_ORDER_DIDNT_PLACE'
export const ORDERS_RESET_PLACE_ORDER_RELATED = 'ORDERS_RESET_PLACE_ORDER_RELATED'
export const ORDERS_ADD_TO_PENDING_ORDERS = 'ORDERS_ADD_TO_PENDING_ORDERS'
export const ORDERS_REMOVE_FROM_PENDING_ORDERS = 'ORDERS_REMOVE_FROM_PENDING_ORDERS'
export const ORDERS_REFILL_OWN_HIS_ORDERS = 'ORDERS_REFILL_OWN_HIS_ORDERS'
export const ORDERS_ADD_OWN_HIS_ORDERS = 'ORDERS_ADD_OWN_HIS_ORDERS'
export const ORDERS_DELETE_OWN_HIS_ORDERS = 'ORDERS_DELETE_OWN_HIS_ORDERS'
export const ORDERS_DELETE_ORDERS ='ORDERS_DELETE_ORDERS'

export const deleteOrders = () => ({
  type: ORDERS_DELETE_ORDERS
})

export const addToPendingOrders = (order) => ({
  type: ORDERS_ADD_TO_PENDING_ORDERS,
  order
})

export const removeFromPendingOrders = (orderID) => ({
  type: ORDERS_REMOVE_FROM_PENDING_ORDERS,
  orderID
})

export const resetPlaceOrderRelated = () => ({
  type: ORDERS_RESET_PLACE_ORDER_RELATED
})

export const placingOrder = () => ({
  type: ORDERS_PLACING_ORDER
})

export const orderPlaced = () => ({
  type: ORDERS_ORDER_PLACED
})

export const orderDidntPlace = (reason) => ({
  type: ORDERS_ORDER_DIDNT_PLACE,
  reason
})

export const refillHistoricalsOrders = (orders, next) => ({
  type: ORDERS_REFILL_HIS_ORDERS,
  orders,
  next
})

export const addHistoricalsOrders = (orders, next) => ({
  type: ORDERS_ADD_HIS_ORDERS,
  orders,
  next
})

export const deleteHistoricalsOrders = () => ({
  type: ORDERS_DELETE_HIS_ORDERS
})

export const deleteHistoricalsOrdersNextLink = () => ({
  type: ORDERS_DELETE_HIS__ORDERS_NEXT_LINK
})

export const askHistoricalsOrders = (nextLink) => (dispatch, getState) => {
  let link = (nextLink)? nextLink : "https://api.robinhood.com/orders";
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
    if(!nextLink){
      //console.log(jsonResult.results)
      dispatch(refillHistoricalsOrders(jsonResult.results, jsonResult.next));
    }
    else {
      console.log("more order histories!")
      //console.log(jsonResult.results)
      dispatch(addHistoricalsOrders(jsonResult.results, jsonResult.next));
    }

    jsonResult.results.forEach((result) => {
      //check pendingOrders array
      if(result.state !== "filled" && result.state !== "rejected" && result.state !== "cancelled" && result.state !== "failed"){
        dispatch(addToPendingOrders(result));
      }
      else {
        dispatch(removeFromPendingOrders(result.id))
      }
    })
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

export const refillOwnHistoricalsOrders = (symbol, orders, nextLink) => ({
  type: ORDERS_REFILL_OWN_HIS_ORDERS,
  symbol,
  orders,
  nextLink
})

export const addOwnHistoricalsOrders = (symbol, orders, nextLink) => ({
  type: ORDERS_ADD_OWN_HIS_ORDERS,
  symbol,
  orders,
  nextLink
})

export const askOwnHistoricalsOrders = (symbol, instrument, nextLink) => (dispatch, getState) => {
  let link = (nextLink)? nextLink : `https://api.robinhood.com/orders/?instrument=${instrument}`;

  return fetch(link, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    if(!nextLink){
      //console.log(jsonResult.results)
      dispatch(refillOwnHistoricalsOrders(symbol, jsonResult.results, jsonResult.next));
    }
    else {
      console.log("more order histories!")
      //console.log(jsonResult.results)
      dispatch(addOwnHistoricalsOrders(symbol, jsonResult.results, jsonResult.next));
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}

export const addCurrentOrder = (order) => ({
  type: ORDERS_ADD_CURRENT_ORDER,
  order
})

export const askingCurrentOrder = () => ({
  type: ORDERS_ASKING_CURRENT_ORDER
})

export const askingCurrentOrderFailed = (reason) => ({
  type: ORDERS_ASK_CURRENT_ORDER_FAILED,
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
  type: ORDERS_CANCEL_CURRENT_ORDER_SUCCEEDED
})

export const cancelCurrentOrderFailed = (reason) => ({
  type: ORDERS_CANCEL_CURRENT_ORDER_FAILED,
  reason
})

export const cancellingCurrentOrder = () => ({
  type: ORDERS_CANCELLING_CURRENT_ORDER
})

export const cancelOrder = (cancelLink, orderId, symbol, instrument) => (dispatch, getState) => {
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
      dispatch(removeFromPendingOrders(orderId));
      if( symbol in getState().ordersReducer.ownHistoricalsOrders) {
        dispatch(askOwnHistoricalsOrders(symbol, instrument));
      }
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

export const placeOrder = (order) => (dispatch, getState) => {
  dispatch(placingOrder());

  let form = new FormData();
  Object.keys(order).forEach((key) => {
    form.append(key, order[key]);
  });

  return fetch(`https://api.robinhood.com/orders/`, {
    method: 'POST',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token,
    }),
    body: form
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    if(jsonResult.url){
      dispatch(orderPlaced());
      dispatch(askHistoricalsOrders());
      //reload watchlist & positions after order cancelled
      dispatch(askWatchlists());
      dispatch(askPositions());

      //add to pendingOrders array
      if(jsonResult.state !== "filled" && jsonResult.state !== "rejected" && jsonResult.state !== "cancelled" && jsonResult.state !== "failed"){
        dispatch(addToPendingOrders(jsonResult));
        console.log(jsonResult);
      }
    }
    else{
      console.log(jsonResult);
      dispatch(orderDidntPlace(jsonResult.detail));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(orderDidntPlace(reason));
  });
}

export const checkPendingOrders = (order) => (dispatch, getState) => {
  const pendingOrderIDs = Object.keys(getState().ordersReducer.pendingOrders);

  if(pendingOrderIDs.length === 0) {
    return;
  }

  return Promise.all(pendingOrderIDs.map(orderID =>
    fetch(`https://api.robinhood.com/orders/${orderID}/`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': getState().tokenReducer.token
      })
    }).then(response => response.json())
  )).then(jsonResults => {
    //console.log(jsonResults);
    jsonResults.forEach((jsonResult) => {
      if(jsonResult.state === "filled" || jsonResult.state === "rejected" || jsonResult.state === "cancelled" || jsonResult.state === "failed") {
        dispatch(removeFromPendingOrders(jsonResult.id));
        dispatch(askPositions());
      }
    })
  })
}

export const deleteOwnHistoricalsOrders = (symbol) => ({
  type: ORDERS_DELETE_OWN_HIS_ORDERS,
  symbol
})

export const cleanUpOrders = () => (dispatch, getState) => {
  Object.keys(getState().ordersReducer.ownHistoricalsOrders).forEach((symbol) => {
    if(getState().tabsReducer.keys.indexOf(symbol) === -1) {
      dispatch(deleteOwnHistoricalsOrders(symbol));
    }
  });
}
