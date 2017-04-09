import {
  ADD_HIS_PORTFOLIOS, DELETE_HIS_PORTFOLIOS,
  ADD_PORTFOLIOS
} from '../actions'

const portfoliosReducer = (state = {
  portfolios: {},
  historicalsPortfolios: {},
}, action) => {
  switch (action.type) {
    case ADD_HIS_PORTFOLIOS:
      let newHistoricalsPortfolios = Object.assign({}, state.historicalsPortfolios);
      newHistoricalsPortfolios[action.hisType] = action.portfolios;
      return {
        ...state,
        historicalsPortfolios: newHistoricalsPortfolios
      }
    case DELETE_HIS_PORTFOLIOS:
      return {
        ...state,
        //instruments: [],
      }
      case ADD_PORTFOLIOS:
      //console.log(action.portfolios)
        return {
          ...state,
          portfolios: action.portfolios
        }
    default:
      return state
  }
}

export default portfoliosReducer
