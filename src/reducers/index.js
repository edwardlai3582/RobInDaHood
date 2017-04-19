import { combineReducers } from 'redux'
import tokenReducer from './reducer_token'
import accountReducer from './reducer_account'
import watchlistsReducer from './reducer_watchlists'
import positionsReducer from './reducer_positions'
import instrumentsReducer from './reducer_instruments'
import tabsReducer from './reducer_tabs'
import fundamentalsReducer from './reducer_fundamentals'
import newsReducer from './reducer_news'
import quotesReducer from './reducer_quotes'
import portfoliosReducer from './reducer_portfolios'
import ordersReducer from './reducer_orders'
import marketsReducer from './reducer_markets'
import uiReducer from './reducer_ui'
import localReducer from './reducer_local'
import cardsReducer from './reducer_cards'

const rootReducer = combineReducers({
  tokenReducer,
  accountReducer,
  watchlistsReducer,
  positionsReducer,
  instrumentsReducer,
  tabsReducer,
  fundamentalsReducer,
  newsReducer,
  quotesReducer,
  portfoliosReducer,
  ordersReducer,
  marketsReducer,
  uiReducer,
  localReducer,
  cardsReducer
})

export default rootReducer
