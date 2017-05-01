import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askAccount,
         askInstrument, deleteInstrument,
         askPosition, askPositions,
         askHistoricalsQuotes, askQuote,
         askWatchlists, addToWatchlists, removeFromWatchlists,
         placeOrder,
         askOwnHistoricalsOrders, askCurrentOrder, cancelOrder
       } from '../actions'
import Statistics from './Statistics'
import Margin from '../components/Margin'
import News from './News'
import Earnings from './Earnings'
import Quotes from '../components/Quotes'
import DummyQuotes from '../components/DummyQuotes'
import Position from '../components/Position'
import AddButton from '../components/AddButton'
import RemoveButton from '../components/RemoveButton'
import SectionWrapper from '../components/SectionWrapper'
import Orders from '../components/Orders'
import PlaceOrder from '../components/PlaceOrder'
import HistoryPriceDisplay from '../components/HistoryPriceDisplay'
import PriceAlertToggle from './PriceAlertToggle'
import { isLater, myFixed } from '../utils'
import '../styles/Instrument.css'

class InstrumentPage extends Component {
  static propTypes = {
    instrument: PropTypes.string.isRequired,
    symbol: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    instruments: PropTypes.object.isRequired,
    //fundamentals: PropTypes.object.isRequired,
    historicalsQuotes: PropTypes.object.isRequired,
    //quotes: PropTypes.object.isRequired,
    positions: PropTypes.array.isRequired,
    //eachPosition: PropTypes.object.isRequired,
    watchlists: PropTypes.array.isRequired,
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
      }
    };
  }

  componentDidMount(){
    const {
      symbol,
      instrument,
      positions,
      watchlists,
      onAskPosition,
      onAskHistoricalsQuotes,
      onAskQuote,
      onAskOwnHistoricalsOrders
    } = this.props;
    const { span, interval, bounds } = this.state.quotes;

    onAskOwnHistoricalsOrders();
    onAskHistoricalsQuotes(symbol, span, interval, bounds);
    onAskQuote(symbol);

    for(let i=0; i< positions.length; i++){
      if(positions[i].instrument === instrument){
        this.setState({ isInPositions: true});
        onAskPosition(positions[i].url);
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
    let thisIsInPostitions = false;
    for(let i=0; i< this.props.positions.length; i++){
      if(this.props.positions[i].instrument === this.props.instrument){
        thisIsInPostitions = true;
        break;
      }
    }
    if(!thisIsInWatchlists && !thisIsInPostitions){
      console.log("this instrument is not in watchlists nor positions, so killed");
      this.props.onDeleteInstrument(this.props.instrument);
    }
  }

  twoMinutesJobs = () => {
    const { symbol, onAskHistoricalsQuotes } = this.props;
    const { span, interval, bounds, selectedButtonName } = this.state.quotes;
    if(selectedButtonName === "1D"){
      onAskHistoricalsQuotes(symbol, span, interval, bounds);
    }
  }

  componentWillReceiveProps(nextProps){
    //reload no that time sensitive stuff here
    if(nextProps.isCurrent && !this.props.isCurrent){
      this.props.onAskInstrument(this.props.instrument);
      //this.askOwnHistoricalsOrders();
      this.props.onAskOwnHistoricalsOrders();
    }

    if(nextProps.placingOrder === false && this.props.placingOrder === true) {
      this.props.onAskOwnHistoricalsOrders();
    }

    for(let i=0; i< nextProps.watchlists.length; i++){
      if(nextProps.watchlists[i].instrument === this.props.instrument){
        this.setState({isInWatchLists:true});
        return;
      }
    }
    this.setState({isInWatchLists:false});
  }

  getOvernightBuyingPowerForInstrument = () => {
    const overnight_ratio = Number(this.props.account.margin_balances.overnight_ratio);
    const overnight_buying_power = Number(this.props.account.margin_balances.overnight_buying_power);
    const margin_initial_ratio = Number(this.props.ownInstrument.margin_initial_ratio);

    return overnight_buying_power / Math.max(overnight_ratio, margin_initial_ratio);
  }

  isInstant = () => {
    const margin_limit = this.props.account.margin_balances.margin_limit;

    if ( margin_limit !== null) {
      return Number(margin_limit) === 0;
    }
    return false;
  }

  getDayTradeBuyingPowerForInstrument = () => {
    const day_trade_ratio_from_account = Number(this.props.account.margin_balances.day_trade_ratio);
    const day_trade_ratio_from_instrument = Number(this.props.ownInstrument.day_trade_ratio);
    const day_trade_buying_power = Number(this.props.account.margin_balances.day_trade_buying_power);

    return day_trade_buying_power / Math.max(day_trade_ratio_from_account, day_trade_ratio_from_instrument);
  }

  getBuyingPowerForInstrument = () => {
    const { type, cash_balances, margin_balances } = this.props.account;
    if( type === "cash" ) {
      return Number(cash_balances.buying_power);
    }
    else {
      let temp2 = this.getOvernightBuyingPowerForInstrument();
      let temp1 = temp2;
      if(this.isInstant()) {
        temp1 = Math.min(temp2, this.getDayTradeBuyingPowerForInstrument());
      }
      if( margin_balances.margin_limit === null ) {
        return temp1;
      }
      return Math.min(temp1, Number(margin_balances.unallocated_margin_cash));
    }
  }

  addMoreHistoricalsOrder = () => {
    this.props.onAskOwnHistoricalsOrders( this.props.ownHistoricalsOrder.nextLink );
  }

  changeHisQuotes = (span, interval, bounds, selectedButtonName)=>{
    this.setState({ quotes: { span: span, interval: interval, bounds: bounds, selectedButtonName: selectedButtonName } });
    this.props.onAskHistoricalsQuotes(this.props.symbol, span, interval, bounds);
  }

  addToWatchlists = () => {
    this.props.onAddToWatchlists( this.props.ownInstrument.symbol );
  }

  removeFromWatchlists = () => {
    this.props.onRemoveFromWatchlists( this.props.ownInstrument.id );
  }

  render() {
    const {
      symbol,
      instrument,
      ownFundamental,
      instruments,
      ownInstrument,
      historicalsQuotes,
      ownQuote,
      ownEachPosition,
      account,
      placingOrder,
      orderPlacedResult,
      onAskAccount,
      onPlaceOrder,
      ownHistoricalsOrder,
      isAskingCurrentOrder,
      onAskCurrentOrder,
      currentOrder,
      currentOrderFailedReason,
      onCancelOrder,
      cancelCurrentOrderState
    } = this.props
    const { span, interval, bounds, selectedButtonName } = this.state.quotes;


    //show null if not current page
    if(!this.props.isCurrent){ return null; }

    let historicals = [];
    if(ownQuote && historicalsQuotes[symbol+span+interval+bounds]){
      historicals = historicalsQuotes[symbol+span+interval+bounds].historicals;
      if(selectedButtonName === "1D"){
        if(historicals[historicals.length-1].add_by_me){
          if(isLater(ownQuote.updated_at ,historicals[historicals.length-1].begins_at)){
            console.log("push current quote!");
            historicals.push({
              "begins_at": ownQuote.updated_at,
              "open_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "close_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "high_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "low_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "volume": 0,
              "add_by_me": true,
              "session": historicals[historicals.length-1].session,
              "not_reg_close_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "reg_close_price": (historicals[historicals.length-1].session !== "reg")?undefined:Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "interpolated": false
            })
          }
        }
        else{
          if(isLater(ownQuote.updated_at ,historicals[historicals.length-1].begins_at)){
            console.log("push current quote!");
            historicals[historicals.length-1] = {
              "begins_at": ownQuote.updated_at,
              "open_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "close_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "high_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "low_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "volume": 0,
              "add_by_me": true,
              "session": historicals[historicals.length-1].session,
              "not_reg_close_price": Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "reg_close_price": (historicals[historicals.length-1].session !== "reg")?undefined:Number((ownQuote.last_extended_hours_trade_price)? ownQuote.last_extended_hours_trade_price : ownQuote.last_trade_price).toFixed(2),
              "interpolated": false
            };
          }
        }
      }

    }

    let statisticsBlock = (symbol)? <Statistics symbol={symbol} /> : "Loading...";
    let marginBlock = (ownInstrument && account)? <Margin ownInstrument={ownInstrument} buyingPower={this.getBuyingPowerForInstrument()} /> : "Loading...";
    let newsBlock = (symbol)? <News symbol={symbol} /> : "Loading...";
    let earningsBlock = (symbol)? <Earnings symbol={symbol} /> : "Loading...";

    let quotesBlock = (ownQuote && historicalsQuotes[symbol+span+interval+bounds] )?
      (<Quotes historicals={ historicals }
               selectedButtonName={selectedButtonName}
               previous_close={ownQuote.previous_close}
      />): <DummyQuotes />;

    let ordersBlock = (ownHistoricalsOrder && ownHistoricalsOrder.orders.length > 0 )? (
      <SectionWrapper SectionTitle={"Orders"}>
        <Orders
          historicalsOrders={ownHistoricalsOrder.orders}
          historicalsOrdersNextLink={(ownHistoricalsOrder.nextLink)? ownHistoricalsOrder.nextLink : ""}
          isAskingCurrentOrder={isAskingCurrentOrder}
          currentOrder={currentOrder}
          currentOrderFailedReason={currentOrderFailedReason}
          instruments={instruments}
          addMoreHistoricalsOrder={this.addMoreHistoricalsOrder}
          askCurrentOrder={onAskCurrentOrder}
          forInstrument={true}
          cancelOrder={ onCancelOrder }
          cancelCurrentOrderState={cancelCurrentOrderState}
        />
      </SectionWrapper>
    ) : null;

    let PriceAlertToggleBlock = (ownQuote)? (
      <PriceAlertToggle
        symbol={symbol}
        instrument_id={ownInstrument.id}
        last_price={ (ownQuote.last_extended_hours_trade_price)?
          Number(ownQuote.last_extended_hours_trade_price) :
          Number(ownQuote.last_trade_price)
        }
      />
    ) : null;

    let descriptionBlock = (ownFundamental)? ownFundamental.description : "Loading...";

    let positionBlock = null;
    //need to change
    if( ownEachPosition ){
      positionBlock = (ownEachPosition && ownQuote)? <Position quote={ownQuote} position={ownEachPosition} /> : "Loading...";
    }

    let priceRelatedBlock = (ownQuote)? (
      <div className="priceRelatedWrapper">
        <div className="last_trade_price">
          { `$${(ownQuote.last_extended_hours_trade_price)? myFixed(Number(ownQuote.last_extended_hours_trade_price)) : myFixed(Number(ownQuote.last_trade_price))}` }
        </div>
        <HistoryPriceDisplay
          selectedButtonName={selectedButtonName}
          historicals={historicals}
          previous_close={ownQuote.previous_close}
          last_trade_price={ownQuote.last_trade_price}
          last_extended_hours_trade_price={ownQuote.last_extended_hours_trade_price}
          updated_at={ownQuote.updated_at}
        />
      </div>
    ) : null;

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div className="instrumentHWrapper">
            <div className="instrumentH">
              <h1 className="instrumentH1">{symbol}</h1>
              <h2 className="instrumentH2">{ownInstrument.name}</h2>
            </div>
            {PriceAlertToggleBlock}
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

          {(ownQuote && ownInstrument.tradeable && account && account.type)?(
            <PlaceOrder symbol={symbol}
                        shares={(ownEachPosition)? ownEachPosition.quantity : 0 }
                        buyingPower={this.getBuyingPowerForInstrument() }
                        accountUrl={account.url}
                        instrumentUrl={instrument}
                        currentPrice={ ownQuote.last_extended_hours_trade_price || ownQuote.last_trade_price }
                        placeOrder={ (order) => onPlaceOrder(order) }
                        placingOrder={placingOrder}
                        orderPlacedResult={orderPlacedResult}
                        askAccount={()=> onAskAccount() }
            />
          ):(
            <div className="notTradeable">not tradeable</div>
          )}
        </SectionWrapper>
        {(ownEachPosition && ownEachPosition.quantity > 0 )?
          <SectionWrapper SectionTitle={"Position"}>
            {positionBlock}
          </SectionWrapper>
        :null}
        { marginBlock }
        { newsBlock }
        { statisticsBlock }
        { earningsBlock }
        { ordersBlock }
        <SectionWrapper SectionTitle={"About"}>
          { descriptionBlock }
        </SectionWrapper>
      </div>
    )
  }
}

