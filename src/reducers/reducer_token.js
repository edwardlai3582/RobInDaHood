import {
  RESET_TOKEN_ERROR, ADD_TOKEN, DELETE_TOKEN, ASKING_TOKEN, ASKING_TOKEN_FAILED
} from '../actions'

const tokenReducer = (state = {
  isAsking: false,
  error: "",
  token: ""
}, action) => {
  switch (action.type) {
    case RESET_TOKEN_ERROR:
      return {
        ...state,
        error:"",
        isAsking: false
      }
    case ASKING_TOKEN:
      return {
        ...state,
        error:"",
        isAsking: true
      }
    case ASKING_TOKEN_FAILED:
      return {
        ...state,
        error: action.error,
        isAsking: false
      }
    case ADD_TOKEN:
      return {
        ...state,
        isAsking: false,
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
