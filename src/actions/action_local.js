////////////LOCAL
export const ADD_LOCAL_WATCHLISTS = 'ADD_LOCAL_WATCHLISTS'
export const ADD_LOCAL_WATCHLIST = 'ADD_LOCAL_WATCHLIST'
export const REMOVE_LOCAL_WATCHLIST = 'REMOVE_LOCAL_WATCHLIST'
export const REORDER_LOCAL_WATCHLIST = 'REORDER_LOCAL_WATCHLIST'
export const REORDER_LOCAL_WATCHLISTS = 'REORDER_LOCAL_WATCHLISTS'
export const ADD_WATCHLIST_FOLDER = 'ADD_WATCHLIST_FOLDER'
export const DELETE_WATCHLIST_FOLDER = 'DELETE_WATCHLIST_FOLDER'
export const RENAME_WATCHLIST_FOLDER = 'RENAME_WATCHLIST_FOLDER'
export const TOGGLE_LOCAL_WATCHLIST = 'TOGGLE_LOCAL_WATCHLIST'

export const ADD_LOCAL_POSITIONS = 'ADD_LOCAL_POSITIONS'
export const ADD_LOCAL_POSITION = 'ADD_LOCAL_POSITION'
export const REMOVE_LOCAL_POSITION = 'REMOVE_LOCAL_POSITION'
export const REORDER_LOCAL_POSITION = 'REORDER_LOCAL_POSITION'
export const REORDER_LOCAL_POSITIONS = 'REORDER_LOCAL_POSITIONS'
export const ADD_POSITION_FOLDER = 'ADD_POSITION_FOLDER'
export const DELETE_POSITION_FOLDER = 'DELETE_POSITION_FOLDER'
export const RENAME_POSITION_FOLDER = 'RENAME_POSITION_FOLDER'
export const TOGGLE_LOCAL_POSITION = 'TOGGLE_LOCAL_POSITION'

export const toggleLocalWatchlist = (index) => ({
  type: TOGGLE_LOCAL_WATCHLIST,
  index
})

export const renameLocalWatchlistFolder = (index, name) => ({
  type: RENAME_WATCHLIST_FOLDER,
  index,
  name
})

export const addLocalWatchlistFolder = (name) => ({
  type: ADD_WATCHLIST_FOLDER,
  name
})
///*
export const deleteLocalWatchlistFolder = (index) => ({
  type: DELETE_WATCHLIST_FOLDER,
  index
})
//*/
/*
 export const deleteLocalWatchlistFolder = (index) => (dispatch, getState) =>{
   let tempLocalWatchlists = getState().localReducer.localWatchlists.slice(0);
   for(let i=0; i<tempLocalWatchlists.length; i++ ){
     if(tempLocalWatchlists[i].name === "default"){
       tempLocalWatchlists[i].list = [...state.localWatchlists[i].list, ...state.localWatchlists[action.index].list ];
       break;
     }
   }
 }
*/

export const reorderLocalWatchlist = (listIndex, list) => ({
  type: REORDER_LOCAL_WATCHLIST,
  listIndex,
  list
})

export const reorderLocalWatchlists = (aI, bI) => ({
  type: REORDER_LOCAL_WATCHLISTS,
  aI, bI
})

export const addLocalWatchlists = lists => ({
  type: ADD_LOCAL_WATCHLISTS,
  lists
})

export const addLocalWatchlist = instrument => ({
  type: ADD_LOCAL_WATCHLIST,
  instrument
})

export const removeLocalWatchlist = instrumentId => ({
  type: REMOVE_LOCAL_WATCHLIST,
  instrumentId
})

//////////////////////////////////////////////////////////////////////////////
export const toggleLocalPosition = (index) => ({
  type: TOGGLE_LOCAL_POSITION,
  index
})

export const renameLocalPositionFolder = (index, name) => ({
  type: RENAME_POSITION_FOLDER,
  index,
  name
})

export const addLocalPositionFolder = (name) => ({
  type: ADD_POSITION_FOLDER,
  name
})

export const deleteLocalPositionFolder = (index) => ({
  type: DELETE_POSITION_FOLDER,
  index
})

export const reorderLocalPosition = (listIndex, list) => ({
  type: REORDER_LOCAL_POSITION,
  listIndex,
  list
})

export const reorderLocalPositions = (aI, bI) => ({
  type: REORDER_LOCAL_POSITIONS,
  aI, bI
})

export const addLocalPositions = lists => ({
  type: ADD_LOCAL_POSITIONS,
  lists
})

export const addLocalPosition = instrument => ({
  type: ADD_LOCAL_POSITION,
  instrument
})

export const removeLocalPosition = instrumentId => ({
  type: REMOVE_LOCAL_POSITION,
  instrumentId
})
