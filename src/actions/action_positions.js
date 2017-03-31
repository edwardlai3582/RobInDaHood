////////////POSITIONS
export const ADD_POSITIONS = 'ADD_POSITIONS'
export const ADD_POSITION = 'ADD_POSITION'
export const ADD_POSITIONS_WITH_ZERO = 'ADD_POSITIONS_WITH_ZERO'
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

export const deletePositions = () => ({
  type: DELETE_POSITIONS
})

export const askPositions = () => (dispatch, getState) => {
  dispatch(askingPositions());
  //searcg non zero
  return fetch(`https://api.robinhood.com/positions/?nonzero=true`, {
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
      dispatch(addPositions(jsonResult.results));
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

export const askPositionsWithZero = () => (dispatch, getState) => {

  //searcg non zero
  return fetch(`https://api.robinhood.com/positions/`, {
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
      dispatch(addPositionsWithZero(jsonResult.results));
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
