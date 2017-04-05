import { askQuote } from './action_quotes'
////////////INSTRUMENTS
export const ADD_INSTRUMENT = 'ADD_INSTRUMENT'
export const DELETE_INSTRUMENT = 'DELETE_INSTRUMENT'
export const ASKING_INSTRUMENT = 'ASKING_INSTRUMENT'
export const ASKING_INSTRUMENT_FAILED = 'ASKING_INSTRUMENT_FAILED'

export const askingInstrumentFailed = (error) => ({
  type: ASKING_INSTRUMENT_FAILED,
  error
})

export const askingInstrument = () => ({
  type: ASKING_INSTRUMENT
})

export const addInstrument = instrument => ({
  type: ADD_INSTRUMENT,
  instrument
})

export const deleteInstrument = (instrumentId) => ({
  type: DELETE_INSTRUMENT,
  instrumentId
})

export const askInstrument = (instrument) => (dispatch, getState) => {
  dispatch(askingInstrument());
  return fetch(instrument, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    //console.log(jsonResult);
    dispatch(addInstrument(jsonResult));
    dispatch(askQuote(jsonResult.symbol));
  })
  .catch(function(reason) {
    console.log(reason);
    dispatch(askingInstrumentFailed(reason));
  });
}
