import {
  ADD_WATCHLISTS, ADD_MORE_WATCHLISTS,
  ADD_WATCHLIST,
  REMOVE_WATCHLIST,
  DELETE_WATCHLISTS,
  ASKING_WATCHLISTS,
  ASKING_WATCHLISTS_FAILED
} from '../actions'

const watchlistsReducer = (state = {
  isAskingWatchlists: false,
  error: "",
  watchlists: []
}, action) => {
  switch (action.type) {
    case ASKING_WATCHLISTS:
      return {
        ...state,
        error: "",
        isAskingWatchlists: true
      }
    case ASKING_WATCHLISTS_FAILED:
      return {
        ...state,
        isAskingWatchlists: false,
        error: action.error,
        watchlists: []
      }
    case ADD_WATCHLISTS:
      return {
        ...state,
        isAskingWatchlists: false,
        watchlists: action.watchlists,
      }
    case ADD_MORE_WATCHLISTS:
      return {
        ...state,
        isAskingWatchlists: false,
        watchlists: state.watchlists.concat(action.watchlists)
      }
    case DELETE_WATCHLISTS:
      return {
        ...state,
        watchlists: [],
      }
    case ADD_WATCHLIST:
      return {
        ...state,
        watchlists: [...state.watchlists, action.watchlist]
      }
    case REMOVE_WATCHLIST:
      let instrumentLink = `https://api.robinhood.com/instruments/${action.instrumentId}/`;
      let newWatchlists = undefined;
      for(let i=0; i<state.watchlists.length; i++){
        if(state.watchlists[i].instrument === instrumentLink){
          console.log("found it");
          newWatchlists = [...state.watchlists.slice(0, i), ...state.watchlists.slice(i+1)];
          break;
        }
      }
      if(!newWatchlists) newWatchlists = state.watchlists;
      return {
        ...state,
        watchlists: newWatchlists,
      }
    default:
      return state
  }
}

export default watchlistsReducer
