import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askHistoricalsPortfolios, askPortfolios
       } from '../actions'
import QuotesForPortfolios from '../components/QuotesForPortfolios'
import DummyQuotes from '../components/DummyQuotes'
import SectionWrapper from '../components/SectionWrapper'
import HistoryPriceDisplay from '../components/HistoryPriceDisplay'
import '../styles/PortfolioPage.css'

class PortfolioPage extends Component {
  static propTypes = {
    historicalsPortfolios: PropTypes.object.isRequired,
    portfolios: PropTypes.object.isRequired,
    isCurrent: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      quotes: {
        span: "day",
        interval: "5minute",
        bounds: "trading",
        selectedButtonName: "1D"
      },
      threeMinutesInterval: undefined,
      oneMinuteInterval: undefined
    };
  }

  componentDidMount(){
    this.props.dispatch(askHistoricalsPortfolios("day", "5minute", "trading"));
    this.props.dispatch(askPortfolios());

    // store intervalId in the state so it can be accessed later:
    let intervalThree = setInterval(this.threeMinutesJobs, 180000);
    this.setState({threeMinutesInterval: intervalThree});
    let intervalOne = setInterval(this.oneMinuteJobs, 30000);
    this.setState({oneMinuteInterval: intervalOne})
  }

  componentWillUnmount() {
    clearInterval(this.state.threeMinutesInterval);
    clearInterval(this.state.oneMinuteInterval);
  }

  threeMinutesJobs = () => {
    /*
    const { span, interval, bounds, selectedButtonName } = this.state.quotes;
    if(selectedButtonName === "1D"){
      this.props.dispatch(askHistoricalsPortfolios(span, interval, bounds));
    }
    */
  }

  oneMinuteJobs = () => {
    const { span, interval, bounds, selectedButtonName } = this.state.quotes;
    if(selectedButtonName === "1D"){
      this.props.dispatch(askHistoricalsPortfolios(span, interval, bounds));
    }
    this.props.dispatch(askPortfolios());
  }

  changeHisQuotes = (span, interval, bounds, selectedButtonName) => {
    this.setState({ quotes: { span: span, interval: interval, bounds: bounds, selectedButtonName: selectedButtonName } });
    this.props.dispatch(askHistoricalsPortfolios(span, interval, bounds));
  }


  render() {
    const { historicalsPortfolios, portfolios } = this.props
    const { span, interval, selectedButtonName } = this.state.quotes;

    //show null if not cuttent page
    if(!this.props.isCurrent){ return null; }


    let priceRelatedBlock = (portfolios && historicalsPortfolios[span+interval])? (
      <div className="priceRelatedWrapper">
        <div className="last_trade_price">
          { `$${(portfolios.extended_hours_equity)? Number(portfolios.extended_hours_equity).toFixed(2) : Number(portfolios.last_core_equity).toFixed(2)}` }
        </div>
        <HistoryPriceDisplay
          selectedButtonName={selectedButtonName}
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
          selectedButtonName={selectedButtonName}
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
          <div className="quotesButtonsWrapper">
            <button className={selectedButtonName==="1D"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("day", "5minute", "trading", "1D")}>1D</button>
            <button className={selectedButtonName==="1W"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("week", "10minute", "", "1W")}>1W</button>
            <button className={selectedButtonName==="1M"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("year", "day", "", "1M")}>1M</button>
            <button className={selectedButtonName==="3M"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("year", "day", "", "3M")}>3M</button>
            <button className={selectedButtonName==="1Y"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("year", "day", "", "1Y")}>1Y</button>
            <button className={selectedButtonName==="ALL"? "quotesButton selectedButton": "quotesButton"}
                    onClick={() => this.changeHisQuotes("all", "", "", "ALL")}>ALL</button>
          </div>
        </SectionWrapper>
      </div>
    )
  }
}
/*


*/
const mapStateToProps = state => {
  const { portfoliosReducer } = state
  const { historicalsPortfolios, portfolios } = portfoliosReducer || { historicalsPortfolios: {}, portfolios: {} }

  return { historicalsPortfolios, portfolios }
}

export default connect(mapStateToProps)(PortfolioPage)
