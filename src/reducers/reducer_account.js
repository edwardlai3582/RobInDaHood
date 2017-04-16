import * as actions from '../actions';

const accountReducer = (state = {
  isAskingAccount: false,
  accountError: "",
  account: {},
  accountNumber: ""
}, action) => {
  switch (action.type) {
    case actions.ACCOUNT_RESET_ERROR:
      return {
        ...state,
        accountError:"",
        isAskingAccount: false
      }
    case actions.ACCOUNT_ASKING:
      return {
        ...state,
        accountError: "",
        isAskingAccount: true
      }
    case actions.ACCOUNT_ASKING_FAILED:
      return {
        ...state,
        isAskingAccount: false,
        accountError: action.error,
        account: {}
      }
    case actions.ACCOUNT_ADD:
      //console.log("ACCOUNT INFO");
      //console.log(action.account);
      return {
        ...state,
        isAskingAccount: false,
        account: action.account,
        accountNumber: action.account.account_number
      }
    case actions.ACCOUNT_DELETE:
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
