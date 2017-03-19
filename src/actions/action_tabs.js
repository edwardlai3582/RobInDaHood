////////////TABS
export const ADD_TAB = 'ADD_TAB'
export const DELETE_TAB = 'DELETE_TAB'
export const REORDER_TAB = 'REORDER_TAB'

export const addTab = (currentTab, currentTabs) => ({
  type: ADD_TAB,
  currentTab,
  currentTabs
})

export const deleteTab = (currentTabs) => ({
  type: DELETE_TAB,
  currentTabs
})

export const reorderTab = (currentTab, currentTabs) => ({
  type: REORDER_TAB,
  currentTab,
  currentTabs
})
