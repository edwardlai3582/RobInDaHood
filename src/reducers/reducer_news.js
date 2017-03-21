import {
  ADD_NEWS, DELETE_NEWS
} from '../actions'

const newsReducer = (state = {
  newsAll: {}
}, action) => {
  switch (action.type) {
    case ADD_NEWS:
      let newNewsAll = Object.assign({}, state.newsAll);
      newNewsAll[action.symbol] = action.news;
      return {
        newsAll: newNewsAll
      }
    case DELETE_NEWS:
      return {
        ...state,
        //instruments: [],
      }
    default:
      return state
  }
}

export default newsReducer
