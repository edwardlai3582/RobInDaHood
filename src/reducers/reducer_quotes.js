import {
  ADD_HIS_QUOTES, DELETE_HIS_QUOTES,
  ADD_QUOTE, DELETE_QUOTE,
  ADD_MULTIPLE_QUOTES
} from '../actions'

const quotesReducer = (state = {
  historicalsQuotes: {},
  quotes: {}
}, action) => {
  switch (action.type) {
    case ADD_HIS_QUOTES:
      let newHistoricalsQuotes = Object.assign({}, state.historicalsQuotes);
      newHistoricalsQuotes[action.symbol+action.hisType] = action.quotes;
      return {
        ...state,
        historicalsQuotes: newHistoricalsQuotes
      }
    case DELETE_HIS_QUOTES:
      return {
        ...state,
      }
    case ADD_QUOTE:
      let newQuotes = Object.assign({}, state.quotes);
      newQuotes[action.symbol] = action.quote;
      return {
        ...state,
        quotes: newQuotes
      }
    case DELETE_QUOTE:
      return {
        ...state,
      }
    case ADD_MULTIPLE_QUOTES:
      let tempQuotesObj = {};
      action.quotesArray.forEach((quote)=>{
        tempQuotesObj[quote.symbol] = quote;
      })
      return {
        ...state,
        quotes: Object.assign({}, state.quotes, tempQuotesObj)
      }
    default:
      return state
  }
}

export default quotesReducer
