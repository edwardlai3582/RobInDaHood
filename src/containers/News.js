import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import SectionWrapper from '../components/SectionWrapper'
import NewsCard from '../components/NewsCard'
import { askNews } from '../actions'
import { printDate } from '../utils'
import '../styles/News.css'

const electron = window.require('electron');
const shell  = electron.shell;

const customStyles = {
  content : {
    top                   : '50px',
    backgroundColor       : 'teal',
    textAlign             : 'left',
    padding               : '10px'
  },
  overlay :{ zIndex: 999 }
};

class News extends Component {
  static propTypes = {
    symbol: PropTypes.string.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false};
  }

  componentDidMount() {
    this.props.onFetchNews();
  }

  toggleModal = () => {
    this.setState({modalIsOpen: !this.state.modalIsOpen});
  }

  openUrlInBrowser = (e) => {
      e.preventDefault();
      shell.openExternal(e.target.href);
  }

  render() {
    const news = this.props.news;
    if(!news || news.results.length === 0) return null;

    let allNews = news.results.map((eachNews, index) => (
      <NewsCard
        key={index}
        url={eachNews.url}
        title={eachNews.title}
        published_at={printDate(eachNews.published_at)}
        openUrlInBrowser={this.openUrlInBrowser}
      />
    ));

    return (
      <SectionWrapper SectionTitle={"Recent News"}>
        {allNews.slice(0, 3)}
        <div className="moreNewsWrapper">
          <button className="moreNews" onClick={this.toggleModal}>
            MORE
          </button>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.toggleModal}
          style={customStyles}
          contentLabel="News Modal"
        >
          {allNews}
        </Modal>
      </SectionWrapper>
    )
  }
}

const mapStateToProps = ({ newsReducer }, ownProps) => {
  const { newsAll } = newsReducer;
  return { news: newsAll[ownProps.symbol] };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchNews: () => {
    dispatch(askNews(ownProps.symbol));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(News)
