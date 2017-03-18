import {
  RESET_TOKEN_ERROR, ADD_TOKEN, DELETE_TOKEN, ASKING_TOKEN, ASKING_TOKEN_FAILED
} from '../actions'

const tokenReducer = (state = {
  isAskingToken: false,
  error: "",
  token: ""
}, action) => {
  switch (action.type) {
    case RESET_TOKEN_ERROR:
      return {
        ...state,
        error:"",
        isAskingToken: false
      }
    case ASKING_TOKEN:
      return {
        ...state,
        error:"",
        isAskingToken: true
      }
    case ASKING_TOKEN_FAILED:
      return {
        ...state,
        error: action.error,
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
