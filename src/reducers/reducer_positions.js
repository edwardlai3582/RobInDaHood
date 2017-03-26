import {
  ADD_POSITIONS, DELETE_POSITIONS, ASKING_POSITIONS, ASKING_POSITIONS_FAILED,
  ADD_POSITION
} from '../actions'

const positionsReducer = (state = {
  isAskingPositions: false,
  error: "",
  positions: [],
  eachPosition: {}
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
    case ADD_POSITION:
      let tempPosition = {};
      tempPosition[action.position.instrument] = action.position;
      return {
        ...state,
        eachPosition: Object.assign({}, state.eachPosition, tempPosition)
      }
    default:
      return state
  }
}

export default positionsReducer
