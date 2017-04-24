import * as actions from '../actions';

const uiReducer = (state = {
  watchlistsModuleOpen: false,
  positionsModuleOpen: false
}, action) => {
  switch (action.type) {
    case actions.RESET_BOTH_MODULE:
      return {
        watchlistsModuleOpen: false,
        positionsModuleOpen: false
      }
    case actions.TOGGLE_WATCHLISTS_MODULE:
      return {
        ...state,
        watchlistsModuleOpen: !state.watchlistsModuleOpen
      }
    case actions.TOGGLE_POSITIONS_MODULE:
      return {
        ...state,
        positionsModuleOpen: !state.positionsModuleOpen
      }
    default:
      return state
  }
}

export default uiReducer