const mapStateToProps = ({
  instrumentsReducer,
  fundamentalsReducer,
  quotesReducer,
  positionsReducer,
  watchlistsReducer,
  accountReducer,
  ordersReducer
}, ownProps) => {
  const { watchlists } = watchlistsReducer;
  const { instruments } = instrumentsReducer;
  const { fundamentals } = fundamentalsReducer;
  const { historicalsQuotes, quotes } = quotesReducer;
  const { positions, eachPosition } = positionsReducer;
  const { account } = accountReducer;
  const {
    placingOrder,
    orderPlacedResult,
    ownHistoricalsOrders,
    isAskingCurrentOrder,
    currentOrderFailedReason,
    currentOrder,
    cancelCurrentOrderState
  } = ordersReducer;

  return {
    watchlists,
    instruments,
    ownInstrument: instruments[ownProps.instrument],
    ownFundamental: fundamentals[ownProps.symbol],
    historicalsQuotes,
    ownQuote: quotes[ownProps.symbol],
    positions,
    ownEachPosition: eachPosition[ownProps.instrument],
    account,
    placingOrder,
    orderPlacedResult,
    ownHistoricalsOrder: ownHistoricalsOrders[ownProps.symbol],
    isAskingCurrentOrder,
    currentOrderFailedReason,
    currentOrder,
    cancelCurrentOrderState
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onAskAccount: () => {
    dispatch(askAccount());
  },
  onAskInstrument: (instrument) => {
    dispatch(askInstrument(instrument));
  },
  onDeleteInstrument: (instrumentUrl) => {
    dispatch(deleteInstrument(instrumentUrl));
  },
  onAskPosition: (url) => {
    dispatch(askPosition(url));
  },
  onAskPositions: () => {
    dispatch(askPositions());
  },
  onAskHistoricalsQuotes: (symbol, span, interval, bounds) => {
    dispatch(askHistoricalsQuotes(symbol, span, interval, bounds));
  },
  onAskQuote: (symbol) => {
    dispatch(askQuote(symbol));
  },
  onAskWatchlists: () => {
    dispatch(askWatchlists());
  },
  onAddToWatchlists: (symbol) => {
    dispatch(addToWatchlists(symbol));
  },
  onRemoveFromWatchlists: (instrumentId) => {
    dispatch(removeFromWatchlists(instrumentId));
  },
  onPlaceOrder: (order) => {
    dispatch(placeOrder(order));
  },
  onAskOwnHistoricalsOrders: (nextLink) => {
    dispatch(askOwnHistoricalsOrders(ownProps.symbol, ownProps.instrument, nextLink));
  },
  onAskCurrentOrder: (orderID) => {
    dispatch(askCurrentOrder(orderID));
  },
  onCancelOrder: (cancelLink, orderId, symbol, instrument) => {
    dispatch(cancelOrder(cancelLink, orderId, symbol, instrument));
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(InstrumentPage)
