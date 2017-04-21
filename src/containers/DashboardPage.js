import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { deleteToken,
         askAccount,
         askWatchlists,
         askPositions, askPositionsWithZero,
         askMultipleQuotes,
         addTab, selectTab,
         addInstrument,
         resetPlaceOrderRelated,
         toggleLocalWatchlist,
         toggleLocalPosition,
         toggleWatchlistsModule, togglePositionsModule,
         askCards,
         askMonitorTickers
       } from '../actions'
import Dashboard from '../components/Dashboard'
import LeftPanelItem from '../components/LeftPanelItem'
import Search from '../components/Search'
import LeftPanelModule from '../components/LeftPanelModule'
import RightPanel from './RightPanel'
import '../styles/DashboardPage.css'

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    padding               : '10px',
    transform             : 'translate(-50%, -50%)'
  },
  overlay :{ zIndex: 999 }
};

class DashboardPage extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    keys: PropTypes.array.isRequired,
    selectedKey: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
    watchlists: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired,
    positionsWithZero: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired,
    localWatchlists: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      fifteenSecondsInterval: undefined
    };
  }

  componentDidMount() {
    const {
      onAskAccount,
      onAskWatchlists,
      onAskPositions,
      onAskPositionsWithZero,
      onAskMultipleQuotes,
      onResetPlaceOrderRelated,
      onAskCards,
      onAskMonitorTickers,
      keys
    } = this.props

    onAskWatchlists();
    onAskPositions();
    onAskPositionsWithZero();
    onAskAccount();
    onResetPlaceOrderRelated();
    onAskMultipleQuotes();
    onAskCards();
    onAskMonitorTickers();
    //if no tabs, show portfolio page
    if(keys.length === 0){
      this.handleaddNonStockTab("portfolio")
    }

    // store intervalId in the state so it can be accessed later:
    let intervalFifteen = setInterval(this.fifteenSecondsJobs, 15000);
    this.setState({fifteenSecondsInterval: intervalFifteen});

    ipcRenderer.on('asynchronous-reply', (event, arg) => {
      console.log(arg);
    });
    ipcRenderer.on('notification-clicked', (event, arg) => {
      console.log(arg);
      if(arg.instrumentId && arg.instrumentId.length > 0 ) {
        let temp = {};
        temp.instrument = `https://api.robinhood.com/instruments/${arg.instrumentId}/`;
        temp.type = "watchlist";
        temp.symbol = this.props.instruments[temp.instrument].symbol;
        if(this.props.instruments[temp.instrument] && this.props.instruments[temp.instrument].symbol) {
          this.handleaddTabFromSearch(temp);  
        }
      }
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.fifteenSecondsInterval);
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.cardsLastUpdated !== this.props.cardsLastUpdated) {
      nextProps.cards.forEach((card) => {
        ipcRenderer.send('cards', card);
      })
    }
  }

  fifteenSecondsJobs = () => {
    this.props.onAskMultipleQuotes();
    this.props.onAskMonitorTickers();
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = 'black';
    this.refs.logoutButton.style.color = 'white';
    this.refs.logoutButton.style.backgroundColor = '#40C9BD';
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  logout = () => { this.props.onDeleteToken() }

  handleaddTab = (data) => {
    console.log(data);
    const key = data.symbol;

    if(this.props.keys.indexOf(key) !== -1) {
      this.props.onSelectTab(key);
      return;
    }

    //let type = (data.type==="watchlist" || data.type==="positions")? "instrument" : "others"
    let newTab = {
      key: key,
      title: data.symbol,
      instrument: data.instrument,
      type: data.type
    }

    this.props.onAddTab(key, newTab);
  }

  handleaddNonStockTab = (name) => {
    const key = name;

    if(this.props.keys.indexOf(key) !== -1) {
      this.props.onSelectTab(key);
      return;
    }

    //let type = (data.type==="watchlist" || data.type==="positions")? "instrument" : "others"
    let newTab = {
      key: key,
      title: name,
      instrument: {},
      type: name
    }

    this.props.onAddTab(key, newTab);
  }

  handleaddTabFromSearch = (data) => {
    this.props.onAddInstrument(data);
    console.log(data);
    const key = data.symbol;

    if(this.props.keys.indexOf(key) !== -1) {
      this.props.onSelectTab(key);
      return;
    }

    //let type = (data.type==="watchlist" || data.type==="positions")? "instrument" : "others"
    let newTab = {
      key: key,
      title: data.symbol,
      instrument: data.instrument,
      type: data.type
    }

    this.props.onAddTab(key, newTab);
  }

  render() {
    const {
      watchlists,
      positions,
      instruments,
      selectedKey,
      localWatchlists, localPositions,
      quotes,
      watchlistsModuleOpen,
      positionsModuleOpen,
      onToggleWatchlistsModule,
      onTogglePositionsModule,
      onToggleLocalWatchlist,
      onToggleLocalPosition
    } = this.props
    let watchlistsMenu = "loading watchlists...";
    let positionsMenu = "loading positions...";
    let instrumentsHasAllNeeded = true;

    for(let i=0; i< watchlists.length; i++){
      if( !instruments.hasOwnProperty(watchlists[i].instrument) ){
        instrumentsHasAllNeeded = false;
        break;
      }
    }
    if(instrumentsHasAllNeeded){
      for(let i=0; i< positions.length; i++){
        if( !instruments.hasOwnProperty(positions[i].instrument) ){
          instrumentsHasAllNeeded = false;
          break;
        }
      }
    }

    if(instrumentsHasAllNeeded){
      let watchlistsData = [];
      localWatchlists.forEach((localWatchlist) => {
        let localWatchlistData = localWatchlist.list.filter((instrument)=>{
          for(let i=0; i< positions.length; i++){
            if((positions[i].instrument === instrument)){
              return false;
            }
          }
          if(!instruments[instrument] || !instruments[instrument].symbol) {
            return false;
          }
          return true;
        })
        .map((instrument, i)=>{
          return {
            instrument: instrument,
            symbol: instruments[instrument].symbol,
            type: 'watchlist'
          };
        });

        watchlistsData.push(localWatchlistData);
      });

      watchlistsMenu = (
        <LeftPanelModule
          moduleName="WATCHLIST"
          localLists={localWatchlists}
          listsData={watchlistsData}
          selectedKey={selectedKey}
          callback={this.handleaddTab}
          toggleLocallist={ (index) => onToggleLocalWatchlist(index) }
          toggleModule={ () => onToggleWatchlistsModule() }
          moduleOpen={watchlistsModuleOpen}
          quotes={quotes}
        />
      )

      let positionsData = [];
      localPositions.forEach((localPosition) => {
        let localPositionData = localPosition.list.filter((instrument) => {
          if(!instruments[instrument] || !instruments[instrument].symbol) {
            return false;
          }
          return true;
        }).map((instrument, i)=>{
          return {
            instrument: instrument,
            symbol: instruments[instrument].symbol,
            type: 'position'
          };
        });

        positionsData.push(localPositionData);
      });

      positionsMenu = (<LeftPanelModule
        moduleName="POSITIONS"
        localLists={localPositions}
        listsData={positionsData}
        selectedKey={selectedKey}
        callback={this.handleaddTab}
        toggleLocallist={ (index) => onToggleLocalPosition(index) }
        toggleModule={ () => onTogglePositionsModule() }
        moduleOpen={positionsModuleOpen}
        quotes={quotes}
      />);

    }

    return (
      <div>
        <Dashboard>
          <div className="leftPanelDiv">
            <Search className="leftPanelSearch" callback={this.handleaddTabFromSearch} />
            <div className="leftPanelRest">
              <LeftPanelItem
                symbol={"PORTFOLIO"}
                id={"portfolio"}
                onClick={()=>this.handleaddNonStockTab("portfolio")}
                className={selectedKey === "portfolio"? "leftSingleDiv selectedModuleDiv" : "leftSingleDiv"}
              />
              {positionsMenu}
              {watchlistsMenu}
              <LeftPanelItem
                symbol={"HISTORY"}
                id={"history"}
                onClick={()=>this.handleaddNonStockTab("history")}
                className={selectedKey === "history"? "leftSingleDiv selectedModuleDiv" : "leftSingleDiv"}
              />
              <LeftPanelItem
                symbol={"PRICE ALERT"}
                id={"priceAlert"}
                onClick={()=>this.handleaddNonStockTab("priceAlert")}
                className={selectedKey === "priceAlert"? "leftSingleDiv selectedModuleDiv" : "leftSingleDiv"}
              />
            </div>
            <button onClick={this.openModal} className="leftPanellogoutButton">
              LOG OUT
            </button>
          </div>
          <RightPanel />
        </Dashboard>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="LogOut Modal"
        >
          <p ref="subtitle">Are you sure you want to log out?</p>
          <div className="logoutModalButtonsWrapper">
            <button onClick={this.closeModal}>CANCEL</button>
            <button ref="logoutButton" onClick={this.logout}>LOG OUT</button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = ({
  tokenReducer,
  tabsReducer,
  accountReducer,
  watchlistsReducer,
  positionsReducer,
  instrumentsReducer,
  localReducer,
  uiReducer,
  quotesReducer,
  cardsReducer
}, ownProps) => {
  const { token } = tokenReducer;
  const { keys, selectedKey } = tabsReducer;
  const { accountNumber } = accountReducer;
  const { watchlists } = watchlistsReducer;
  const { localWatchlists, localPositions } = localReducer;
  const { positions, positionsWithZero } = positionsReducer;
  const { instruments } = instrumentsReducer;
  const { watchlistsModuleOpen, positionsModuleOpen } = uiReducer;
  const { quotes } = quotesReducer;
  const { cards, cardsLastUpdated } = cardsReducer;

  return {
    token,
    keys, selectedKey,
    accountNumber,
    watchlists,
    positions, positionsWithZero,
    instruments,
    localWatchlists, localPositions,
    watchlistsModuleOpen, positionsModuleOpen,
    quotes,
    cards, cardsLastUpdated
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onDeleteToken: () => {
    dispatch(deleteToken());
  },
  onAskAccount: () => {
    dispatch(askAccount());
  },
  onAskWatchlists: () => {
    dispatch(askWatchlists());
  },
  onAskPositions: () => {
    dispatch(askPositions());
  },
  onAskPositionsWithZero: () => {
    dispatch(askPositionsWithZero());
  },
  onAskMultipleQuotes: () => {
    dispatch(askMultipleQuotes());
  },
  onAddTab: (key, newTab) => {
    dispatch(addTab(key, newTab));
  },
  onSelectTab: (key) => {
    dispatch(selectTab(key));
  },
  onAddInstrument: (instrument) => {
    dispatch(addInstrument(instrument));
  },
  onResetPlaceOrderRelated: () => {
    dispatch(resetPlaceOrderRelated());
  },
  onToggleLocalWatchlist: (index) => {
    dispatch(toggleLocalWatchlist(index));
  },
  onToggleLocalPosition: (index) => {
    dispatch(toggleLocalPosition(index));
  },
  onToggleWatchlistsModule: () => {
    dispatch(toggleWatchlistsModule());
  },
  onTogglePositionsModule: () => {
    dispatch(togglePositionsModule());
  },
  onAskCards: () => {
    dispatch(askCards());
  },
  onAskMonitorTickers: () => {
    dispatch(askMonitorTickers());
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(DashboardPage)
