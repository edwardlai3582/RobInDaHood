import {
  ADD_HIS_QUOTES, DELETE_HIS_QUOTES
} from '../actions'

const quotesReducer = (state = {
  historicalsQuotes: {}
}, action) => {
  switch (action.type) {
    case ADD_HIS_QUOTES:
      let newHistoricalsQuotes = Object.assign({}, state.historicalsQuotes);
      newHistoricalsQuotes[action.symbol] = action.quotes;
      return {
        historicalsQuotes: newHistoricalsQuotes
      }
    case DELETE_HIS_QUOTES:
      return {
        ...state,
        //instruments: [],
      }
    default:
      return state
  }
}

export default quotesReducer
