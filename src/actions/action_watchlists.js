////////////WATCHLISTS
export const ADD_WATCHLISTS = 'ADD_WATCHLISTS'
export const DELETE_WATCHLISTS = 'DELETE_WATCHLISTS'
export const ASKING_WATCHLISTS = 'ASKING_WATCHLISTS'
export const ASKING_WATCHLISTS_FAILED = 'ASKING_WATCHLISTS_FAILED'

export const askingWatchlistsFailed = (error) => ({
  type: ASKING_WATCHLISTS_FAILED,
  error
})

export const askingWatchlists = () => ({
  type: ASKING_WATCHLISTS
})

export const addWatchlists = watchlists => ({
  type: ADD_WATCHLISTS,
  watchlists
})

export const deleteWatchlists = () => ({
  type: DELETE_WATCHLISTS
})

export const askWatchlists = () => (dispatch, getState) => {
  dispatch(askingWatchlists());
  return fetch(`https://api.robinhood.com/watchlists/Default/`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    if(jsonResult.hasOwnProperty("results")){
      dispatch(addWatchlists(jsonResult.results));
    }
    else {
      //jsonResult[Object.keys(jsonResult)[0]][0])
      dispatch(askingWatchlistsFailed("QQ"));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingWatchlistsFailed(reason));
  });
}
