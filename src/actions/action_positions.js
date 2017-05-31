import { askInstrument } from './action_instruments'

import { addLocalPositions } from './action_local'
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
    if(jsonResult.hasOwnProperty("results")){
      if(theArgs.length === 0){
        dispatch(addPositions(jsonResult.results));
        dispatch(addLocalPositions(jsonResult.results.filter((position) => {
          //if quantity = 0 dont show
          return ( Number(position.quantity) > 0 );
        }).map((position)=>{
          return position.instrument;
        })));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
          }
        });
      }
      else {
        console.log("more watchlists!")
        dispatch(addMorePositions(jsonResult.results));
        if( !jsonResult.next ){
          dispatch(addLocalPositions([...getState().positionsReducer.positions, ...jsonResult.results].map((position)=>{
            return position.instrument;
          })));
        }
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
          }
        });
      }

      if(jsonResult.next){
        dispatch(askPositions(jsonResult.next));
      }
    }
    else {
      dispatch(askingPositionsFailed("something not right"));
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
    if(jsonResult.hasOwnProperty("quantity")){
      dispatch(addPosition(jsonResult));
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}

export const askPositionWithInstrument = (instrument) => (dispatch, getState) => {
  let url = `https://api.robinhood.com/positions/${getState().accountReducer.accountNumber}/${getState().instrumentsReducer.instruments[instrument].id}`;

  return fetch( url, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    if(jsonResult.hasOwnProperty("quantity")){
      dispatch(addPosition(jsonResult));
    }
  })
  .catch(function(reason) {
    console.log(reason);
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
    if(jsonResult.hasOwnProperty("results")){
      if(theArgs.length === 0){
        dispatch(addPositionsWithZero(jsonResult.results));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
          }
        });
      }
      else {
        console.log("more PositionsWithZero!")
        dispatch(addMorePositionsWithZero(jsonResult.results));
        jsonResult.results.forEach((instrument)=>{
          if(!getState().instrumentsReducer.instruments[instrument.instrument]){
            dispatch(askInstrument(instrument.instrument));
          }
        });
      }

      if(jsonResult.next){
        dispatch(askPositionsWithZero(jsonResult.next));
      }
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
