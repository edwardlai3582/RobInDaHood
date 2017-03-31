////////////ORDERS
export const ADD_HIS_ORDERS = 'ADD_HIS_ORDERS'
export const REFILL_HIS_ORDERS = 'REFILL_HIS_ORDERS'
export const DELETE_HIS_ORDERS = 'DELETE_HIS_ORDERS'
export const ASKING_CURRENT_ORDER = 'ASKING_CURRENT_ORDER'
export const ASK_CURRENT_ORDER_FAILED = 'ASK_CURRENT_ORDER_FAILED'
export const ADD_CURRENT_ORDER = 'ADD_CURRENT_ORDER'

export const refillHistoricalsOrders = (orders) => ({
  type: REFILL_HIS_ORDERS,
  orders
})

export const addHistoricalsOrders = (orders) => ({
  type: ADD_HIS_ORDERS,
  orders
})

export const deleteHistoricalsOrders = () => ({
  type: DELETE_HIS_ORDERS
})

export const askHistoricalsOrders = (...theArgs) => (dispatch, getState) => {
  let link = (theArgs.length === 0)? "https://api.robinhood.com/orders" : theArgs[0];

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
      dispatch(refillHistoricalsOrders(jsonResult.results));
    }
    else {
      console.log("more order histories!")
      //console.log(jsonResult.results)
      dispatch(addHistoricalsOrders(jsonResult.results));
    }

    if(jsonResult.next){
      dispatch(askHistoricalsOrders(jsonResult.next));
    }
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
