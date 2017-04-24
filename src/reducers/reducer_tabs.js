import * as actions from '../actions';

const NOTABKEY = "noTAbKey"

const tabsReducer = (state = {
  selectedKey: NOTABKEY,
  keys: [],
  tabs: {}
}, action) => {
  switch (action.type) {
    case actions.TABS_DELETE_ALL:
      return {
        selectedKey: NOTABKEY,
        keys: [],
        tabs: {}
      }      
    case actions.TAB_ADD:
      let tempTabObject = {};
      tempTabObject[action.currentKey] = action.newTab;
      return {
        ...state,
        selectedKey: action.currentKey,
        keys: state.keys.concat(action.currentKey),
        tabs: Object.assign({}, state.tabs, tempTabObject)
      }
    case actions.TAB_DELETE:
      let newTabs = Object.assign({}, state.tabs);
      delete newTabs[action.deletedKey]
      let realKey = (action.currentKeys.length===0)? NOTABKEY : state.selectedKey;
      return {
        ...state,
        selectedKey: realKey,
        keys: action.currentKeys,
        tabs: newTabs
      }
    case actions.TAB_SELECT:
      let newSelectedKey = action.currentKey || NOTABKEY;
      return {
        ...state,
        selectedKey: newSelectedKey
      }
    case actions.TAB_REORDER:
      return {
        ...state,
        keys: action.currentKeys
      }
    default:
      return state
  }
}

export default tabsReducer

/*
key = data.symbol
newTab = {
  key: key,
  title: data.symbol,
  instrument: data.instrument,
  type: data.type
}
*/
