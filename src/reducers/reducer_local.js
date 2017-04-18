import {
  REORDER_LOCAL_WATCHLISTS,
  REMOVE_LOCAL_WATCHLIST, REORDER_LOCAL_WATCHLIST, TOGGLE_LOCAL_WATCHLIST,
  ADD_WATCHLIST_FOLDER, DELETE_WATCHLIST_FOLDER, RENAME_WATCHLIST_FOLDER,
  CONCAT_LIST_TO_LOCAL_WATCHLIST,

  ADD_LOCAL_POSITIONS, REORDER_LOCAL_POSITIONS,
  ADD_LOCAL_POSITION, REMOVE_LOCAL_POSITION, REORDER_LOCAL_POSITION, TOGGLE_LOCAL_POSITION,
  ADD_POSITION_FOLDER, DELETE_POSITION_FOLDER, RENAME_POSITION_FOLDER,
} from '../actions'

const localReducer = (state = {
  localPositions: [],
  localWatchlists: []
}, action) => {
  switch (action.type) {
    case TOGGLE_LOCAL_WATCHLIST:
      let tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.index].open = !state.localWatchlists[action.index].open;
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case RENAME_WATCHLIST_FOLDER:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.index].name = action.name;
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case ADD_WATCHLIST_FOLDER:
      return {
        ...state,
        localWatchlists: [...state.localWatchlists, { name: action.name, open: false, list: action.list }]
      }
    case CONCAT_LIST_TO_LOCAL_WATCHLIST :
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.index].list = tempLocalWatchlists[action.index].list.concat(action.list);
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case DELETE_WATCHLIST_FOLDER:
      return {
        ...state,
        localWatchlists: [
          ...state.localWatchlists.slice(0, action.index),
          ...state.localWatchlists.slice(action.index + 1)
        ]
      }
    case REMOVE_LOCAL_WATCHLIST:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.listIndex].list = [
        ...tempLocalWatchlists[action.listIndex].list.slice(0, action.instrumentIndex),
        ...tempLocalWatchlists[action.listIndex].list.slice(action.instrumentIndex+1)
      ];
      return {
        ...state,
        localWatchlists: tempLocalWatchlists,
      }
    case REORDER_LOCAL_WATCHLIST:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.listIndex].list = action.list;
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case REORDER_LOCAL_WATCHLISTS:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      let firstItem = tempLocalWatchlists[action.aI];
      tempLocalWatchlists[action.aI] = state.localWatchlists[action.bI];
      tempLocalWatchlists[action.bI] = firstItem;

      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
//////////////////////////////////////////////////////////////////////////////////////////////////
  case TOGGLE_LOCAL_POSITION:
    let tempLocalPositions = state.localPositions.slice(0);
    tempLocalPositions[action.index].open = !state.localPositions[action.index].open
    return {
      ...state,
      localPositions: tempLocalPositions
    }
  case RENAME_POSITION_FOLDER:
    tempLocalPositions = state.localPositions.slice(0);
    tempLocalPositions[action.index].name = action.name;
    return {
      ...state,
      localPositions: tempLocalPositions
    }
  case ADD_POSITION_FOLDER:
    return {
      ...state,
      localPositions: [...state.localPositions, {name: action.name, open: false, list: action.list }]
    }
  case DELETE_POSITION_FOLDER:
    tempLocalPositions = state.localPositions.slice(0);
    for(let i=0; i<tempLocalPositions.length; i++ ){
      if(tempLocalPositions[i].name === "default"){
        tempLocalPositions[i].list = [...state.localPositions[i].list, ...state.localPositions[action.index].list ];
        break;
      }
    }
    tempLocalPositions.splice(action.index, 1);
    return {
      ...state,
      localPositions: tempLocalPositions
    }
  case ADD_LOCAL_POSITIONS:
    tempLocalPositions = state.localPositions.slice(0);
    let temp = [];
    if(tempLocalPositions.length === 0){
      let defaultPosition = {};
      defaultPosition.name = "default";
      defaultPosition.open = false;
      defaultPosition.list = action.lists;
      tempLocalPositions.push(defaultPosition);
    }
    else {
      //add not_on_local to local_default
      action.lists.forEach((instrument)=>{
        let found = false;
        state.localPositions.forEach((list) => {
          if(found) return;
          for(let i=0; i<list.list.length; i++){
            if(list.list[i] === instrument){
              found =true;
              return;
            }
          }
        });
        if(!found){
          temp.push(instrument);
        }
      });

      for(let i=0; i<tempLocalPositions.length; i++ ){
        if(tempLocalPositions[i].name === "default"){
          tempLocalPositions[i].list = tempLocalPositions[i].list.concat(temp);
          break;
        }
      }

      //remove not_on_database from local_default
      for(let i=0; i<tempLocalPositions.length; i++ ){
        let temp = [];
        for(let j=0; j<tempLocalPositions[i].list.length; j++){
          for(let z=0; z<action.lists.length; z++){
            if(action.lists[z] === tempLocalPositions[i].list[j]){
              temp.push(tempLocalPositions[i].list[j]);
              break;
            }
          }
        }
        tempLocalPositions[i].list = temp;
      }
    }
    return {
      ...state,
      localPositions: tempLocalPositions
    }
  case ADD_LOCAL_POSITION:
    tempLocalPositions = state.localPositions.slice(0);
    if(tempLocalPositions.length === 0){
      let defaultPosition = {};
      defaultPosition.name = "default";
      defaultPosition.list = [];
      tempLocalPositions.push(defaultPosition);
    }

    for(let i=0; i<tempLocalPositions.length; i++ ){
      if(tempLocalPositions[i].name === "default"){
        tempLocalPositions[i].list.push(action.instrument);
        break;
      }
    }

    return {
      ...state,
      localPositions: tempLocalPositions
    }
  case REMOVE_LOCAL_POSITION:
    tempLocalPositions = state.localPositions.slice(0);
    let instrumentLink = `https://api.robinhood.com/instruments/${action.instrumentId}/`;
    let found = false;
    let foundIndex = -1;

    tempLocalPositions.forEach((list) => {
      if(found) return;
      for(let i=0; i<list.list.length; i++){
        if(list.list[i] === instrumentLink){
          console.log("found! from local");
          found = true;
          foundIndex = i;
          break;
        }
      }
      list.list = [...list.list.slice(0, foundIndex), ...list.list.slice(foundIndex+1)];
    });

    return {
      ...state,
      localPositions: tempLocalPositions,
    }
  case REORDER_LOCAL_POSITION:
    tempLocalPositions = state.localPositions.slice(0);
    tempLocalPositions[action.listIndex].list = action.list;
    return {
      ...state,
      localPositions: tempLocalPositions
    }
  case REORDER_LOCAL_POSITIONS:
    tempLocalPositions = state.localPositions.slice(0);
    firstItem = tempLocalPositions[action.aI];
    tempLocalPositions[action.aI] = state.localPositions[action.bI];
    tempLocalPositions[action.bI] = firstItem;

    return {
      ...state,
      localPositions: tempLocalPositions
    }
//////////////////////////////////////////////////////////////////////////////////////////////////
    default:
      return state
  }
}

export default localReducer
