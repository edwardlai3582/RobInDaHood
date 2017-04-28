const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;
ipcRenderer.on('asynchronous-reply', (event, arg) => {
    console.log(arg);
});
////////////MONITOR
export const MONITOR_TICKER_ADD = 'MONITOR_TICKER_ADD'
export const MONITOR_TICKER_DELETE = 'MONITOR_TICKER_DELETE'
export const MONITOR_TICKER_PERCENTAGE_CHANGE = 'MONITOR_TICKER_PERCENTAGE_CHANGE'
export const MONITOR_TICKER_LAST_PRICE_CHANGE = 'MONITOR_TICKER_LAST_PRICE_CHANGE'

export const changeMonitorTickerLastPrice = (instrument_id, last_price) => ({
  type: MONITOR_TICKER_LAST_PRICE_CHANGE,
  instrument_id, last_price
})

export const changeMonitorTickerPercentage = (instrument_id, percentage) => ({
  type: MONITOR_TICKER_PERCENTAGE_CHANGE,
  instrument_id, percentage
})

export const deleteMonitorTicker = (instrument_id) => ({
  type: MONITOR_TICKER_DELETE,
  instrument_id
})

export const addMonitorTicker = (instrument_id, symbol, percentage, last_price) => ({
  type: MONITOR_TICKER_ADD,
  instrument_id, symbol, percentage, last_price
})

export const askMonitorTickers = () => (dispatch, getState) => {
  let symbolArray = Object.keys(getState().monitorReducer.tickers).map((instrument_id)=>{
    return getState().monitorReducer.tickers[instrument_id].symbol;
  });
  if(symbolArray.length === 0) {
    return;
  }

  return fetch(`https://api.robinhood.com/prices/?symbols=${symbolArray.join(',')}&source=nls`, {
    method: 'GET',
    headers: new Headers({
      'Accept': 'application/json',
      'Authorization': getState().tokenReducer.token
    })
  })
  .then(response => response.json())
  .then(jsonResult => {
    if(jsonResult.results) {
      jsonResult.results.forEach((result) => {
        let price = Number(result.price).toFixed(2);
        let difference = price - getState().monitorReducer.tickers[result.instrument_id].last_price;
        let differenceInpercentage = Math.abs(difference/getState().monitorReducer.tickers[result.instrument_id].last_price) * 100;

        if(differenceInpercentage >= getState().monitorReducer.tickers[result.instrument_id].percentage) {
          dispatch(changeMonitorTickerLastPrice(result.instrument_id, price));
          ipcRenderer.send('price-alert', {
            title: "PRICE ALERT!!!",
            action: `robinhood://instrument/?id=${result.instrument_id}`,
            message: `$${getState().monitorReducer.tickers[result.instrument_id].symbol} is ${(difference > 0)? "up" : "down"} to ${differenceInpercentage.toFixed(2)}%. Current price is $${price}`
          });
        }
      })
    }
    else {
      console.log(jsonResult);
    }
  })
  .catch(function(reason) {
    console.log(reason);
  });
}
