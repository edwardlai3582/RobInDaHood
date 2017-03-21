import {
  ADD_TAB, DELETE_TAB, REORDER_TAB, SELECT_TAB
} from '../actions'

const tabsReducer = (state = {
  selectedKey: "noTAbKey",
  keys: [],
  tabs: {}
}, action) => {
  switch (action.type) {
    case ADD_TAB:
      let tempTabObject = {};
      tempTabObject[action.currentKey] = action.newTab;
      return {
        ...state,
        selectedKey: action.currentKey,
        keys: state.keys.concat(action.currentKey),
        tabs: Object.assign(state.tabs, tempTabObject)
      }
    case DELETE_TAB:
      let newTabs = Object.assign({}, state.tabs);
      delete newTabs[action.deletedKey]
      let realKey = (action.currentKeys.length===0)? "noTAbKey" : state.selectedKey;
      return {
        ...state,
        selectedKey: realKey,
        keys: action.currentKeys,
        tabs: newTabs
      }
    case SELECT_TAB:
      let newSelectedKey = action.currentKey || "noTAbKey";
      return {
        ...state,
        selectedKey: newSelectedKey
      }
    case REORDER_TAB:
      return {
        ...state,
        keys: action.currentKeys
      }
    default:
      return state
  }
}

export default tabsReducer
