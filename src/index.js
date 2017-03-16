import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import {persistStore, autoRehydrate} from 'redux-persist'
import {REHYDRATE} from 'redux-persist/constants'
import createActionBuffer from 'redux-action-buffer'
//import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import reducer from './reducers'

import First from './containers/First'

const middleware = [ thunk ]
/*
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}
*/
let enhancer = compose(
  autoRehydrate(),
  applyMiddleware(
    createActionBuffer(REHYDRATE) //make sure to apply this after redux-thunk et al.
  )
)

const store = createStore(
  reducer,
  compose(
    applyMiddleware(...middleware),
    enhancer
  )
)
// begin periodically persisting the store
persistStore(store)

render(
  <Provider store={store}>
    <First />
  </Provider>,
  document.getElementById('root')
)
/*
<Router history={browserHistory}>
  <Route path="/" component={App}>
    <IndexRoute component={App}/>
  </Route>
</Router>
*/
