import {
  ADD_FUNDAMENTAL, DELETE_FUNDAMENTAL
} from '../actions'

const fundamentalsReducer = (state = {
  fundamentals: {}
}, action) => {
  switch (action.type) {
    case ADD_FUNDAMENTAL:
      let newfundamentals = Object.assign({}, state.fundamentals);
      newfundamentals[action.symbol] = action.fundamental;
      return {
        fundamentals: newfundamentals
      }
    case DELETE_FUNDAMENTAL:
      return {
        ...state,
        //instruments: [],
      }
    default:
      return state
  }
}

export default fundamentalsReducer
