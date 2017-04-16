////////////FUNDAMENTALS
export const FUNDAMENTAL_ADD = 'FUNDAMENTAL_ADD'
export const FUNDAMENTAL_DELETE = 'FUNDAMENTAL_DELETE'
export const FUNDAMENTAL_ASKING = 'FUNDAMENTAL_ASKING'
export const FUNDAMENTAL_ASKING_FAILED = 'FUNDAMENTAL_ASKING_FAILED'

export const askingFundamentalFailed = (error) => ({
  type: FUNDAMENTAL_ASKING_FAILED,
  error
})

export const askingFundamental = () => ({
  type: FUNDAMENTAL_ASKING
})

export const addFundamental = (symbol, fundamental) => ({
  type: FUNDAMENTAL_ADD,
  symbol,
  fundamental
})

export const deleteFundamental = (symbol) => ({
  type: FUNDAMENTAL_DELETE,
  symbol
})

export const askFundamental = (symbol) => (dispatch, getState) => {
  dispatch(askingFundamental());
  return fetch(`https://api.robinhood.com/fundamentals/${symbol}/`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    dispatch(addFundamental(symbol, jsonResult));
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingFundamentalFailed(reason));
  });
}
