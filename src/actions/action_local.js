////////////LOCAL
export const ADD_LOCAL_WATCHLISTS = 'ADD_LOCAL_WATCHLISTS'
export const ADD_LOCAL_WATCHLIST = 'ADD_LOCAL_WATCHLIST'
export const REMOVE_LOCAL_WATCHLIST = 'REMOVE_LOCAL_WATCHLIST'
export const REORDER_LOCAL_WATCHLIST = 'REORDER_LOCAL_WATCHLIST'
export const ADD_WATCHLIST_FOLDER = 'ADD_WATCHLIST_FOLDER'

export const addLocalWatchlistFolder = (name) => ({
  type: ADD_WATCHLIST_FOLDER,
  name
})

export const reorderLocalWatchlist = (index, watchlist) => ({
  type: REORDER_LOCAL_WATCHLIST,
  index,
  watchlist
})

export const addLocalWatchlists = watchlists => ({
  type: ADD_LOCAL_WATCHLISTS,
  watchlists
})

export const addLocalWatchlist = watchlist => ({
  type: ADD_LOCAL_WATCHLIST,
  watchlist
})

export const removeLocalWatchlist = instrumentId => ({
  type: REMOVE_LOCAL_WATCHLIST,
  instrumentId
})

/*
export const askWatchlists = (...theArgs) => (dispatch, getState) => {
  let link = (theArgs.length === 0)? "https://api.robinhood.com/watchlists/Default/" : theArgs[0];
  dispatch(askingWatchlists());
  return fetch(link, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    if(jsonResult.hasOwnProperty("results")){
      if(theArgs.length === 0){
        dispatch(addWatchlists(jsonResult.results));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
            console.log("ask for watchlists");
          }
        });
      }
      else {
        console.log("more watchlists!")
        dispatch(addMoreWatchlists(jsonResult.results));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
            console.log("ask for watchlists");
          }
        });
      }

      if(jsonResult.next){
        dispatch(askWatchlists(jsonResult.next));
      }
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
*/
