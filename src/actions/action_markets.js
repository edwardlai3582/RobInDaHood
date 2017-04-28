////////////MARKETS
export const ADD_MARKET = 'ADD_MARKET'
export const ADD_MARKETSHOUR = 'ADD_MARKETSHOUR'
export const CLEAR_MARKETS_AND_MARKETSHOURS = 'CLEAR_MARKETS_AND_MARKETSHOURS'

export const clearMarketsAndMarketsHours = () => ({
  type: CLEAR_MARKETS_AND_MARKETSHOURS
})

export const addMarketsHours = ( marketshour, todays_hours ) => ({
  type: ADD_MARKETSHOUR,
  marketshour,
  todays_hours
})

export const addMarket = (market) => ({
  type: ADD_MARKET,
  market
})

export const askMarket = (marketUrl) => (dispatch, getState) => {
  return fetch(marketUrl, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    dispatch(addMarket(jsonResult));
  })
  .catch(function(reason) {
    console.log(reason);
  });
}

export const askMarketsHour = (todays_hours) => (dispatch, getState) => {
  return fetch(todays_hours, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    dispatch(addMarketsHours( jsonResult, todays_hours ));
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
