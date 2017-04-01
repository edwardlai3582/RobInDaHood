import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askFundamental,
         askNews,
         askPosition,
         askHistoricalsQuotes, askQuotes,
         addToWatchlists, removeFromWatchlists
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
    isCurrent: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
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
      OwncurrentOrder: {},
      OwncurrentOrderFailedREason: ""
    };
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
    this.setState({ isAskingOwnCurrentOrder: true, OwncurrentOrderFailedREason: ""});
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
        this.setState({isAskingOwnCurrentOrder: false, OwncurrentOrderFailedREason: jsonResult.deatil, OwncurrentOrder:{}});
      }
      else{
        //console.log(jsonResult)
        this.setState({isAskingOwnCurrentOrder: false, OwncurrentOrder: jsonResult});
      }
    })
    .catch(function(reason) {
      console.log(reason);
      this.setState({isAskingOwnCurrentOrder: false, OwncurrentOrderFailedREason: reason, OwncurrentOrder:{}});
    });
  }

  addMoreHistoricalsOrder = () => {
    this.askOwnHistoricalsOrders(this.state.ownHistoricalsOrdersNextLink)
  }

  componentDidMount(){
    const { symbol, instrument, positions, watchlists, dispatch } = this.props;
    const { span, interval, bounds } = this.state.quotes;
    this.askOwnHistoricalsOrders();
    dispatch(askFundamental(symbol));
    dispatch(askNews(symbol));
    dispatch(askHistoricalsQuotes(symbol, span, interval, bounds));
    dispatch(askQuotes(symbol));
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
  }

  componentWillReceiveProps(nextProps){
    for(let i=0; i< nextProps.watchlists.length; i++){
      if(nextProps.watchlists[i].instrument === this.props.instrument){
        this.setState({isInWatchLists:true});
        return;
      }
    }
    this.setState({isInWatchLists:false});
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
    const { symbol, instrument, type, fundamentals, instruments, newsAll, historicalsQuotes, quotes, eachPosition } = this.props
    const { span, interval, bounds, selectedButtonName } = this.state.quotes;
    const { ownHistoricalsOrders, ownHistoricalsOrdersNextLink,
            isAskingOwnCurrentOrder, OwncurrentOrder, OwncurrentOrderFailedREason } = this.state;

    //show null if not cuttent page
    if(!this.props.isCurrent){ return null; }

    let statisticsBlock = (fundamentals[symbol])? <Statistics fundamental={fundamentals[symbol]} /> : "Loading...";
    let newsBlock = (newsAll[symbol])? <News news={newsAll[symbol]} /> : "Loading...";
    let quotesBlock = (historicalsQuotes[symbol+span+interval+bounds])?
      (<Quotes historicals={historicalsQuotes[symbol+span+interval+bounds].historicals}
               selectedButtonName={selectedButtonName}
      />): <DummyQuotes />;
    let ordersBlock = (ownHistoricalsOrders.length === 0)? null : (
      <SectionWrapper SectionTitle={"Orders"}>
        <Orders
          historicalsOrders={ownHistoricalsOrders}
          historicalsOrdersNextLink={ownHistoricalsOrdersNextLink}
          isAskingCurrentOrder={isAskingOwnCurrentOrder}
          currentOrder={OwncurrentOrder}
          currentOrderFailedREason={OwncurrentOrderFailedREason}
          instruments={instruments}
          addMoreHistoricalsOrder={this.addMoreHistoricalsOrder}
          askCurrentOrder={this.askOwnCurrentOrder}
          forInstrument={true}
        />
      </SectionWrapper>
    )
    let descriptionBlock = (fundamentals[symbol])? fundamentals[symbol].description : "Loading...";
    let positionBlock = null;

    //need to change
    if(type === "position"){
      positionBlock = (eachPosition[instrument] && quotes[symbol])? <Position quotes={quotes[symbol]} position={eachPosition[instrument]} /> : "Loading...";
    }

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">{symbol}</h1>
            <h2 className="instrumentH2">{instruments[instrument].name}</h2>
          </div>
          {(this.state.isInPositions)?null:(this.state.isInWatchLists)?<RemoveButton cb={this.removeFromWatchlists}/>:<AddButton cb={this.addToWatchlists}/>}
        </header>

        <SectionWrapper SectionTitle={""}>
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
        </SectionWrapper>

        {(type === "position")?
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
  const { instrumentsReducer, fundamentalsReducer, newsReducer, quotesReducer, positionsReducer, watchlistsReducer, tokenReducer } = state
  const { watchlists } = watchlistsReducer || { watchlists: []}
  const { instruments } = instrumentsReducer || { instruments: {}}
  const { fundamentals } = fundamentalsReducer || { fundamentals: {}}
  const { newsAll } = newsReducer || { newsAll: {}}
  const { historicalsQuotes, quotes } = quotesReducer || { historicalsQuotes: {}, quotes:{}}
  const { positions, eachPosition } = positionsReducer || { positions:[], eachPosition: {}}
  const { token } = tokenReducer || { token:"" }

  return { instruments, fundamentals, newsAll, historicalsQuotes, quotes, positions, eachPosition, watchlists, token }
}

export default connect(mapStateToProps)(Instrument)
