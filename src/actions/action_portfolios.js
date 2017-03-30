////////////PORTFOLIOS
export const ADD_HIS_PORTFOLIOS = 'ADD_HIS_PORTFOLIOS'
export const DELETE_HIS_PORTFOLIOS = 'DELETE_HIS_PORTFOLIOS'

export const addHistoricalsPortfolios = (hisType, portfolios) => ({
  type: ADD_HIS_PORTFOLIOS,
  hisType,
  portfolios
})

export const deleteHistoricalsPortfolios = (hisType) => ({
  type: DELETE_HIS_PORTFOLIOS,
  hisType
})

export const askHistoricalsPortfolios = (span, interval) => (dispatch, getState) => {

  return fetch(`https://api.robinhood.com/portfolios/historicals/${getState().accountReducer.accountNumber}?span=${span}&interval=${interval}`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    if(jsonResult.equity_historicals){
      //parse string to number
      //adjusted_close_equity, adjusted_open_equity, close_market_value, open_market_value, net_return, open_equity, close_equity
      jsonResult.equity_historicals.forEach((historical, index, theArray)=>{
        theArray[index].adjusted_close_equity = Number(historical.adjusted_close_equity)
        theArray[index].adjusted_open_equity = Number(historical.adjusted_open_equity)
        theArray[index].close_market_value = Number(historical.close_market_value)
        theArray[index].open_market_value = Number(historical.open_market_value)
        theArray[index].net_return = Number(historical.net_return)
        theArray[index].open_equity = Number(historical.open_equity)
        theArray[index].close_equity = Number(historical.close_equity)
      })
      dispatch(addHistoricalsPortfolios(span+interval, jsonResult));
    }
    else {
      console.log(jsonResult);
    }    
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
