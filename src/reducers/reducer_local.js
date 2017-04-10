import {
  ADD_LOCAL_WATCHLISTS, ADD_LOCAL_WATCHLIST, REMOVE_LOCAL_WATCHLIST, REORDER_LOCAL_WATCHLIST, ADD_WATCHLIST_FOLDER

} from '../actions'

const localReducer = (state = {
  localPositions: [],
  localWatchlists: []
}, action) => {
  switch (action.type) {
    case ADD_WATCHLIST_FOLDER:
      return {
        ...state,
        localWatchlists: [...state.localWatchlists, {name: action.name, watchlist:[]}]
      }
    case REORDER_LOCAL_WATCHLIST:
    console.log("dddd");
      let tempLocalWatchlists = state.localWatchlists.slice(0);
      tempLocalWatchlists[action.index].watchlist = action.watchlist;
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
        defaultWatchlist.watchlist = action.watchlists;
        tempLocalWatchlists.push(defaultWatchlist);
      }
      else {
        //add not_on_local to local_default
        action.watchlists.forEach((instrument)=>{
          let found = false;
          state.localWatchlists.forEach((watchlist) => {
            if(found) return;
            for(let i=0; i<watchlist.watchlist.length; i++){
              if(watchlist.watchlist[i].instrument === instrument.instrument){
                found =true;
                return;
              }
            }
          });
          if(!found){
            temp.push(instrument);
          }
        });
        tempLocalWatchlists[0].watchlist = tempLocalWatchlists[0].watchlist.concat(temp);

        //remove not_on_database from local_default
        for(let i=0; i<tempLocalWatchlists.length; i++ ){
          let temp = [];
          for(let j=0; j<tempLocalWatchlists[i].watchlist.length; j++){
            for(let z=0; z<action.watchlists.length; z++){
              if(action.watchlists[z].instrument === tempLocalWatchlists[i].watchlist[j].instrument){
                temp.push(tempLocalWatchlists[i].watchlist[j]);
                break;
              }
            }
          }
          tempLocalWatchlists[i].watchlist = temp;
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
        defaultWatchlist.watchlist = [];
        tempLocalWatchlists.push(defaultWatchlist);
      }
      tempLocalWatchlists[0].watchlist.push(action.watchlist);
      return {
        ...state,
        localWatchlists: tempLocalWatchlists
      }
    case REMOVE_LOCAL_WATCHLIST:
      tempLocalWatchlists = state.localWatchlists.slice(0);
      let instrumentLink = `https://api.robinhood.com/instruments/${action.instrumentId}/`;
      let found = false;
      let foundIndex = -1;

      tempLocalWatchlists.forEach((watchlist) => {
        if(found) return;
        for(let i=0; i<watchlist.watchlist.length; i++){
          if(watchlist.watchlist[i].instrument === instrumentLink){
            console.log("found! from local");
            found = true;
            foundIndex = i;
            break;
          }
        }
        watchlist.watchlist = [...watchlist.watchlist.slice(0, foundIndex), ...watchlist.watchlist.slice(foundIndex+1)];
      });

      return {
        ...state,
        localWatchlists: tempLocalWatchlists,
      }
    default:
      return state
  }
}

export default localReducer
