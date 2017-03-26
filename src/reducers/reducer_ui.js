import {
  TOGGLE_WATCHLISTS_MODULE,
  TOGGLE_POSITIONS_MODULE
} from '../actions'

const uiReducer = (state = {
  watchlistsModuleOpen: false,
  positionsModuleOpen: false
}, action) => {
  switch (action.type) {
    case TOGGLE_WATCHLISTS_MODULE:
      return {
        ...state,
        watchlistsModuleOpen: !state.watchlistsModuleOpen
      }
    case TOGGLE_POSITIONS_MODULE:
      return {
        ...state,
        positionsModuleOpen: !state.positionsModuleOpen
      }
    default:
      return state
  }
}

export default uiReducer
