import {
  ADD_TAB, DELETE_TAB, REORDER_TAB
} from '../actions'

const tabsReducer = (state = {
  selectedTab: "",
  tabs: []
}, action) => {
  switch (action.type) {
    case ADD_TAB:
    console.log(action.currentTabs)
      return {
        ...state,
        selectedTab: action.currentTab,
        tabs: action.currentTabs
      }
    case DELETE_TAB:
      return {
        ...state,
        tabs: action.currentTabs
      }
    case REORDER_TAB:
      return {
        ...state,
        selectedTab: action.currentTab,
        tabs: action.currentTabs
      }
    default:
      return state
  }
}

export default tabsReducer
