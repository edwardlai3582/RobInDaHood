import React from 'react'
import { render } from 'react-dom'
import { createStore, applyMiddleware, compose } from 'redux'
import { Provider } from 'react-redux'
import thunk from 'redux-thunk'
import {persistStore, autoRehydrate} from 'redux-persist'
import { Router, Route, IndexRoute, browserHistory } from 'react-router'
import reducer from './reducers'
import App from './containers/App'
import Login from './containers/Login'

const middleware = [ thunk ]
/*
if (process.env.NODE_ENV !== 'production') {
  middleware.push(createLogger())
}
*/
const store = createStore(
  reducer,
  compose(
    applyMiddleware(...middleware),
    autoRehydrate()
  )
)
// begin periodically persisting the store
persistStore(store)

render(
  <Provider store={store}>
    <Login />
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
