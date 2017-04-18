import * as actions from '../actions';

const localReducer = (state = {
  localPositions: [],
  localWatchlists: []
}, action) => {
  switch (action.type) {
    case actions.TOGGLE_LOCAL_WATCHLIST:
      let tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.index].open = !state.localWatchlists[action.index].open;
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case actions.RENAME_WATCHLIST_FOLDER:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.index].name = action.name;
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case actions.ADD_WATCHLIST_FOLDER:
      return {
        ...state,
        localWatchlists: [...state.localWatchlists, { name: action.name, open: false, list: action.list }]
      }
    case actions.CONCAT_LIST_TO_LOCAL_WATCHLIST :
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.index].list = tempLocalWatchlists[action.index].list.concat(action.list);
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case actions.DELETE_WATCHLIST_FOLDER:
      return {
        ...state,
        localWatchlists: [
          ...state.localWatchlists.slice(0, action.index),
          ...state.localWatchlists.slice(action.index + 1)
        ]
      }
    case actions.REMOVE_LOCAL_WATCHLIST:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.listIndex].list = [
        ...tempLocalWatchlists[action.listIndex].list.slice(0, action.instrumentIndex),
        ...tempLocalWatchlists[action.listIndex].list.slice(action.instrumentIndex+1)
      ];
      return {
        ...state,
        localWatchlists: tempLocalWatchlists,
      }
    case actions.REORDER_LOCAL_WATCHLIST:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.listIndex].list = action.list;
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case actions.REORDER_LOCAL_WATCHLISTS:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      let firstItem = tempLocalWatchlists[action.aI];
      tempLocalWatchlists[action.aI] = state.localWatchlists[action.bI];
      tempLocalWatchlists[action.bI] = firstItem;

      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
//////////////////////////////////////////////////////////////////////////////////////////////////
    case actions.TOGGLE_LOCAL_POSITION:
      let tempLocalPositions = state.localPositions.slice(0);
      tempLocalPositions[action.index].open = !state.localPositions[action.index].open
      return {
        ...state,
        localPositions: tempLocalPositions
      }
    case actions.RENAME_POSITION_FOLDER:
      tempLocalPositions = state.localPositions.slice(0);
      tempLocalPositions[action.index].name = action.name;
      return {
        ...state,
        localPositions: tempLocalPositions
      }
    case actions.ADD_POSITION_FOLDER:
      return {
        ...state,
        localPositions: [...state.localPositions, {name: action.name, open: false, list: action.list }]
      }
    case actions.CONCAT_LIST_TO_LOCAL_POSITION :
      tempLocalPositions = state.localPositions.slice(0);
      tempLocalPositions[action.index].list = tempLocalPositions[action.index].list.concat(action.list);
      return {
        ...state,
        localPositions: tempLocalPositions
      }
    case actions.DELETE_POSITION_FOLDER:
      return {
        ...state,
        localPositions: [
          ...state.localPositions.slice(0, action.index),
          ...state.localPositions.slice(action.index + 1)
        ]
      }
    case actions.REMOVE_LOCAL_POSITION:
      tempLocalPositions = state.localPositions.slice(0);
      tempLocalPositions[action.listIndex].list = [
        ...tempLocalPositions[action.listIndex].list.slice(0, action.instrumentIndex),
        ...tempLocalPositions[action.listIndex].list.slice(action.instrumentIndex+1)
      ];
      return {
        ...state,
        localPositions: tempLocalPositions,
      }
    case actions.REORDER_LOCAL_POSITION:
      tempLocalPositions = state.localPositions.slice(0);
      tempLocalPositions[action.listIndex].list = action.list;
      return {
        ...state,
        localPositions: tempLocalPositions
      }
    case actions.REORDER_LOCAL_POSITIONS:
      tempLocalPositions = state.localPositions.slice(0);
      firstItem = tempLocalPositions[action.aI];
      tempLocalPositions[action.aI] = state.localPositions[action.bI];
      tempLocalPositions[action.bI] = firstItem;

      return {
        ...state,
        localPositions: tempLocalPositions
      }
//////////////////////////////////////////////////////////////////////////////////////////////////
    default:
      return state
  }
}

export default localReducer
