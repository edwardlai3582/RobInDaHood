////////////LOCAL
export const REMOVE_LOCAL_WATCHLIST = 'REMOVE_LOCAL_WATCHLIST'
export const REORDER_LOCAL_WATCHLIST = 'REORDER_LOCAL_WATCHLIST'
export const REORDER_LOCAL_WATCHLISTS = 'REORDER_LOCAL_WATCHLISTS'
export const ADD_WATCHLIST_FOLDER = 'ADD_WATCHLIST_FOLDER'
export const DELETE_WATCHLIST_FOLDER = 'DELETE_WATCHLIST_FOLDER'
export const RENAME_WATCHLIST_FOLDER = 'RENAME_WATCHLIST_FOLDER'
export const TOGGLE_LOCAL_WATCHLIST = 'TOGGLE_LOCAL_WATCHLIST'
export const CONCAT_LIST_TO_LOCAL_WATCHLIST = 'CONCAT_LIST_TO_LOCAL_WATCHLIST'

export const REMOVE_LOCAL_POSITION = 'REMOVE_LOCAL_POSITION'
export const REORDER_LOCAL_POSITION = 'REORDER_LOCAL_POSITION'
export const REORDER_LOCAL_POSITIONS = 'REORDER_LOCAL_POSITIONS'
export const ADD_POSITION_FOLDER = 'ADD_POSITION_FOLDER'
export const DELETE_POSITION_FOLDER = 'DELETE_POSITION_FOLDER'
export const RENAME_POSITION_FOLDER = 'RENAME_POSITION_FOLDER'
export const TOGGLE_LOCAL_POSITION = 'TOGGLE_LOCAL_POSITION'
export const CONCAT_LIST_TO_LOCAL_POSITION = 'CONCAT_LIST_TO_LOCAL_POSITION'

export const toggleLocalWatchlist = (index) => ({
  type: TOGGLE_LOCAL_WATCHLIST,
  index
})

export const renameLocalWatchlistFolder = (index, name) => ({
  type: RENAME_WATCHLIST_FOLDER,
  index,
  name
})

export const addLocalWatchlistFolder = (name, list) => ({
  type: ADD_WATCHLIST_FOLDER,
  name,
  list
})

export const reorderLocalWatchlist = (listIndex, list) => ({
  type: REORDER_LOCAL_WATCHLIST,
  listIndex,
  list
})

export const addLocalWatchlists = (instruments) => (dispatch, getState) => {
  let tempLocalWatchlists = getState().localReducer.localWatchlists.slice(0);
  let notInLocal = [];

  if(tempLocalWatchlists.length === 0) {
    dispatch(addLocalWatchlistFolder("default", instruments));
  }
  else {
    instruments.forEach((instrument) => {
      let found = false;
      tempLocalWatchlists.forEach((list) => {
        if(found) return;
        if(list.list.indexOf(instrument) !== -1) {
          found =true;
        }
      });
      if(!found){
        notInLocal.push(instrument);
      }
    });

    for(let i=0; i<tempLocalWatchlists.length; i++ ){
      if(tempLocalWatchlists[i].name === "default"){
        tempLocalWatchlists[i].list = tempLocalWatchlists[i].list.concat(notInLocal);
        break;
      }
    }
    //remove not_on_database from local_default
    for(let i=0; i<tempLocalWatchlists.length; i++ ){
      let tempInstruments = [];
      for(let j=0; j<tempLocalWatchlists[i].list.length; j++){
        if(instruments.indexOf(tempLocalWatchlists[i].list[j]) !== -1) {
          tempInstruments.push(tempLocalWatchlists[i].list[j]);
        }
      }
      dispatch(reorderLocalWatchlist(i, tempInstruments));
    }
  }
}

export const concatListToWatchList = ( index, list ) => ({
  type: CONCAT_LIST_TO_LOCAL_WATCHLIST,
  index,
  list
})

export const removeLocalWatchlistFolder = (index) => ({
  type: DELETE_WATCHLIST_FOLDER,
  index
})

export const deleteLocalWatchlistFolder = (index) => (dispatch, getState) => {
  let tempLocalWatchlists = getState().localReducer.localWatchlists.slice(0);
  let deaultIndex = 0;
  for(let i=0; i<tempLocalWatchlists.length; i++ ){
    if(tempLocalWatchlists[i].name === "default"){
      deaultIndex = i;
      break;
    }
  }
  dispatch(concatListToWatchList(deaultIndex, getState().localReducer.localWatchlists[index].list));
  dispatch(removeLocalWatchlistFolder(index));
}

export const reorderLocalWatchlists = (aI, bI) => ({
  type: REORDER_LOCAL_WATCHLISTS,
  aI, bI
})

export const addLocalWatchlist = (instrument) => (dispatch, getState) => {
  let tempLocalWatchlists = getState().localReducer.localWatchlists.slice(0);
  if(tempLocalWatchlists.length === 0) {
    dispatch(addLocalWatchlistFolder("default", [instrument]));
  }
  else{
    for(let i=0; i<tempLocalWatchlists.length; i++ ){
      if(tempLocalWatchlists[i].name === "default"){
        dispatch(concatListToWatchList(i, [instrument]));
        return;
      }
    }
  }
}

