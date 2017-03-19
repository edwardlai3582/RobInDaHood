////////////TABS
export const ADD_TAB = 'ADD_TAB'
export const DELETE_TAB = 'DELETE_TAB'
export const SELECT_TAB = 'SELECT_TAB'
export const REORDER_TAB = 'REORDER_TAB'

export const addTab = (currentKey, newTab) => ({
  type: ADD_TAB,
  currentKey,
  newTab
})

export const deleteTab = (deletedKey, currentKeys) => ({
  type: DELETE_TAB,
  deletedKey,
  currentKeys
})

export const selectTab = (currentKey) => ({
  type: SELECT_TAB,
  currentKey
})

export const reorderTab = (currentKeys) => ({
  type: REORDER_TAB,
  currentKeys
})
