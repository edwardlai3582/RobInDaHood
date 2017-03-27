////////////NEWS
export const ADD_NEWS = 'ADD_NEWS'
export const DELETE_NEWS = 'DELETE_NEWS'

export const addNews = (symbol, news) => ({
  type: ADD_NEWS,
  symbol,
  news
})

export const deleteNews = (symbol) => ({
  type: DELETE_NEWS,
  symbol
})

export const askNews = (symbol) => (dispatch, getState) => {
  //dispatch(askingFundamental());
  return fetch(`https://api.robinhood.com/midlands/news/${symbol}/`, {
    method: 'GET',
    headers: new Headers({
      'content-type': 'application/json',
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    console.log(jsonResult);
    dispatch(addNews(symbol, jsonResult));
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
