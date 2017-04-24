import * as actions from '../actions';

const cardsReducer = (state = {
  cards: [],
  cardsLastUpdated: ""
}, action) => {
  switch (action.type) {
    case actions.CARDS_DELETE:
      return {
        ...state,
        cards: []
      }
    case actions.CARDS_ADD:
      return {
        ...state,
        cards: action.cards,
        cardsLastUpdated: `${Date.now()}`
      }
    default:
      return state
  }
}

export default cardsReducer
