import {
  ADD_HIS_QUOTES, DELETE_HIS_QUOTES,
  ADD_QUOTES, DELETE_QUOTES
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
        //instruments: [],
      }
      case ADD_QUOTES:
        let newQuotes = Object.assign({}, state.quotes);
        newQuotes[action.symbol] = action.quotes;
        return {
          ...state,
          quotes: newQuotes
        }
      case DELETE_QUOTES:
        return {
          ...state,
          //instruments: [],
        }
    default:
      return state
  }
}

export default quotesReducer
