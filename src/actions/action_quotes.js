////////////QUOTES
export const ADD_HIS_QUOTES = 'ADD_HIS_QUOTES'
export const DELETE_HIS_QUOTES = 'DELETE_HIS_QUOTES'
export const ADD_QUOTES = 'ADD_QUOTES'
export const DELETE_QUOTES = 'DELETE_QUOTES'

export const addHistoricalsQuotes = (symbol, hisType, quotes) => ({
  type: ADD_HIS_QUOTES,
  symbol,
  hisType,
  quotes
})

export const deleteHistoricalsQuotes = (symbol) => ({
  type: DELETE_HIS_QUOTES,
  symbol
})

export const askHistoricalsQuotes = (symbol, span, interval, bounds) => (dispatch, getState) => {
  //dispatch(askingFundamental());
  return fetch(`https://api.robinhood.com/quotes/historicals/${symbol}/?span=${span}&interval=${interval}&bounds=${bounds}`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    //parse string to number
    //open_price, close_price, high_price, low_price
    jsonResult.historicals.forEach((historical, index, theArray)=>{
      theArray[index].open_price= Number(historical.open_price)
      theArray[index].close_price= Number(historical.close_price)
      theArray[index].high_price= Number(historical.high_price)
      theArray[index].low_price= Number(historical.low_price)
    })

    dispatch(addHistoricalsQuotes(symbol, span+interval+bounds, jsonResult));
  })
  .catch(function(reason) {
    console.log(reason);
  });
}

export const addQuotes = (symbol, quotes) => ({
  type: ADD_QUOTES,
  symbol,
  quotes
})

export const deleteQuotes = (symbol) => ({
  type: DELETE_QUOTES,
  symbol
})

export const askQuotes = (symbol) => (dispatch, getState) => {
  //dispatch(askingFundamental());
  return fetch(`https://api.robinhood.com/quotes/${symbol}/`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    dispatch(addQuotes(symbol, jsonResult));
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
