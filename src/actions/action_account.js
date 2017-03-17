////////////ACCOUNT
export const ADD_ACCOUNT = 'ADD_ACCOUNT'
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT'
export const ASKING_ACCOUNT = 'ASKING_ACCOUNT'
export const ASKING_ACCOUNT_FAILED = 'ASKING_ACCOUNT_FAILED'

export const askingAccountFailed = (error) => ({
  type: ASKING_ACCOUNT_FAILED,
  error
})

export const askingAccount = () => ({
  type: ASKING_ACCOUNT
})

export const addAccount = account => ({
  type: ADD_ACCOUNT,
  account
})

export const deleteAccount = () => ({
  type: DELETE_ACCOUNT
})

export const askAccount = () => (dispatch, getState) => {
  dispatch(askingAccount());
  return fetch(`https://api.robinhood.com/accounts/`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    if(jsonResult.hasOwnProperty("results")){
      dispatch(addAccount(jsonResult.results[0]));
    }
    else {
      dispatch(askingAccountFailed(jsonResult[Object.keys(jsonResult)[0]][0]));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingAccountFailed(reason));
  });
  //{"detail":"Authentication credentials were not provided."}
}
