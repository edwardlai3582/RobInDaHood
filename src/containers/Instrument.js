import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askAccount,
         askFundamental,
         askNews,
         askInstrument, deleteInstrument,
         askPosition, askPositions,
         askHistoricalsQuotes, askQuote,
         askWatchlists, addToWatchlists, removeFromWatchlists,
         placeOrder
       } from '../actions'
import Statistics from '../components/Statistics'
import News from '../components/News'
import Quotes from '../components/Quotes'
import DummyQuotes from '../components/DummyQuotes'
import Position from '../components/Position'
import AddButton from '../components/AddButton'
import RemoveButton from '../components/RemoveButton'
import SectionWrapper from '../components/SectionWrapper'
import Orders from '../components/Orders'
import PlaceOrder from '../components/PlaceOrder'
import HistoryPriceDisplay from '../components/HistoryPriceDisplay'
import { isLater } from '../utils'
import '../styles/Instrument.css'

class Instrument extends Component {
  static propTypes = {
    instrument: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    fundamentals: PropTypes.object.isRequired,
    newsAll: PropTypes.object.isRequired,
    historicalsQuotes: PropTypes.object.isRequired,
    quotes: PropTypes.object.isRequired,
    positions: PropTypes.array.isRequired,
    eachPosition: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    watchlists: PropTypes.array.isRequired,
    token: PropTypes.string.isRequired,
    account: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired,
    placingOrder: PropTypes.bool.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      twoMinutesInterval: undefined,
      isInPositions: false,
      isInWatchLists: false,
      quotes: {
        span: "day",
        interval: "5minute",
        bounds: "trading",
        selectedButtonName: "1D"
      },
      ownHistoricalsOrders: [],
      ownHistoricalsOrdersNextLink: "",
      isAskingOwnCurrentOrder: false,
      OwnCurrentOrder: {},
      OwnCurrentOrderFailedReason: "",
      //CancelCurrentOrderState: noteven, ing, failed, succeeded
      cancelOwnCurrentOrderState: "noteven",
      cancelOwnFailedReason: ""
    };
  }

  componentDidMount(){
    const { symbol, instrument, positions, watchlists, dispatch } = this.props;
    const { span, interval, bounds } = this.state.quotes;
    this.askOwnHistoricalsOrders();
    dispatch(askFundamental(symbol));
    dispatch(askNews(symbol));
    dispatch(askHistoricalsQuotes(symbol, span, interval, bounds));
    dispatch(askQuote(symbol));
    for(let i=0; i< positions.length; i++){
      if(positions[i].instrument === instrument){
        this.setState({isInPositions:true});
        dispatch(askPosition(positions[i].url));
        break;
      }
    }
    for(let i=0; i< watchlists.length; i++){
      if(watchlists[i].instrument === instrument){
        this.setState({isInWatchLists:true});
        break;
      }
    }

    // store intervalId in the state so it can be accessed later:
    let intervalTwo = setInterval(this.twoMinutesJobs, 120000);
    this.setState({twoMinutesInterval: intervalTwo});
  }

  componentWillUnmount() {
    clearInterval(this.state.twoMinutesInterval);

    let thisIsInWatchlists = false;
    for(let i=0; i< this.props.watchlists.length; i++){
      if(this.props.watchlists[i].instrument === this.props.instrument){
        thisIsInWatchlists = true;
        break;
      }
    }
    if(!thisIsInWatchlists){
      console.log("this instrument is not in watchlists, so killed");
      this.props.dispatch(deleteInstrument(this.props.instrument));
    }
  }

  twoMinutesJobs = () => {
    const { symbol, dispatch } = this.props;
    const { span, interval, bounds, selectedButtonName } = this.state.quotes;
    if(selectedButtonName === "1D"){
      dispatch(askHistoricalsQuotes(symbol, span, interval, bounds));
    }
    dispatch(askFundamental(symbol));
  }

  componentWillReceiveProps(nextProps){
    //reload no that time sensitive stuff (news) here
    if(nextProps.isCurrent && !this.props.isCurrent){
      this.props.dispatch(askInstrument(this.props.instrument));
      this.askOwnHistoricalsOrders();
    }

    if(nextProps.placingOrder === false && this.props.placingOrder === true) {
      this.askOwnHistoricalsOrders();  
    }

    for(let i=0; i< nextProps.watchlists.length; i++){
      if(nextProps.watchlists[i].instrument === this.props.instrument){
        this.setState({isInWatchLists:true});
        return;
      }
    }
    this.setState({isInWatchLists:false});
  }

  askOwnHistoricalsOrders = (...theArgs) => {
    let link = (theArgs.length === 0)? `https://api.robinhood.com/orders/?instrument=${this.props.instrument}` : theArgs[0];

    return fetch(link, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(response => response.json())
    .then(jsonResult => {
      if(theArgs.length === 0){
        //console.log("orders from instrument");
        //console.log(jsonResult)
        this.setState({
          ownHistoricalsOrders: jsonResult.results,
          ownHistoricalsOrdersNextLink: (jsonResult.next)? jsonResult.next : ""
        });
      }
      else {
        //console.log("more order histories from instrument!")
        this.setState({
          ownHistoricalsOrders: this.state.ownHistoricalsOrders.concat(jsonResult.results),
          ownHistoricalsOrdersNextLink: (jsonResult.next)? jsonResult.next : ""
        });
      }
    })
    .catch(function(reason) {
      console.log(reason);
    });
  }

  askOwnCurrentOrder = (orderId) =>  {
    this.setState({ isAskingOwnCurrentOrder: true, OwnCurrentOrderFailedReason: ""});
    return fetch(`https://api.robinhood.com/orders/${orderId}/`, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(response => response.json())
    .then(jsonResult => {
      if(jsonResult.deatil){
        //console.log(jsonResult.deatil);
        this.setState({isAskingOwnCurrentOrder: false, OwnCurrentOrderFailedReason: jsonResult.deatil, OwncurrentOrder:{}});
      }
      else{
        //console.log(jsonResult)
        this.setState({isAskingOwnCurrentOrder: false, OwnCurrentOrder: jsonResult});
      }
    })
    .catch(function(reason) {
      console.log(reason);
      this.setState({isAskingOwnCurrentOrder: false, OwnCurrentOrderFailedReason: reason, OwnCurrentOrder:{}});
    });
  }

  addMoreHistoricalsOrder = () => {
    this.askOwnHistoricalsOrders(this.state.ownHistoricalsOrdersNextLink)
  }

  cancelOwnOrder = (cancelLink, orderId) => {
    this.setState({cancelOwnCurrentOrderState:"ing", cancelOwnFailedReason: ""});

    return fetch(cancelLink, {
      method: 'POST',
      headers: new Headers({
        'Accept': 'application/json',
        'Authorization': this.props.token
      })
    })
    .then(response => response.json())
    .then(jsonResult => {
      console.log(jsonResult);
      if(Object.keys(jsonResult).length === 0){
        //dispatch(cancelCurrentOrderSucceeded());
        this.setState({cancelOwnCurrentOrderState:"succeeded"});
        this.askOwnCurrentOrder(orderId);
        this.askOwnHistoricalsOrders();

        //reload watchlist & positions after order cancelled
        this.props.dispatch(askWatchlists());
        this.props.dispatch(askPositions());
      }
      else{
        console.log(jsonResult);
        this.setState({cancelOwnCurrentOrderState:"failed", cancelOwnFailedReason: JSON.stringify(jsonResult)});
        this.askOwnCurrentOrder(orderId);
      }
    })
    .catch(function(reason) {
      console.log(reason);
      this.setState({cancelOwnCurrentOrderState:"failed", cancelOwnFailedReason: reason});
      this.askOwnCurrentOrder(orderId);
    });
  }

  changeHisQuotes = (span, interval, bounds, selectedButtonName)=>{
    this.setState({ quotes: { span: span, interval: interval, bounds: bounds, selectedButtonName: selectedButtonName } });
    this.props.dispatch(askHistoricalsQuotes(this.props.symbol, span, interval, bounds));
  }

  addToWatchlists = () => {
    //console.log(this.props.instruments[this.props.instrument].symbol);
    this.props.dispatch(addToWatchlists(this.props.instruments[this.props.instrument].symbol))
  }

  removeFromWatchlists = () => {
    //console.log(this.props.instruments[this.props.instrument].id);
    this.props.dispatch(removeFromWatchlists(this.props.instruments[this.props.instrument].id))
  }

  render() {
    const { symbol, instrument, fundamentals, instruments, newsAll, historicalsQuotes, quotes, eachPosition, account, placingOrder, orderPlacedResult } = this.props
    const { span, interval, bounds, selectedButtonName } = this.state.quotes;
    const { ownHistoricalsOrders, ownHistoricalsOrdersNextLink,
            isAskingOwnCurrentOrder, OwnCurrentOrder, OwnCurrentOrderFailedReason } = this.state;


    //show null if not cuttent page
    if(!this.props.isCurrent){ return null; }

    let historicals = [];
    if(quotes[symbol] && historicalsQuotes[symbol+span+interval+bounds]){
      historicals = historicalsQuotes[symbol+span+interval+bounds].historicals;
      if(selectedButtonName === "1D"){
        if(historicals[historicals.length-1].add_by_me){
          if(isLater(quotes[symbol].updated_at ,historicals[historicals.length-1].begins_at)){
            console.log("push current quote!");
            historicals.push({
              "begins_at": quotes[symbol].updated_at,
              "open_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "close_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "high_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "low_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "volume": 0,
              "add_by_me": true,
              "session": historicals[historicals.length-1].session,
              "not_reg_close_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "reg_close_price": (historicals[historicals.length-1].session !== "reg")?undefined:Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "interpolated": false
            })
          }
        }
        else{
          if(isLater(quotes[symbol].updated_at ,historicals[historicals.length-1].begins_at)){
            console.log("push current quote!");
            historicals[historicals.length-1] = {
              "begins_at": quotes[symbol].updated_at,
              "open_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "close_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "high_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "low_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "volume": 0,
              "add_by_me": true,
              "session": historicals[historicals.length-1].session,
              "not_reg_close_price": Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "reg_close_price": (historicals[historicals.length-1].session !== "reg")?undefined:Number((quotes[symbol].last_extended_hours_trade_price)? quotes[symbol].last_extended_hours_trade_price : quotes[symbol].last_trade_price).toFixed(2),
              "interpolated": false
            };
          }
        }
      }

    }

    let statisticsBlock = (fundamentals[symbol])? <Statistics fundamental={fundamentals[symbol]} /> : "Loading...";
    let newsBlock = (newsAll[symbol])? <News news={newsAll[symbol]} /> : "Loading...";

    let quotesBlock = (quotes[symbol] && historicalsQuotes[symbol+span+interval+bounds] )?
      (<Quotes historicals={ historicals }
               selectedButtonName={selectedButtonName}
               previous_close={quotes[symbol].previous_close}
      />): <DummyQuotes />;

    let ordersBlock = (ownHistoricalsOrders.length === 0)? null : (
      <SectionWrapper SectionTitle={"Orders"}>
        <Orders
          historicalsOrders={ownHistoricalsOrders}
          historicalsOrdersNextLink={ownHistoricalsOrdersNextLink}
          isAskingCurrentOrder={isAskingOwnCurrentOrder}
          currentOrder={OwnCurrentOrder}
          currentOrderFailedReason={OwnCurrentOrderFailedReason}
          instruments={instruments}
          addMoreHistoricalsOrder={this.addMoreHistoricalsOrder}
          askCurrentOrder={this.askOwnCurrentOrder}
          forInstrument={true}
          cancelOrder={ this.cancelOwnOrder }
          cancelCurrentOrderState={this.state.cancelOwnCurrentOrderState}
        />
      </SectionWrapper>
    )
    let descriptionBlock = (fundamentals[symbol])? fundamentals[symbol].description : "Loading...";

    let positionBlock = null;
    //need to change
    if(eachPosition[instrument]){
      //console.log(eachPosition[instrument])
      positionBlock = (eachPosition[instrument] && quotes[symbol])? <Position quotes={quotes[symbol]} position={eachPosition[instrument]} /> : "Loading...";
    }

    let priceRelatedBlock = (quotes[symbol])? (
      <div className="priceRelatedWrapper">
        <div className="last_trade_price">
          { `$${(quotes[symbol].last_extended_hours_trade_price)? Number(quotes[symbol].last_extended_hours_trade_price).toFixed(2) : Number(quotes[symbol].last_trade_price).toFixed(2)}` }
        </div>
        <HistoryPriceDisplay
          selectedButtonName={selectedButtonName}
          historicals={historicals}
          previous_close={quotes[symbol].previous_close}
          last_trade_price={quotes[symbol].last_trade_price}
          last_extended_hours_trade_price={quotes[symbol].last_extended_hours_trade_price}
          updated_at={quotes[symbol].updated_at}
        />
      </div>
    ) : null;

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">{symbol}</h1>
            <h2 className="instrumentH2">{instruments[instrument].name}</h2>
          </div>
          {(this.state.isInPositions)?
            null:
            (this.state.isInWatchLists)?
              <RemoveButton cb={this.removeFromWatchlists}/>:
              <AddButton cb={this.addToWatchlists}/>
          }
        </header>

        <SectionWrapper SectionTitle={""}>
          {priceRelatedBlock}
          {quotesBlock}
          <div className="quotesButtonsWrapper">
            <button className={selectedButtonName==="1D"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("day", "5minute", "trading", "1D")}>1D</button>
            <button className={selectedButtonName==="1W"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("week", "10minute", "regular", "1W")}>1W</button>
            <button className={selectedButtonName==="1M"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("year", "day", "regular", "1M")}>1M</button>
            <button className={selectedButtonName==="3M"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("year", "day", "regular", "3M")}>3M</button>
            <button className={selectedButtonName==="1Y"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("year", "day", "regular", "1Y")}>1Y</button>
            <button className={selectedButtonName==="5Y"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("5year", "week", "regular", "5Y")}>5Y</button>
          </div>

          {(quotes[symbol] && instruments[instrument].tradeable && account )?(
            <PlaceOrder symbol={symbol}
                        shares={(eachPosition[instrument])? eachPosition[instrument].quantity : 0 }
                        cashCanUse={(account.type === "margin")? account.margin_balances.unallocated_margin_cash : account.cash_balances.buying_power }
                        accountUrl={account.url}
                        instrumentUrl={instrument}
                        currentPrice={ quotes[symbol].last_extended_hours_trade_price || quotes[symbol].last_trade_price }
                        placeOrder={(order)=>this.props.dispatch(placeOrder(order))}
                        placingOrder={placingOrder}
                        orderPlacedResult={orderPlacedResult}
                        askAccount={()=> this.props.dispatch(askAccount())}
            />
          ):(
            <div className="notTradeable">not tradeable</div>
          )}
        </SectionWrapper>


        {(eachPosition[instrument])?
          <SectionWrapper SectionTitle={"Position"}>
            {positionBlock}
          </SectionWrapper>
        :null}

        <SectionWrapper SectionTitle={"Recent News"}>
          {newsBlock}
        </SectionWrapper>

        <SectionWrapper SectionTitle={"Statistics"}>
          {statisticsBlock}
        </SectionWrapper>

        { ordersBlock }

        <SectionWrapper SectionTitle={"About"}>
          {descriptionBlock}
        </SectionWrapper>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { instrumentsReducer, fundamentalsReducer, newsReducer, quotesReducer, positionsReducer, watchlistsReducer, tokenReducer, accountReducer, ordersReducer } = state
  const { watchlists } = watchlistsReducer || { watchlists: []}
  const { instruments } = instrumentsReducer || { instruments: {}}
  const { fundamentals } = fundamentalsReducer || { fundamentals: {}}
  const { newsAll } = newsReducer || { newsAll: {}}
  const { historicalsQuotes, quotes } = quotesReducer || { historicalsQuotes: {}, quotes:{}}
  const { positions, eachPosition } = positionsReducer || { positions:[], eachPosition: {}}
  const { token } = tokenReducer || { token:"" }
  const { account } = accountReducer || { account: {} }
  const { placingOrder, orderPlacedResult } = ordersReducer || { placingOrder: false, orderPlacedResult:"" }

  return { instruments, fundamentals, newsAll, historicalsQuotes, quotes, positions, eachPosition, watchlists, token, account, placingOrder, orderPlacedResult }
}

export default connect(mapStateToProps)(Instrument)
