import * as actions from '../actions';

const watchlistsReducer = (state = {
  isAskingWatchlists: false,
  error: "",
  watchlists: []
}, action) => {
  switch (action.type) {
    case actions.ASKING_WATCHLISTS:
      return {
        ...state,
        error: "",
        isAskingWatchlists: true
      }
    case actions.ASKING_WATCHLISTS_FAILED:
      return {
        ...state,
        isAskingWatchlists: false,
        error: action.error,
        watchlists: []
      }
    case actions.ADD_WATCHLISTS:
      return {
        ...state,
        isAskingWatchlists: false,
        watchlists: action.watchlists,
      }
    case actions.ADD_MORE_WATCHLISTS:
      return {
        ...state,
        isAskingWatchlists: false,
        watchlists: state.watchlists.concat(action.watchlists)
      }
    case actions.DELETE_WATCHLISTS:
      return {
        ...state,
        watchlists: [],
      }
    case actions.ADD_WATCHLIST:
      return {
        ...state,
        watchlists: [...state.watchlists, action.watchlist]
      }
    case actions.REMOVE_WATCHLIST:
      return {
        ...state,
        watchlists: [...state.watchlists.slice(0, action.instrumentIndex), ...state.watchlists.slice(action.instrumentIndex+1)]
      }
    default:
      return state
  }
}

export default watchlistsReducer
