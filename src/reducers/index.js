import { combineReducers } from 'redux'
import {
  SELECT_REDDIT, INVALIDATE_REDDIT,
  REQUEST_POSTS, RECEIVE_POSTS,
  RESET_TOKEN_ERROR, ADD_TOKEN, DELETE_TOKEN, ASKING_TOKEN, ASKING_TOKEN_FAILED
} from '../actions'

const tokenReducer = (state = {
  isAsking: false,
  error: "",
  token: ""
}, action) => {
  switch (action.type) {
    case RESET_TOKEN_ERROR:
      return {
        ...state,
        error:"",
        isAsking: false
      }
    case ASKING_TOKEN:
      return {
        ...state,
        error:"",
        isAsking: true
      }
    case ASKING_TOKEN_FAILED:
      return {
        ...state,
        error: action.error,
        isAsking: false
      }
    case ADD_TOKEN:
      return {
        ...state,
        isAsking: false,
        token: action.token
      }
    case DELETE_TOKEN:
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
