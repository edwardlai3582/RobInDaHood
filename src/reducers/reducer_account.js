import {
  ADD_ACCOUNT, DELETE_ACCOUNT, ASKING_ACCOUNT, ASKING_ACCOUNT_FAILED
} from '../actions'

const accountReducer = (state = {
  isAskingAccount: false,
  error: "",
  account: undefined,
  accountNumber: ""
}, action) => {
  switch (action.type) {
    case ASKING_ACCOUNT:
      return {
        ...state,
        error: "",
        isAskingAccount: true
      }
    case ASKING_ACCOUNT_FAILED:
      return {
        ...state,
        isAskingAccount: false,
        error: action.error,
        account: undefined
      }
    case ADD_ACCOUNT:
      return {
        ...state,
        isAskingAccount: false,
        account: action.account,
        accountNumber: action.account.account_number
      }
    case DELETE_ACCOUNT:
      return {
        ...state,
        account: undefined,
        accountNumber: ""
      }
    default:
      return state
  }
}

export default accountReducer
