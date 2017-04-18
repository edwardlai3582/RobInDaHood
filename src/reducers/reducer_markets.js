import * as actions from '../actions';

const marketsReducer = (state = {
  markets: {},
  marketsHours: {}
}, action) => {
  switch (action.type) {
    case actions.CLEAR_MARKETS_AND_MARKETSHOURS:
      return {
        markets: {},
        marketsHours: {}
      }
    case actions.ADD_MARKETSHOUR:
      console.log(action.marketshour);
      let newMarketsHours = Object.assign({}, state.marketsHours);
      newMarketsHours[action.todays_hours] = action.marketshour;
      return {
        ...state,
        marketsHours: newMarketsHours
      }
    case actions.ADD_MARKET:
      console.log(action.market);
      let newMarkets = Object.assign({}, state.markets);
      newMarkets[action.market.url] = action.market;
      return {
        ...state,
        markets: newMarkets
      }
    default:
      return state
  }
}

export default marketsReducer
