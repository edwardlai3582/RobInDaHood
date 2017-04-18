import * as actions from '../actions';

const instrumentsReducer = (state = {
  instruments: {}
}, action) => {
  switch (action.type) {
    case actions.ASKING_INSTRUMENT:
      return {
        ...state
      }
    case actions.ASKING_INSTRUMENT_FAILED:
      console.log(action.error)
      return {
        ...state
      }
    case actions.ADD_INSTRUMENT:
      console.log("ADD_INSTRUMENT");
      let newInstruments = Object.assign({}, state.instruments);
      newInstruments[action.instrument.url] = action.instrument;
      return {
        ...state,
        instruments: newInstruments
      }
    case actions.DELETE_INSTRUMENT:
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
