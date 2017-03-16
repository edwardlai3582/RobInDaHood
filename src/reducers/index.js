import { combineReducers } from 'redux'
import {
  SELECT_REDDIT, INVALIDATE_REDDIT,
  REQUEST_POSTS, RECEIVE_POSTS,
  ADD_TOKEN, DELETE_TOKEN, ASKING_TOKEN, ASKING_TOKEN_FAIL
} from '../actions'

const tokenReducer = (state = {
  isAsking: false,
  token: ""
}, action) => {
  switch (action.type) {
    case ASKING_TOKEN:
      return {
        ...state,
        isAsking: true
      }
    case ASKING_TOKEN_FAIL:
      return {
        ...state,
        isAsking: false
      }
    case ADD_TOKEN:
      return {
        ...state,
        isAsking: false,
        token: action.token
      }
    case ADD_TOKEN:
      return {
        ...state,
        token: ""
      }
    default:
      return state
  }
}

const selectedReddit = (state = 'reactjs', action) => {
  switch (action.type) {
    case SELECT_REDDIT:
      return action.reddit
    default:
      return state
  }
}

const posts = (state = {
  isFetching: false,
  didInvalidate: false,
  items: []
}, action) => {
  switch (action.type) {
    case INVALIDATE_REDDIT:
      return {
        ...state,
        didInvalidate: true
      }
    case REQUEST_POSTS:
      return {
        ...state,
        isFetching: true,
        didInvalidate: false
      }
    case RECEIVE_POSTS:
      return {
        ...state,
        isFetching: false,
        didInvalidate: false,
        items: action.posts,
        lastUpdated: action.receivedAt
      }
    default:
      return state
  }
}

const postsByReddit = (state = { }, action) => {
  switch (action.type) {
    case INVALIDATE_REDDIT:
    case RECEIVE_POSTS:
    case REQUEST_POSTS:
      return {
        ...state,
        [action.reddit]: posts(state[action.reddit], action)
      }
    default:
      return state
  }
}

const rootReducer = combineReducers({
  postsByReddit,
  selectedReddit,
  tokenReducer
})

export default rootReducer
