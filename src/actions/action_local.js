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

export const deleteLocalWatchlistFolder = (index) => ({
  type: DELETE_WATCHLIST_FOLDER,
  index
})

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

export const addLocalWatchlist = list => ({
  type: ADD_LOCAL_WATCHLIST,
  list
})

export const removeLocalWatchlist = instrumentId => ({
  type: REMOVE_LOCAL_WATCHLIST,
  instrumentId
})
