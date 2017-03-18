import {
  ADD_WATCHLISTS, DELETE_WATCHLISTS, ASKING_WATCHLISTS, ASKING_WATCHLISTS_FAILED
} from '../actions'

const watchlistsReducer = (state = {
  isAskingWatchlists: false,
  error: "",
  watchlists: [],
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
    case DELETE_WATCHLISTS:
      return {
        ...state,
        watchlists: [],
      }
    default:
      return state
  }
}

export default watchlistsReducer
