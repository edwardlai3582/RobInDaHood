import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
 askHistoricalsPortfolios,
 askPortfolios,
 reorderLocalWatchlist,
 addLocalWatchlistFolder,
 deleteLocalWatchlistFolder,
 reorderLocalWatchlists,
 renameLocalWatchlistFolder,
 reorderLocalPosition,
 addLocalPositionFolder,
 deleteLocalPositionFolder,
 reorderLocalPositions,
 renameLocalPositionFolder,
 updatePortfolioPageQuote,
 setPortfolioPageSelectedButton
} from '../actions'
import QuotesForPortfolios from '../components/QuotesForPortfolios'
import DummyQuotes from '../components/DummyQuotes'
import SectionWrapper from '../components/SectionWrapper'
import HistoryPriceDisplay from '../components/HistoryPriceDisplay'
import '../styles/PortfolioPage.css'

import ListContainer from '../components/ListContainer'

class PortfolioPage extends Component {

  static propTypes = {
    historicalsPortfolios: PropTypes.object.isRequired,
    portfolios: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired,
    localWatchlists: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.oneMinuteInterval = undefined;
    this.quoteOptions = [{
      id: '1D',
      display: '1D',
      span: 'day',
      interval: '5minute',
      bounds: 'trading'
    },
    {
      id: '1W',
      display: '1W',
      span: 'week',
      interval: '10minute',
      bounds: ''
    },
    {
      id: '1M',
      display: '1M',
      span: 'year',
      interval: 'day',
      bounds: ''
    },
    {
      id: '3M',
      display: '3M',
      span: 'year',
      interval: 'day',
      bounds: ''
    },
    {
      id: '1Y',
      display: '1Y',
      span: 'year',
      interval: 'day',
      bounds: ''
    },
    {
      id: 'all',
      display: 'ALL',
      span: 'all',
      interval: '',
      bounds: ''
    }];
  }

  oneMinuteJobs = () => {
    const { quotes, selectedButton } = this.props;
    // Only poll history if we are looking at the 1D tab
    if(selectedButton === '1D'){
      this.props.onFetchPortfolioHistory(quotes);
    }
    this.props.onFetchPortfolio();
  }

  startPortfolioPoller = () => {
    this.oneMinuteInterval = setInterval(this.oneMinuteJobs, 60000);
  }

  clearPortfolioPoller = () => {
    clearInterval(this.oneMinuteInterval);
  }

  renderQuoteChangeButtons = () => {
    const { selectedButton, onQuoteChanged } = this.props;
    return (
      <div className="quotesButtonsWrapper">
        {
          this.quoteOptions.map(({ id, display, span, interval, bounds }, index) => {
            const isButtonSelected = selectedButton === id;
            const buttonClassName = `quotesButton ${ isButtonSelected && selectedButton}`
            return (
              <button
                key={ index }
                className={ buttonClassName }
                onClick={ onQuoteChanged.bind(this, id, {
                  span,
                  interval,
                  bounds
                })}
              >
                { display }
              </button>
            );
          })
        }
      </div>
    );
  }

  shouldFetchHistoryAgain = (oldQuotes, newQuotes) => {
    return (
      oldQuotes.span !== newQuotes.span ||
      oldQuotes.interval !== newQuotes.interval ||
      oldQuotes.bounds !== newQuotes.bounds
    )
  }

  componentWillReceiveProps({ quotes: newQuotes }){
    // check the old quote and new quotes if it has changed requery for the history
    const { quotes: oldQuotes, onFetchPortfolioHistory } = this.props;
    // Should replace this with shallow-compare from react-addons
    // or some equivalent object equality checker
    const requeryForHistory = this.shouldFetchHistoryAgain(oldQuotes, newQuotes);
    if(requeryForHistory){
      onFetchPortfolioHistory(newQuotes);
    }
  }

  componentDidMount(){
    // Fetch initial data for the portfolio
    this.props.onFetchPortfolioHistory(this.props.quotes);
    this.props.onFetchPortfolio();
    // Start the 1 minute poller to requery for data
    this.startPortfolioPoller();
  }

  componentWillUnmount() {
    this.clearPortfolioPoller();
  }

