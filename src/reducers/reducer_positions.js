import {
  ADD_POSITIONS, DELETE_POSITIONS, ASKING_POSITIONS, ASKING_POSITIONS_FAILED
} from '../actions'

const positionsReducer = (state = {
  isAskingPositions: false,
  error: "",
  positions: [],
}, action) => {
  switch (action.type) {
    case ASKING_POSITIONS:
      return {
        ...state,
        error: "",
        isAskingPositions: true
      }
    case ASKING_POSITIONS_FAILED:
      return {
        ...state,
        isAskingPositions: false,
        error: action.error,
        positions: []
      }
    case ADD_POSITIONS:
      return {
        ...state,
        isAskingPositions: false,
        positions: action.positions,
      }
    case DELETE_POSITIONS:
      return {
        ...state,
        positions: [],
      }
    default:
      return state
  }
}

export default positionsReducer
