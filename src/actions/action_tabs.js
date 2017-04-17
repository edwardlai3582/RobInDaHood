////////////TABS
export const TAB_ADD = 'TAB_ADD'
export const TAB_DELETE = 'TAB_DELETE'
export const TAB_SELECT = 'TAB_SELECT'
export const TAB_REORDER = 'TAB_REORDER'

export const addTab = (currentKey, newTab) => ({
  type: TAB_ADD,
  currentKey,
  newTab
})

export const deleteTab = (deletedKey, currentKeys) => ({
  type: TAB_DELETE,
  deletedKey,
  currentKeys
})

export const selectTab = (currentKey) => ({
  type: TAB_SELECT,
  currentKey
})

export const reorderTab = (currentKeys) => ({
  type: TAB_REORDER,
  currentKeys
})
