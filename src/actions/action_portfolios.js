////////////PORTFOLIOS
export const ADD_HIS_PORTFOLIOS = 'ADD_HIS_PORTFOLIOS'
export const DELETE_HIS_PORTFOLIOS = 'DELETE_HIS_PORTFOLIOS'
export const ADD_PORTFOLIOS = 'ADD_PORTFOLIOS'

export const addHistoricalsPortfolios = (hisType, portfolios) => ({
  type: ADD_HIS_PORTFOLIOS,
  hisType,
  portfolios
})

export const deleteHistoricalsPortfolios = (hisType) => ({
  type: DELETE_HIS_PORTFOLIOS,
  hisType
})

export const askHistoricalsPortfolios = (span, interval, bounds) => (dispatch, getState) => {
  return fetch(`https://api.robinhood.com/portfolios/historicals/${getState().accountReducer.accountNumber}?span=${span}&interval=${interval}&bounds=${bounds}`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
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

export const addPortfolios = (portfolios) => ({
  type: ADD_PORTFOLIOS,
  portfolios
})

export const askPortfolios = () => (dispatch, getState) => {
  return fetch(`https://api.robinhood.com/portfolios/`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    if(jsonResult.results.length > 0){
      let res = {}
      //parse string to number
      res.unwithdrawable_grants = Number(jsonResult.results[0].unwithdrawable_grants)
      res.account = jsonResult.results[0].account
      res.excess_maintenance_with_uncleared_deposits = Number(jsonResult.results[0].excess_maintenance_with_uncleared_deposits)
      res.url = jsonResult.results[0].url
      res.excess_maintenance = Number(jsonResult.results[0].excess_maintenance)
      res.market_value = Number(jsonResult.results[0].market_value)
      res.withdrawable_amount = Number(jsonResult.results[0].withdrawable_amount)
      res.last_core_market_value = Number(jsonResult.results[0].last_core_market_value)
      res.unwithdrawable_deposits = Number(jsonResult.results[0].unwithdrawable_deposits)
      //can be null
      res.extended_hours_equity = jsonResult.results[0].extended_hours_equity
      res.excess_margin = Number(jsonResult.results[0].excess_margin)
      res.excess_margin_with_uncleared_deposits = Number(jsonResult.results[0].excess_margin_with_uncleared_deposits)
      res.equity = Number(jsonResult.results[0].equity)
      res.last_core_equity = Number(jsonResult.results[0].last_core_equity)
      res.adjusted_equity_previous_close = Number(jsonResult.results[0].adjusted_equity_previous_close)
      res.equity_previous_close = Number(jsonResult.results[0].equity_previous_close)
      res.start_date = jsonResult.results[0].start_date
      ////can be null
      res.extended_hours_market_value =  jsonResult.results[0].extended_hours_market_value
console.log(res);
      dispatch(addPortfolios(res));
    }
    else {
      console.log(jsonResult);
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
