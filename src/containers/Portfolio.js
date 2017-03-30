import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askHistoricalsPortfolios, askPortfolios
       } from '../actions'
import QuotesForPortfolios from '../components/QuotesForPortfolios'
import DummyQuotes from '../components/DummyQuotes'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/Portfolio.css'

class Portfolio extends Component {
  static propTypes = {
    historicalsPortfolios: PropTypes.object.isRequired,
    portfolios: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      quotes: {
        span: "day",
        interval: "5minute",
        bounds: "trading",
        selectedButtonName: "1D"
      }
    };
  }

  componentDidMount(){
    this.props.dispatch(askHistoricalsPortfolios("day", "5minute", "trading"));
    this.props.dispatch(askPortfolios());
  }

  changeHisQuotes = (span, interval, bounds, selectedButtonName)=>{
    this.setState({ quotes: { span: span, interval: interval, bounds: bounds, selectedButtonName: selectedButtonName } });
    this.props.dispatch(askHistoricalsPortfolios(span, interval, bounds));
  }


  render() {
    const { historicalsPortfolios, portfolios } = this.props
    const { span, interval, selectedButtonName } = this.state.quotes;

    let quotesBlock = (historicalsPortfolios[span+interval])?
      (<QuotesForPortfolios historicals={historicalsPortfolios[span+interval].equity_historicals}
               selectedButtonName={selectedButtonName}
      />): <DummyQuotes />;

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">Portfolio</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={"About"}>
          ${((portfolios.extended_hours_equity)?Number(portfolios.extended_hours_equity):portfolios.equity).toFixed(2)}
        </SectionWrapper>

        <SectionWrapper SectionTitle={""}>
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
  const { historicalsPortfolios, portfolios } = portfoliosReducer || { historicalsPortfolios: {}, portfolios: {}}

  return { historicalsPortfolios, portfolios }
}

export default connect(mapStateToProps)(Portfolio)
