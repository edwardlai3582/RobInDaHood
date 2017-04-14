////////////LOGIN
////////////ACCOUNT
export const RESET_ACCOUNT_ERROR = 'RESET_ACCOUNT_ERROR'
export const ADD_ACCOUNT = 'ADD_ACCOUNT'
export const DELETE_ACCOUNT = 'DELETE_ACCOUNT'
export const ASKING_ACCOUNT = 'ASKING_ACCOUNT'
export const ASKING_ACCOUNT_FAILED = 'ASKING_ACCOUNT_FAILED'

export const resetAccountError = () => ({
  type: RESET_ACCOUNT_ERROR
})

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

////////////TOKEN
export const RESET_TOKEN_ERROR = 'RESET_TOKEN_ERROR'
export const ADD_TOKEN = 'ADD_TOKEN'
export const DELETE_TOKEN = 'DELETE_TOKEN'
export const ASKING_TOKEN = 'ASKING_TOKEN'
export const ASKING_TOKEN_FAILED = 'ASKING_TOKEN_FAILED'
export const NEED_MFA = 'NEED_MFA'

export const resetTokenError = () => ({
  type: RESET_TOKEN_ERROR
})

export const askingTokenFailed = (error) => ({
  type: ASKING_TOKEN_FAILED,
  error
})

export const askingToken = () => ({
  type: ASKING_TOKEN
})

export const addToken = token => ({
  type: ADD_TOKEN,
  token
})

export const deleteToken = () => ({
  type: DELETE_TOKEN
})

export const needMFA = () => ({
  type: NEED_MFA
})

export const askToken = (username, password, mfa) => (dispatch, getState) => {
  dispatch(askingToken());
  const bodyString = (getState().tokenReducer.needMFA)?
    JSON.stringify({ username: username, password: password, mfa_code: mfa }) :
    JSON.stringify({ username: username, password: password });

  return fetch(`https://api.robinhood.com/api-token-auth/`, {
    method: 'POST',
    headers: new Headers({'content-type': 'application/json', 'Accept': 'application/json'}),
    body: bodyString
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    if(jsonResult.hasOwnProperty("token")){
      dispatch(addToken(jsonResult.token));
      dispatch(askAccount());
    }
    else if(jsonResult.mfa_required) {
      dispatch(needMFA())
    }
    else {
      dispatch(askingTokenFailed(jsonResult[Object.keys(jsonResult)[0]][0]));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingTokenFailed(reason));
  });
}
