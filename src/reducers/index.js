import { combineReducers } from 'redux'
import tokenReducer from './reducer_token'
import accountReducer from './reducer_account'

const rootReducer = combineReducers({
  tokenReducer,
  accountReducer
})

export default rootReducer
