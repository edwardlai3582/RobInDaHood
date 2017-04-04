import {
  ADD_ACCOUNT, DELETE_ACCOUNT, ASKING_ACCOUNT, ASKING_ACCOUNT_FAILED, RESET_ACCOUNT_ERROR
} from '../actions'

const accountReducer = (state = {
  isAskingAccount: false,
  accountError: "",
  account: {},
  accountNumber: ""
}, action) => {
  switch (action.type) {
    case RESET_ACCOUNT_ERROR:
      return {
        ...state,
        accountError:"",
        isAskingAccount: false
      }
    case ASKING_ACCOUNT:
      return {
        ...state,
        accountError: "",
        isAskingAccount: true
      }
    case ASKING_ACCOUNT_FAILED:
      return {
        ...state,
        isAskingAccount: false,
        accountError: action.error,
        account: {}
      }
    case ADD_ACCOUNT:
      console.log("ACCOUNT INFO");
      console.log(action.account);
      return {
        ...state,
        isAskingAccount: false,
        account: action.account,
        accountNumber: action.account.account_number
      }
    case DELETE_ACCOUNT:
      return {
        ...state,
        account: {},
        accountNumber: ""
      }
    default:
      return state
  }
}

export default accountReducer
