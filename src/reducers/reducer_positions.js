import {
  ADD_POSITIONS, DELETE_POSITIONS, ASKING_POSITIONS, ASKING_POSITIONS_FAILED,
  ADD_POSITIONS_WITH_ZERO,
  ADD_POSITION
} from '../actions'

/*
"positions":[
      {
         "account":"https://api.robinhood.com/accounts/accountnumber/",
         "intraday_quantity":"0.0000",
         "intraday_average_buy_price":"0.0000",
         "url":"https://api.robinhood.com/positions/accountnumber/stringOfSomething/",
         "created_at":"2017-03-02T03:52:54.895476Z",
         "updated_at":"2017-03-28T16:23:05.714421Z",
         "shares_held_for_buys":"0.0000",
         "average_buy_price":"1.33",
         "instrument":"https://api.robinhood.com/instruments/stringOfSomething/",
         "shares_held_for_sells":"0.0000",
         "quantity":"495.0000"
      },
]

"eachPosition":{
      "https://api.robinhood.com/instruments/stringOfSomething/":{
         "account":"https://api.robinhood.com/accounts/accountnumber/",
         "intraday_quantity":"0.0000",
         "intraday_average_buy_price":"0.0000",
         "url":"https://api.robinhood.com/positions/stringOfSomething/",
         "created_at":"2017-03-02T03:52:54.895476Z",
         "updated_at":"2017-03-28T16:23:05.714421Z",
         "shares_held_for_buys":"0.0000",
         "average_buy_price":"6.33",
         "instrument":"https://api.robinhood.com/instruments/stringOfSomething/",
         "shares_held_for_sells":"0.0000",
         "quantity":"100.0000"
      },
}
*/

const positionsReducer = (state = {
  isAskingPositions: false,
  error: "",
  positions: [],
  positionsWithZero: [],
  eachPosition: {}
}, action) => {
  switch (action.type) {
    case ASKING_POSITIONS:
      return {
        ...state,
        error: "",
        isAskingPositions: true
      }
    case ASKING_POSITIONS_FAILED:
      return {
        ...state,
        isAskingPositions: false,
        error: action.error,
        positions: []
      }
    case ADD_POSITIONS:
      return {
        ...state,
        isAskingPositions: false,
        positions: action.positions,
      }
    case DELETE_POSITIONS:
      return {
        ...state,
        positions: [],
      }
    case ADD_POSITION:
      let tempPosition = {};
      tempPosition[action.position.instrument] = action.position;
      return {
        ...state,
        eachPosition: Object.assign({}, state.eachPosition, tempPosition)
      }
    case ADD_POSITIONS_WITH_ZERO:
      return {
        ...state,
        positionsWithZero: action.positions,
      }
    default:
      return state
  }
}

export default positionsReducer
