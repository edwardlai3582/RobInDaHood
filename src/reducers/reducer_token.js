import {
  RESET_TOKEN_ERROR, ADD_TOKEN, DELETE_TOKEN, ASKING_TOKEN, ASKING_TOKEN_FAILED
} from '../actions'

const tokenReducer = (state = {
  isAskingToken: false,
  tokenError: "",
  token: ""
}, action) => {
  switch (action.type) {
    case RESET_TOKEN_ERROR:
      return {
        ...state,
        tokenError:"",
        isAskingToken: false
      }
    case ASKING_TOKEN:
      return {
        ...state,
        tokenError:"",
        isAskingToken: true
      }
    case ASKING_TOKEN_FAILED:
      return {
        ...state,
        tokenError: action.error,
        isAskingToken: false
      }
    case ADD_TOKEN:
      return {
        ...state,
        isAskingToken: false,
        token: `Token ${action.token}`
      }
    case DELETE_TOKEN:
      return {
        ...state,
        token: ""
      }
    default:
      return state
  }
}

export default tokenReducer
