import {
  ADD_LOCAL_WATCHLISTS, REORDER_LOCAL_WATCHLISTS,
  ADD_LOCAL_WATCHLIST, REMOVE_LOCAL_WATCHLIST, REORDER_LOCAL_WATCHLIST, TOGGLE_LOCAL_WATCHLIST,
  ADD_WATCHLIST_FOLDER, DELETE_WATCHLIST_FOLDER, RENAME_WATCHLIST_FOLDER,

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
      tempLocalWatchlists[action.index].open = !state.localWatchlists[action.index].open
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
        localWatchlists: [...state.localWatchlists, {name: action.name, open: false, list:[]}]
      }
    case DELETE_WATCHLIST_FOLDER:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      for(let i=0; i<tempLocalWatchlists.length; i++ ){
        if(tempLocalWatchlists[i].name === "default"){
          tempLocalWatchlists[i].list = [...state.localWatchlists[i].list, ...state.localWatchlists[action.index].list ];
          break;
        }
      }
      tempLocalWatchlists.splice(action.index, 1);
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case ADD_LOCAL_WATCHLISTS:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      let temp = [];
      if(tempLocalWatchlists.length === 0){
        let defaultWatchlist = {};
        defaultWatchlist.name = "default";
        defaultWatchlist.open = false;
        defaultWatchlist.list = action.lists;
        tempLocalWatchlists.push(defaultWatchlist);
      }
      else {
        //add not_on_local to local_default
        action.lists.forEach((instrument)=>{
          let found = false;
          state.localWatchlists.forEach((list) => {
            if(found) return;
            for(let i=0; i<list.list.length; i++){
              if(list.list[i].instrument === instrument.instrument){
                found =true;
                return;
              }
            }
          });
          if(!found){
            temp.push(instrument);
          }
        });

        for(let i=0; i<tempLocalWatchlists.length; i++ ){
          if(tempLocalWatchlists[i].name === "default"){
            tempLocalWatchlists[i].list = tempLocalWatchlists[i].list.concat(temp);
            break;
          }
        }

        //remove not_on_database from local_default
        for(let i=0; i<tempLocalWatchlists.length; i++ ){
          let temp = [];
          for(let j=0; j<tempLocalWatchlists[i].list.length; j++){
            for(let z=0; z<action.lists.length; z++){
              if(action.lists[z].instrument === tempLocalWatchlists[i].list[j].instrument){
                temp.push(tempLocalWatchlists[i].list[j]);
                break;
              }
            }
          }
          tempLocalWatchlists[i].list = temp;
        }
      }
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case ADD_LOCAL_WATCHLIST:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      if(tempLocalWatchlists.length === 0){
        let defaultWatchlist = {};
        defaultWatchlist.name = "default";
        defaultWatchlist.list = [];
        tempLocalWatchlists.push(defaultWatchlist);
      }

      for(let i=0; i<tempLocalWatchlists.length; i++ ){
        if(tempLocalWatchlists[i].name === "default"){
          tempLocalWatchlists[i].list.push(action.list);
          break;
        }
      }

      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case REMOVE_LOCAL_WATCHLIST:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      let instrumentLink = `https://api.robinhood.com/instruments/${action.instrumentId}/`;
      let found = false;
      let foundIndex = -1;

      tempLocalWatchlists.forEach((list) => {
        if(found) return;
        for(let i=0; i<list.list.length; i++){
          if(list.list[i].instrument === instrumentLink){
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
      localPositions: [...state.localPositions, {name: action.name, open: false, list:[]}]
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
    temp = [];
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
            if(list.list[i].instrument === instrument.instrument){
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
            if(action.lists[z].instrument === tempLocalPositions[i].list[j].instrument){
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
        tempLocalPositions[i].list.push(action.list);
        break;
      }
    }

    return {
      ...state,
      localPositions: tempLocalPositions
    }
  case REMOVE_LOCAL_POSITION:
    tempLocalPositions = state.localPositions.slice(0);
    instrumentLink = `https://api.robinhood.com/instruments/${action.instrumentId}/`;
    found = false;
    foundIndex = -1;

    tempLocalPositions.forEach((list) => {
      if(found) return;
      for(let i=0; i<list.list.length; i++){
        if(list.list[i].instrument === instrumentLink){
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
