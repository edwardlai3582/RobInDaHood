import {
  ADD_MARKET,
  ADD_MARKETSHOUR,
  CLEAR_MARKETS_AND_MARKETSHOURS
} from '../actions'

const marketsReducer = (state = {
  markets: {},
  marketsHours: {}
}, action) => {
  switch (action.type) {
    case CLEAR_MARKETS_AND_MARKETSHOURS:
      return {
        markets: {},
        marketsHours: {}
      }
    case ADD_MARKETSHOUR:
      console.log(action.marketshour);
      let newMarketsHours = Object.assign({}, state.marketsHours);
      newMarketsHours[action.todays_hours] = action.marketshour;
      return {
        ...state,
        marketsHours: newMarketsHours
      }
    case ADD_MARKET:
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
