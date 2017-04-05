////////////QUOTES
export const ADD_HIS_QUOTES = 'ADD_HIS_QUOTES'
export const DELETE_HIS_QUOTES = 'DELETE_HIS_QUOTES'
export const ADD_QUOTE = 'ADD_QUOTE'
export const DELETE_QUOTE = 'DELETE_QUOTE'
export const ADD_MULTIPLE_QUOTES = 'ADD_MULTIPLE_QUOTES'

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

export const addQuote = (symbol, quote) => ({
  type: ADD_QUOTE,
  symbol,
  quote
})

export const deleteQuote = (symbol) => ({
  type: DELETE_QUOTE,
  symbol
})

export const askQuote = (symbol) => (dispatch, getState) => {

  return fetch(`https://api.robinhood.com/quotes/${symbol}/`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    dispatch(addQuote(symbol, jsonResult));
  })
  .catch(function(reason) {
    console.log(reason);
  });
}

export const addMultipleQuotes = (quotesArray) => ({
  type: ADD_MULTIPLE_QUOTES,
  quotesArray
})

export const askMultipleQuotes = () => (dispatch, getState) => {
  let symbolArray = Object.keys(getState().instrumentsReducer.instruments).map((instrumentKey)=>{
    return getState().instrumentsReducer.instruments[instrumentKey].symbol;
  });

  return fetch(`https://api.robinhood.com/quotes/?symbols=${symbolArray.join(',')}`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    if(jsonResult.results){
      dispatch(addMultipleQuotes(jsonResult.results));
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