  render() {
    const {
      isCurrent,
      historicalsPortfolios,
      portfolios,
      localWatchlists,
      localPositions,
      instruments,
      positions,
      quotes,
      selectedButton,
      // position handlers
      onAddFolder,
      onDeleteFolder,
      onReorderPosition,
      onReorderLocalPosition,
      onRenameLocalPosition,
      // watchlist handlers,
      onAddWatchListFolder,
      onDeleteWatchListFolder,
      onReorderWatchList,
      onReorderLocalWatchList,
      onRenameWatchListFolder
    } = this.props

    const { span, interval } = quotes;

    //show null if not cuttent page
    if(!isCurrent){ return null; }

    let priceRelatedBlock = (portfolios && historicalsPortfolios[span+interval])? (
      <div className="priceRelatedWrapper">
        <div className="last_trade_price">
          { `$${(portfolios.extended_hours_equity)? Number(portfolios.extended_hours_equity).toFixed(2) : Number(portfolios.last_core_equity).toFixed(2)}` }
        </div>
        <HistoryPriceDisplay
          selectedButtonName={selectedButton}
          historicals={historicalsPortfolios[span+interval].equity_historicals}
          previous_close={portfolios.adjusted_equity_previous_close.toString()}
          last_trade_price={portfolios.last_core_equity}
          last_extended_hours_trade_price={portfolios.extended_hours_equity}
          updated_at={historicalsPortfolios[span+interval].open_time}
        />
      </div>
    ) : null;

    let quotesBlock = (portfolios && historicalsPortfolios[span+interval])?
      (<QuotesForPortfolios
          historicals={historicalsPortfolios[span+interval].equity_historicals}
          selectedButtonName={selectedButton}
          previous_close={portfolios.adjusted_equity_previous_close}
      />): <DummyQuotes />;

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">Portfolio</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={""}>
          {priceRelatedBlock}
          {quotesBlock}
          { this.renderQuoteChangeButtons() }
        </SectionWrapper>

        <SectionWrapper SectionTitle={""}>
          <div className="addFolderWrapper">
            <h6>Positions</h6>
            <button
              className="addFolderButton"
              onClick={ onAddFolder.bind(this, localPositions.length) }
            >
              ADD FOLDER
            </button>
          </div>
          <ListContainer
            localLists={localPositions}
            instruments={instruments}
            checkLists={[]}
            reorderLocalList={ onReorderPosition }
            deleteLocalListFolder={ onDeleteFolder }
            reorderLocalLists={ onReorderLocalPosition }
            renameLocallistFolder={ onRenameLocalPosition }
          />
        </SectionWrapper>

        <SectionWrapper SectionTitle={""}>
          <div className="addFolderWrapper">
            <h6>Watchlists</h6>
            <button
              className="addFolderButton"
              onClick={ onAddWatchListFolder.bind(this, localWatchlists.length) }
            >
              ADD FOLDER
            </button>
          </div>
          <ListContainer
            localLists={localWatchlists}
            instruments={instruments}
            checkLists={positions}
            reorderLocalList={ onReorderWatchList }
            deleteLocalListFolder={ onDeleteWatchListFolder }
            reorderLocalLists={ onReorderLocalWatchList }
            renameLocallistFolder={ onRenameWatchListFolder }
          />
        </SectionWrapper>
      </div>
    )
  }
}

const mapStateToProps = ({ portfoliosReducer, localReducer, instrumentsReducer, positionsReducer }) => {
  const {
    historicalsPortfolios = {},
    portfolios = {},
    selectedButton,
    quotes
  } = portfoliosReducer;
  const {
    localPositions = [],
    localWatchlists = []
  } = localReducer;
  const { positions = [] } = positionsReducer;
  const { instruments = {} } = instrumentsReducer;
  return {
    quotes,
    selectedButton,
    historicalsPortfolios,
    portfolios,
    localPositions,
    localWatchlists,
    instruments,
    positions
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchPortfolioHistory: ({ span, interval, bounds }) => {
    dispatch(askHistoricalsPortfolios(span, interval, bounds));
  },
  onFetchPortfolio: () => {
    dispatch(askPortfolios());
  },
  onQuoteChanged: (selectedButton, quote) => {
    dispatch(updatePortfolioPageQuote(quote));
    dispatch(setPortfolioPageSelectedButton(selectedButton));
  },
  // position handlers - consider moving into another file as well as rendering code
  onAddFolder: (folderIndex) => {
    dispatch(addLocalPositionFolder(`Folder ${folderIndex}`));
  },
  onDeleteFolder: (index, position ) => {
    dispatch(deleteLocalPositionFolder(index));
  },
  onReorderPosition: (positionIndex, position ) => {
    dispatch(reorderLocalPosition(positionIndex, position));
  },
  onReorderLocalPosition: (aI, bI) => {
    dispatch(reorderLocalPositions(aI, bI));
  },
  onRenameLocalPosition: (index, name) => {
    dispatch(renameLocalPositionFolder(index, name));
  },
  // watch list handlers - consider moving into another file as well as rendering code
  onAddWatchListFolder: (folderIndex) => {
    dispatch(addLocalWatchlistFolder(`Folder ${folderIndex}`));
  },
  onDeleteWatchListFolder: (index) => {
    dispatch(deleteLocalWatchlistFolder(index));
  },
  onReorderWatchList: (watchlistIndex, watchlist) => {
    dispatch(reorderLocalWatchlist(watchlistIndex, watchlist));
  },
  onReorderLocalWatchList: (aI, bI) => {
    dispatch(reorderLocalWatchlists(aI, bI));
  },
  onRenameWatchListFolder: (index, name) => {
    dispatch(renameLocalWatchlistFolder(index, name));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPage)
