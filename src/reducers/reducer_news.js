import * as actions from '../actions';

const newsReducer = (state = {
  newsAll: {}
}, action) => {
  switch (action.type) {
    case actions.NEWS_ADD:
      let newNewsAll = Object.assign({}, state.newsAll);
      newNewsAll[action.symbol] = action.news;
      return {
        ...state,
        newsAll: newNewsAll
      }
    case actions.NEWS_DELETE:
      let tempNewsAll = Object.assign({}, state.newsAll);
      delete tempNewsAll[action.symbol];
      return {
        ...state,
        newsAll: tempNewsAll
      }
    default:
      return state
  }
}

export default newsReducer
