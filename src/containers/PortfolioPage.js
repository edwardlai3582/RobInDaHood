import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
 askHistoricalsPortfolios,
 askPortfolios,
 updatePortfolioPageQuote,
 setPortfolioPageSelectedButton
} from '../actions'
import QuotesForPortfolios from '../components/QuotesForPortfolios'
import DummyQuotes from '../components/DummyQuotes'
import SectionWrapper from '../components/SectionWrapper'
import HistoryPriceDisplay from '../components/HistoryPriceDisplay'
import PortfolioValue from './PortfolioValue'
import BuyingPower from './BuyingPower'
import '../styles/PortfolioPage.css'

import EditableLocalPositions from './EditableLocalPositions'
import EditableLocalWatchLists from './EditableLocalWatchLists'

class PortfolioPage extends Component {

  static propTypes = {
    historicalsPortfolios: PropTypes.object.isRequired,
    portfolios: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.oneMinuteInterval = undefined;
    this.quoteOptions = [
      {
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
      }
    ];
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
    this.oneMinuteInterval = setInterval(this.oneMinuteJobs, 15000);
  }

  clearPortfolioPoller = () => {
    clearInterval(this.oneMinuteInterval);
  }

  handleQuoteButtonClick = (id, quotes) => {
    return () => {
      if(id === this.props.selectedButton) {
        return;
      }
      this.props.onQuoteChanged(id, quotes);
    }
  }

  renderQuoteChangeButtons = () => {
    const { selectedButton } = this.props;
    return (
      <div className="quotesButtonsWrapper">
        {
          this.quoteOptions.map(({ id, display, span, interval, bounds }, index) => {
            const isButtonSelected = selectedButton === id;
            const buttonClassName = `quotesButton ${ isButtonSelected && "selectedButton"}`
            return (
              <button
                key={ index }
                className={ buttonClassName }
                onClick={ this.handleQuoteButtonClick( id, {
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
    this.props.onQuoteChanged("1D", {
      span: 'day',
      interval: '5minute',
      bounds: 'trading'
    });
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
      quotes,
      selectedButton
    } = this.props

    const { span, interval } = quotes;

    //show null if not current page
    if(!isCurrent){ return null; }

    let priceRelatedBlock = (portfolios && historicalsPortfolios[span+interval])? (
      <div className="priceRelatedWrapper">
        <div className="last_trade_price">
          { `$${(portfolios.extended_hours_equity)? Number(portfolios.extended_hours_equity).toFixed(2) : Number(portfolios.equity).toFixed(2)}` }
        </div>
        <HistoryPriceDisplay
          selectedButtonName={selectedButton}
          historicals={historicalsPortfolios[span+interval].equity_historicals}
          previous_close={portfolios.adjusted_equity_previous_close.toString()}
          last_trade_price={(portfolios.extended_hours_equity)? Number(portfolios.extended_hours_equity).toFixed(2) : Number(portfolios.equity).toFixed(2)}
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
          last_equity={(portfolios.extended_hours_equity)? Number(portfolios.extended_hours_equity) : Number(portfolios.equity)}
      />): <DummyQuotes />;

    let portfolioValueBlock = ( portfolios )? (
      <PortfolioValue
        market_value={ (portfolios.extended_hours_market_value)? portfolios.extended_hours_market_value : portfolios.market_value }
        equity={ (portfolios.extended_hours_equity)? Number(portfolios.extended_hours_equity).toFixed(2) : Number(portfolios.equity).toFixed(2) }
      />
    ) : null;

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">Portfolio</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={""}>
          { priceRelatedBlock }
          { quotesBlock }
          { this.renderQuoteChangeButtons() }
        </SectionWrapper>

        { portfolioValueBlock }
        { <BuyingPower /> }

        <EditableLocalPositions />
        <EditableLocalWatchLists />
      </div>
    )
  }
}

const mapStateToProps = ({ portfoliosReducer }) => {
  const {
    historicalsPortfolios = {},
    portfolios = {},
    selectedButton,
    quotes
  } = portfoliosReducer;

  return {
    quotes,
    selectedButton,
    historicalsPortfolios,
    portfolios
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
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(PortfolioPage)
