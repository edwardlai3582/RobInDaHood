import {
  ADD_QUOTES, DELETE_QUOTES
} from '../actions'

const quotesReducer = (state = {
  quotesAll: {}
}, action) => {
  switch (action.type) {
    case ADD_QUOTES:
      let newQuotesAll = Object.assign({}, state.quotesAll);
      newQuotesAll[action.symbol] = action.quotes;
      return {
        quotesAll: newQuotesAll
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
