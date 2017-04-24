///////////EARNINGS
export const EARNINGS_ADD = 'EARNINGS_ADD'
export const EARNINGS_DELETE = 'EARNINGS_DELETE'

export const addEarnings = (symbol, earnings) => ({
  type: EARNINGS_ADD,
  symbol,
  earnings
})

export const deleteEarnings = (symbol) => ({
  type: EARNINGS_DELETE,
  symbol
})

export const askEarnings = (symbol) => (dispatch, getState) => {
  return fetch(`https://api.robinhood.com/marketdata/earnings/?symbol=${symbol}`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json'
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    dispatch(addEarnings(symbol, jsonResult.results));
  })
  .catch(function(reason) {
    console.log(reason);
  });
}

export const cleanUpEarnings = () => (dispatch, getState) => {
  Object.keys(getState().earningsReducer.earningsAll).forEach((symbol) => {
    if(getState().tabsReducer.keys.indexOf(symbol) === -1) {
      dispatch(deleteEarnings(symbol));
    }
  });
}
