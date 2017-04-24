////////////CARDS
export const CARDS_ADD = 'CARDS_ADD'
export const CARDS_DELETE = 'CARDS_DELETE'

export const deleteCards = () => ({
  type: CARDS_DELETE
})

export const addCards = (cards) => ({
  type: CARDS_ADD,
  cards
})

export const askCards = () => (dispatch, getState) => {
  return fetch(`https://api.robinhood.com/midlands/notifications/stack/`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    if(jsonResult.results) {
      dispatch(addCards(jsonResult.results));
    }
    else {
      console.log(jsonResult);
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
