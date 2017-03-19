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

      if(action.currentKeys.length===0){
        return {
          selectedKey: "noTAbKey",
          keys: action.currentKeys,
          tabs: newTabs
        }
      }
      else{
        return {
          ...state,
          keys: action.currentKeys,
          tabs: newTabs
        }
      }
    case SELECT_TAB:
      return {
        ...state,
        selectedKey: action.currentKey
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
