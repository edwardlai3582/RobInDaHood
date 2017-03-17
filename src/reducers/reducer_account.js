import {
  ADD_ACCOUNT, DELETE_ACCOUNT, ASKING_ACCOUNT, ASKING_ACCOUNT_FAILED
} from '../actions'

const accountReducer = (state = {
  isAsking: false,
  error: "",
  account: ""
}, action) => {
  switch (action.type) {
    case ASKING_ACCOUNT:
      return {
        ...state,
        error: "",
        isAsking: true
      }
    case ASKING_ACCOUNT_FAILED:
      return {
        ...state,
        isAsking: false,
        error: action.error,
        account: undefined
      }
    case ADD_ACCOUNT:
      return {
        ...state,
        isAsking: false,
        account: action.account
      }
    case DELETE_ACCOUNT:
      return {
        ...state,
        account: ""
      }
    default:
      return state
  }
}

export default accountReducer
