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

export const deleteInstrument = (instrumentUrl) => ({
  type: DELETE_INSTRUMENT,
  instrumentUrl
})

export const askInstrument = (instrument) => (dispatch, getState) => {
  dispatch(askingInstrument());
  return fetch(instrument, {
    method: 'GET',
    headers: new Headers({
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

export const cleanUpInstruments = () => (dispatch, getState) => {
  Object.keys(getState().instrumentsReducer.instruments).forEach((instrumentUrl) => {
    if(getState().tabsReducer.keys.indexOf(getState().instrumentsReducer.instruments[instrumentUrl].symbol) === -1) {
      dispatch(deleteInstrument(instrumentUrl));
    }
  });
}
