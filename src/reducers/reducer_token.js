import * as actions from '../actions';

const tokenReducer = (state = {
  isAskingToken: false,
  tokenError: "",
  token: "",
  needMFA: false
}, action) => {
  switch (action.type) {
    case actions.TOKEN_RESET_ERROR:
      return {
        ...state,
        tokenError:"",
        isAskingToken: false,
        needMFA: false
      }
    case actions.TOKEN_ASKING:
      return {
        ...state,
        tokenError:"",
        isAskingToken: true
      }
    case actions.TOKEN_ASKING_FAILED:
      return {
        ...state,
        tokenError: action.error,
        isAskingToken: false
      }
    case actions.TOKEN_NEED_MFA:
      return {
        ...state,
        tokenError: "",
        isAskingToken: false,
        needMFA: true
      }
    case actions.TOKEN_ADD:
      return {
        ...state,
        isAskingToken: false,
        token: `Token ${action.token}`,
        needMFA: false
      }
    case actions.TOKEN_DELETE:
      return {
        ...state,
        token: ""
      }
    default:
      return state
  }
}

export default tokenReducer
