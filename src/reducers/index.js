import { combineReducers } from 'redux'
import tokenReducer from './reducer_token'
import accountReducer from './reducer_account'
import watchlistsReducer from './reducer_watchlists'
import instrumentsReducer from './reducer_instruments'
import tabsReducer from './reducer_tabs'
import fundamentalsReducer from './reducer_fundamentals'

const rootReducer = combineReducers({
  tokenReducer,
  accountReducer,
  watchlistsReducer,
  instrumentsReducer,
  tabsReducer,
  fundamentalsReducer
})

export default rootReducer
