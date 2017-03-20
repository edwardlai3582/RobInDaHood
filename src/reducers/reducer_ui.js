import {
  TOGGLE_WATCHLISTS_MODULE
} from '../actions'

const uiReducer = (state = {
  watchlistsModuleOpen: false
}, action) => {
  switch (action.type) {
    case TOGGLE_WATCHLISTS_MODULE:
      return {
        ...state,
        watchlistsModuleOpen: !state.watchlistsModuleOpen
      }
    default:
      return state
  }
}

export default uiReducer
