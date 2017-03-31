////////////ORDERS
export const ADD_HIS_ORDERS = 'ADD_HIS_ORDERS'
export const REFILL_HIS_ORDERS = 'REFILL_HIS_ORDERS'
export const DELETE_HIS_ORDERS = 'DELETE_HIS_ORDERS'

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
      console.log(jsonResult.results)
      dispatch(refillHistoricalsOrders(jsonResult.results));
    }
    else {
      console.log("more order histories!")
      console.log(jsonResult.results)
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
