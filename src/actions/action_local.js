////////////LOCAL
export const ADD_LOCAL_WATCHLISTS = 'ADD_LOCAL_WATCHLISTS'
export const ADD_LOCAL_WATCHLIST = 'ADD_LOCAL_WATCHLIST'
export const REMOVE_LOCAL_WATCHLIST = 'REMOVE_LOCAL_WATCHLIST'
export const REORDER_LOCAL_WATCHLIST = 'REORDER_LOCAL_WATCHLIST'
export const REORDER_LOCAL_WATCHLISTS = 'REORDER_LOCAL_WATCHLISTS'
export const ADD_WATCHLIST_FOLDER = 'ADD_WATCHLIST_FOLDER'
export const TOGGLE_LOCAL_WATCHLIST = 'TOGGLE_LOCAL_WATCHLIST'

export const toggleLocalWatchlist = (index) => ({
  type: TOGGLE_LOCAL_WATCHLIST,
  index
})

export const addLocalWatchlistFolder = (name) => ({
  type: ADD_WATCHLIST_FOLDER,
  name
})

export const reorderLocalWatchlist = (watchlistIndex, watchlist) => ({
  type: REORDER_LOCAL_WATCHLIST,
  watchlistIndex,
  watchlist
})

export const reorderLocalWatchlists = (aI, bI) => ({
  type: REORDER_LOCAL_WATCHLISTS,
  aI, bI
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
