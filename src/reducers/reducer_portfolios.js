import * as actions from '../actions';

const portfoliosReducer = (state = {
  quotes: {
    span: 'day',
    interval: '5minute',
    bounds: 'trading'
  },
  selectedButton: '1D',
  portfolios: {},
  historicalsPortfolios: {},
}, action) => {
  switch (action.type) {

    case actions.PORTFOLIO_PAGE_SET_SELECTED_BUTTON:
      return Object.assign({}, state, {
        selectedButton: action.selectedButton
      });

    case actions.PORTFOLIO_PAGE_UPDATE_QUOTES:
      return Object.assign({}, state, {
        quotes: action.quotes
      });

    case actions.ADD_HIS_PORTFOLIOS:
      let newHistoricalsPortfolios = Object.assign({}, state.historicalsPortfolios);
      newHistoricalsPortfolios[action.hisType] = action.portfolios;
      return {
        ...state,
        historicalsPortfolios: newHistoricalsPortfolios
      }

    case actions.DELETE_HIS_PORTFOLIOS:
      return {
        ...state,
      }

    case actions.ADD_PORTFOLIOS:
      return {
        ...state,
        portfolios: action.portfolios
      }
    default:
      return state
  }
}

export default portfoliosReducer
