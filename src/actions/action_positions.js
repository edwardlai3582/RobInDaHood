import { askInstrument } from './action_instruments'

import { addLocalPositions, addMoreLocalPositions } from './action_local'
////////////POSITIONS
export const ADD_POSITIONS = 'ADD_POSITIONS'
export const ADD_MORE_POSITIONS = 'ADD_MORE_POSITIONS'
export const ADD_POSITION = 'ADD_POSITION'
export const ADD_POSITIONS_WITH_ZERO = 'ADD_POSITIONS_WITH_ZERO'
export const ADD_MORE_POSITIONS_WITH_ZERO = 'ADD_MORE_POSITIONS_WITH_ZERO'
export const DELETE_POSITIONS = 'DELETE_POSITIONS'
export const ASKING_POSITIONS = 'ASKING_POSITIONS'
export const ASKING_POSITIONS_FAILED = 'ASKING_POSITIONS_FAILED'

export const askingPositionsFailed = (error) => ({
  type: ASKING_POSITIONS_FAILED,
  error
})

export const askingPositions = () => ({
  type: ASKING_POSITIONS
})

export const addPositions = positions => ({
  type: ADD_POSITIONS,
  positions
})

export const addMorePositions = positions => ({
  type: ADD_MORE_POSITIONS,
  positions
})

export const deletePositions = () => ({
  type: DELETE_POSITIONS
})

export const askPositions = (...theArgs) => (dispatch, getState) => {
  let link = (theArgs.length === 0)? `https://api.robinhood.com/positions/?nonzero=true` : theArgs[0];
  dispatch(askingPositions());
  //searcg non zero
  return fetch(link, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    if(jsonResult.hasOwnProperty("results")){
      if(theArgs.length === 0){
        dispatch(addPositions(jsonResult.results));
        dispatch(addLocalPositions(jsonResult.results));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
            console.log("ask for positions");
          }
        });
      }
      else {
        console.log("more watchlists!")
        dispatch(addMorePositions(jsonResult.results));
        if( !jsonResult.next ){
          dispatch(addMoreLocalPositions([...getState().positionsReducer.positions, ...jsonResult.results]));
        }
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
            console.log("ask for positions");
          }
        });
      }

      if(jsonResult.next){
        dispatch(askPositions(jsonResult.next));
      }
    }
    else {
      //jsonResult[Object.keys(jsonResult)[0]][0])
      dispatch(askingPositionsFailed("QQ"));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingPositionsFailed(reason));
  });
}

export const addPosition = position => ({
  type: ADD_POSITION,
  position
})

export const askPosition = (url) => (dispatch, getState) => {
  //dispatch(askingPositions());
  //searcg non zero
  return fetch( url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    if(jsonResult.hasOwnProperty("quantity")){
      dispatch(addPosition(jsonResult));
    }
  })
  .catch(function(reason) {
    console.log(reason);
    //dispatch(askingPositionsFailed(reason));
  });
}

export const addPositionsWithZero = positions => ({
  type: ADD_POSITIONS_WITH_ZERO,
  positions
})

export const addMorePositionsWithZero = positions => ({
  type: ADD_MORE_POSITIONS_WITH_ZERO,
  positions
})

export const askPositionsWithZero = (...theArgs) => (dispatch, getState) => {
  let link = (theArgs.length === 0)? "https://api.robinhood.com/positions/" : theArgs[0];
  //searcg non zero
  return fetch(link, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    if(jsonResult.hasOwnProperty("results")){
      if(theArgs.length === 0){
        dispatch(addPositionsWithZero(jsonResult.results));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
            console.log("ask for positionsWithZero");
          }
        });
      }
      else {
        console.log("more PositionsWithZero!")
        dispatch(addMorePositionsWithZero(jsonResult.results));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
            console.log("ask for positionsWithZero");
          }
        });
      }

      if(jsonResult.next){
        dispatch(askPositionsWithZero(jsonResult.next));
      }
    }
    else {
      //jsonResult[Object.keys(jsonResult)[0]][0])
      //dispatch(askingPositionsFailed("QQ"));
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
