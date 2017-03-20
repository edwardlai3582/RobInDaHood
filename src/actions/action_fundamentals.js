////////////FUNDAMENTALS
export const ADD_FUNDAMENTAL = 'ADD_FUNDAMENTAL'
export const DELETE_FUNDAMENTAL = 'DELETE_FUNDAMENTAL'
export const ASKING_FUNDAMENTAL = 'ASKING_FUNDAMENTAL'
export const ASKING_FUNDAMENTAL_FAILED = 'ASKING_FUNDAMENTAL_FAILED'

export const askingFundamentalFailed = (error) => ({
  type: ASKING_FUNDAMENTAL_FAILED,
  error
})

export const askingFundamental = () => ({
  type: ASKING_FUNDAMENTAL
})

export const addFundamental = (symbol, fundamental) => ({
  type: ADD_FUNDAMENTAL,
  symbol,
  fundamental
})

export const deleteFundamental = (symbol) => ({
  type: DELETE_FUNDAMENTAL,
  symbol
})

export const askFundamental = (symbol) => (dispatch, getState) => {
  dispatch(askingFundamental());
  return fetch(`https://api.robinhood.com/fundamentals/${symbol}/`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    dispatch(addFundamental(symbol, jsonResult));
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingFundamentalFailed(reason));
  });
}
