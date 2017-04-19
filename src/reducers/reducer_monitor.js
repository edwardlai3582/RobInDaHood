import * as actions from '../actions';

const monitorReducer = (state = {
  tickers: {}
}, action) => {
  switch (action.type) {
    case actions.MONITOR_TICKER_LAST_PRICE_CHANGE:
      let tempTickers = Object.assign({}, state.tickers );
      tempTickers[action.instrument_id].last_price = action.last_price;
      return {
        ...state,
        tickers: tempTickers
      }
    case actions.MONITOR_TICKER_PERCENTAGE_CHANGE:
      tempTickers = Object.assign({}, state.tickers );
      tempTickers[action.instrument_id].percentage = action.percentage;
      return {
        ...state,
        tickers: tempTickers
      }
    case actions.MONITOR_TICKER_DELETE:
      tempTickers = Object.assign({}, state.tickers );
      delete tempTickers[action.instrument_id]
      return {
        ...state,
        tickers: tempTickers
      }
    case actions.MONITOR_TICKER_ADD:
      tempTickers = Object.assign({}, state.tickers );
      tempTickers[action.instrument_id] = {
        instrument_id: action.instrument_id,
        symbol: action.symbol,
        percentage: action.percentage,
        last_price: action.last_price
      }
      return {
        ...state,
        tickers: tempTickers
      }
    default:
      return state
  }
}

export default monitorReducer

/*
symbol: {
  instrument_id: "instrument_id"
  symbol: "symbol",
  percentage: number,
  last_price: number,
}
*/
