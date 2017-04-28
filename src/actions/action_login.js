////////////LOGIN
////////////ACCOUNT
export const ACCOUNT_RESET_ERROR = 'ACCOUNT_RESET_ERROR'
export const ACCOUNT_ADD = 'ACCOUNT_ADD'
export const ACCOUNT_DELETE = 'ACCOUNT_DELETE'
export const ACCOUNT_ASKING = 'ACCOUNT_ASKING'
export const ACCOUNT_ASKING_FAILED = 'ACCOUNT_ASKING_FAILED'
////////////TOKEN
export const TOKEN_RESET_ERROR = 'TOKEN_RESET_ERROR'
export const TOKEN_ADD = 'TOKEN_ADD'
export const TOKEN_DELETE = 'TOKEN_DELETE'
export const TOKEN_ASKING = 'TOKEN_ASKING'
export const TOKEN_ASKING_FAILED = 'TOKEN_ASKING_FAILED'
export const TOKEN_NEED_MFA = 'TOKEN_NEED_MFA'

export const resetAccountError = () => ({
  type: ACCOUNT_RESET_ERROR
})

export const askingAccountFailed = (error) => ({
  type: ACCOUNT_ASKING_FAILED,
  error
})

export const askingAccount = () => ({
  type: ACCOUNT_ASKING
})

export const addAccount = account => ({
  type: ACCOUNT_ADD,
  account
})

export const deleteAccount = () => ({
  type: ACCOUNT_DELETE
})

export const askAccount = () => (dispatch, getState) => {
  dispatch(askingAccount());
  return fetch(`https://api.robinhood.com/accounts/`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    if(jsonResult.results){
      dispatch(addAccount(jsonResult.results[0]));
    }
    else {
      //ERROR: {"detail":"Authentication credentials were not provided."}
      dispatch(askingAccountFailed(jsonResult[Object.keys(jsonResult)[0]][0]));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingAccountFailed(reason));
  });
}

export const resetTokenError = () => ({
  type: TOKEN_RESET_ERROR
})

export const askingTokenFailed = (error) => ({
  type: TOKEN_ASKING_FAILED,
  error
})

export const askingToken = () => ({
  type: TOKEN_ASKING
})

export const addToken = token => ({
  type: TOKEN_ADD,
  token
})

export const deleteToken = () => ({
  type: TOKEN_DELETE
})

export const needMFA = () => ({
  type: TOKEN_NEED_MFA
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
