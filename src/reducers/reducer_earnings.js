import * as actions from '../actions';

const earningsReducer = (state = {
  earningsAll: {}
}, action) => {
  switch (action.type) {
    case actions.EARNINGS_ADD:
      let newEarningsAll = Object.assign({}, state.earningsAll);
      newEarningsAll[action.symbol] = action.earnings;
      return {
        ...state,
        earningsAll: newEarningsAll
      }
    case actions.EARNINGS_DELETE:
      let tempEarningsAll = Object.assign({}, state.earningsAll);
      delete tempEarningsAll[action.symbol];
      return {
        ...state,
        earningsAll: tempEarningsAll
      }
    default:
      return state
  }
}

export default earningsReducer
