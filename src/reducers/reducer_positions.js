import * as actions from '../actions';

const positionsReducer = (state = {
  isAskingPositions: false,
  error: "",
  positions: [],
  positionsWithZero: [],
  eachPosition: {}
}, action) => {
  switch (action.type) {
    case actions.ASKING_POSITIONS:
      return {
        ...state,
        error: "",
        isAskingPositions: true
      }
    case actions.ASKING_POSITIONS_FAILED:
      return {
        ...state,
        isAskingPositions: false,
        error: action.error,
        positions: []
      }
    case actions.ADD_POSITIONS:
      return {
        ...state,
        isAskingPositions: false,
        positions: action.positions,
      }
    case actions.ADD_MORE_POSITIONS:
      return {
        ...state,
        isAskingPositions: false,
        positions: state.positions.concat(action.positions)
      }
    case actions.DELETE_POSITIONS:
      return {
        isAskingPositions: false,
        error: "",
        positions: [],
        positionsWithZero: [],
        eachPosition: {}
      }
    case actions.ADD_POSITION:
      let tempPosition = {};
      tempPosition[action.position.instrument] = action.position;
      return {
        ...state,
        eachPosition: Object.assign({}, state.eachPosition, tempPosition)
      }
    case actions.ADD_POSITIONS_WITH_ZERO:
      return {
        ...state,
        positionsWithZero: action.positions,
      }
    case actions.ADD_MORE_POSITIONS_WITH_ZERO:
      return {
        ...state,
        positionsWithZero: state.positionsWithZero.concat(action.positions)
      }
    default:
      return state
  }
}

export default positionsReducer


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
