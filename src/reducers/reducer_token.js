import {
  RESET_TOKEN_ERROR,
  ADD_TOKEN,
  DELETE_TOKEN,
  ASKING_TOKEN,
  ASKING_TOKEN_FAILED,
  NEED_MFA
} from '../actions'

const tokenReducer = (state = {
  isAskingToken: false,
  tokenError: "",
  token: "",
  needMFA: false
}, action) => {
  switch (action.type) {
    case RESET_TOKEN_ERROR:
      return {
        ...state,
        tokenError:"",
        isAskingToken: false,
        needMFA: false
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
    case NEED_MFA:
      return {
        ...state,
        tokenError: "",
        isAskingToken: false,
        needMFA: true
      }
    case ADD_TOKEN:
      return {
        ...state,
        isAskingToken: false,
        token: `Token ${action.token}`,
        needMFA: false
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