export const removeInstrumentInLocalWatchlist = (listIndex, instrumentIndex) => ({
  type: REMOVE_LOCAL_WATCHLIST,
  listIndex,
  instrumentIndex
})

export const removeLocalWatchlist = (instrumentId) => (dispatch, getState) => {
  let tempLocalWatchlists = getState().localReducer.localWatchlists.slice(0);
  let instrument = `https://api.robinhood.com/instruments/${instrumentId}/`;
  let found = false;
  let listIndex = -1;
  let instrumentIndex = -1;

  tempLocalWatchlists.forEach((list, index) => {
    if(found) return;
    instrumentIndex = list.list.indexOf(instrument);
    if(instrumentIndex !== -1) {
      found = true;
      listIndex = index;
    }
  });

  if(found) {
    dispatch(removeInstrumentInLocalWatchlist(listIndex, instrumentIndex));
  }
}

//////////////////////////////////////////////////////////////////////////////
export const toggleLocalPosition = (index) => ({
  type: TOGGLE_LOCAL_POSITION,
  index
})

export const renameLocalPositionFolder = (index, name) => ({
  type: RENAME_POSITION_FOLDER,
  index,
  name
})

export const addLocalPositionFolder = (name, list) => ({
  type: ADD_POSITION_FOLDER,
  name,
  list
})

export const reorderLocalPosition = (listIndex, list) => ({
  type: REORDER_LOCAL_POSITION,
  listIndex,
  list
})

export const concatListToPosition = ( index, list ) => ({
  type: CONCAT_LIST_TO_LOCAL_POSITION,
  index,
  list
})

export const removeLocalPositionFolder = (index) => ({
  type: DELETE_POSITION_FOLDER,
  index
})

export const deleteLocalPositionFolder = (index) => (dispatch, getState) => {
  let tempLocalPositions = getState().localReducer.localPositions.slice(0);
  let deaultIndex = 0;
  for(let i=0; i<tempLocalPositions.length; i++ ){
    if(tempLocalPositions[i].name === "default"){
      deaultIndex = i;
      break;
    }
  }
  dispatch(concatListToPosition(deaultIndex, getState().localReducer.localPositions[index].list));
  dispatch(removeLocalPositionFolder(index));
}

export const reorderLocalPositions = (aI, bI) => ({
  type: REORDER_LOCAL_POSITIONS,
  aI, bI
})

export const addLocalPositions = (instruments) => (dispatch, getState) => {
  let tempLocalPositions = getState().localReducer.localPositions.slice(0);
  let notInLocal = [];

  if(tempLocalPositions.length === 0) {
    dispatch(addLocalPositionFolder("default", instruments));
  }
  else {
    instruments.forEach((instrument) => {
      let found = false;
      tempLocalPositions.forEach((list) => {
        if(found) return;
        if(list.list.indexOf(instrument) !== -1) {
          found =true;
        }
      });
      if(!found){
        notInLocal.push(instrument);
      }
    });

    for(let i=0; i<tempLocalPositions.length; i++ ){
      if(tempLocalPositions[i].name === "default"){
        tempLocalPositions[i].list = tempLocalPositions[i].list.concat(notInLocal);
        break;
      }
    }
    //remove not_on_database from local_default
    for(let i=0; i<tempLocalPositions.length; i++ ){
      let tempInstruments = [];
      for(let j=0; j<tempLocalPositions[i].list.length; j++){
        if(instruments.indexOf(tempLocalPositions[i].list[j]) !== -1) {
          tempInstruments.push(tempLocalPositions[i].list[j]);
        }
      }
      dispatch(reorderLocalPosition(i, tempInstruments));
    }
  }
}

export const addLocalPosition = (instrument) => (dispatch, getState) => {
  let tempLocalPositions = getState().localReducer.localPositions.slice(0);
  if(tempLocalPositions.length === 0) {
    dispatch(addLocalPositionFolder("default", [instrument]));
  }
  else{
    for(let i=0; i<tempLocalPositions.length; i++ ){
      if(tempLocalPositions[i].name === "default"){
        dispatch(concatListToPosition(i, [instrument]));
        return;
      }
    }
  }
}

export const removeInstrumentInLocalPosition = (listIndex, instrumentIndex) => ({
  type: REMOVE_LOCAL_POSITION,
  listIndex,
  instrumentIndex
})

export const removeLocalPosition = (instrumentId) => (dispatch, getState) => {
  let tempLocalPositions = getState().localReducer.localPositions.slice(0);
  let instrument = `https://api.robinhood.com/instruments/${instrumentId}/`;
  let found = false;
  let listIndex = -1;
  let instrumentIndex = -1;

  tempLocalPositions.forEach((list, index) => {
    if(found) return;
    instrumentIndex = list.list.indexOf(instrument);
    if(instrumentIndex !== -1) {
      found = true;
      listIndex = index;
    }
  });

  if(found) {
    dispatch(removeInstrumentInLocalPosition(listIndex, instrumentIndex));
  }
}
