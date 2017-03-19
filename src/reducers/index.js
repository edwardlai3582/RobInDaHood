import { combineReducers } from 'redux'
import tokenReducer from './reducer_token'
import accountReducer from './reducer_account'
import watchlistsReducer from './reducer_watchlists'
import instrumentsReducer from './reducer_instruments'
import tabsReducer from './reducer_tabs'

const rootReducer = combineReducers({
  tokenReducer,
  accountReducer,
  watchlistsReducer,
  instrumentsReducer,
  tabsReducer
})

export default rootReducer
