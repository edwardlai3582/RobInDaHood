import * as actions from '../actions';

const fundamentalsReducer = (state = {
  fundamentals: {}
}, action) => {
  switch (action.type) {
    case actions.FUNDAMENTAL_ADD:
      let newfundamentals = Object.assign({}, state.fundamentals);
      newfundamentals[action.symbol] = action.fundamental;
      return {
        ...state,
        fundamentals: newfundamentals
      }
    case actions.FUNDAMENTAL_DELETE:
      let tempfundamentals = Object.assign({}, state.fundamentals);
      delete tempfundamentals[action.symbol];
      return {
        ...state,
        fundamentals: tempfundamentals
      }
    default:
      return state
  }
}

export default fundamentalsReducer
