import {
  ADD_INSTRUMENT, DELETE_INSTRUMENT, ASKING_INSTRUMENT, ASKING_INSTRUMENT_FAILED
} from '../actions'

const instrumentsReducer = (state = {
  instruments: {}
}, action) => {
  switch (action.type) {
    case ASKING_INSTRUMENT:
      return {
        ...state
      }
    case ASKING_INSTRUMENT_FAILED:
      console.log(action.error)
      return {
        ...state
      }
    case ADD_INSTRUMENT:
    console.log("ADD_INSTRUMENT");
      let newInstruments = Object.assign({}, state.instruments);
      newInstruments[action.instrument.url] = action.instrument;
      return {
        ...state,
        instruments: newInstruments
      }
    case DELETE_INSTRUMENT:
      let newDeletedInstruments = Object.assign({}, state.instruments);
      delete newDeletedInstruments[action.instrumentId];
      return {
        ...state,
        instruments: newDeletedInstruments,
      }
    default:
      return state
  }
}

export default instrumentsReducer
