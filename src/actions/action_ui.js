////////////UI
export const TOGGLE_WATCHLISTS_MODULE = 'TOGGLE_WATCHLISTS_MODULE'
export const TOGGLE_POSITIONS_MODULE = 'TOGGLE_POSITIONS_MODULE'
export const RESET_BOTH_MODULE = 'RESET_BOTH_MODULE'

export const resetModule = () => ({
  type: RESET_BOTH_MODULE
})

export const toggleWatchlistsModule = () => ({
  type: TOGGLE_WATCHLISTS_MODULE
})

export const togglePositionsModule = () => ({
  type: TOGGLE_POSITIONS_MODULE
})
