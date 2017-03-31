import React, { Component } from 'react'
import Modal from 'react-modal'

const electron = window.require('electron');
const shell  = electron.shell;

import { printDate } from '../utils'
import '../styles/News.css'

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
  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false};
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  openUrlInBrowser = (e) => {
      e.preventDefault();
      shell.openExternal(e.target.href);
  }

  render() {
    let news = this.props.news;
    let threeNews = [];
    let allNews = [];
    for(let i=0; i<3; i++){
      if(news.results.length === i){ break; }
      threeNews.push(
        <div key={i} className="eachNews" >
          <div className="newsLink" >
            <a href={news.results[i].url} onClick={this.openUrlInBrowser} >
              {news.results[i].title}
            </a>
          </div>
          <div className="dateDiv">{ printDate(news.results[i].published_at)}</div>
        </div>
      );
    }
    for(let i=0; i<news.results.length; i++){
      allNews.push(
        <div key={i} className="eachNews" >
          <div className="newsLink" >
            <a href={news.results[i].url} onClick={this.openUrlInBrowser} >
              {news.results[i].title}
            </a>
          </div>
          <div className="dateDiv">{printDate(news.results[i].published_at)}</div>
        </div>
      );
    }

    return (
      <div className="newsWrapper">
        {threeNews}
        <div className="moreNewsWrapper">
          <button className="moreNews" onClick={this.openModal}>
            MORE
          </button>
        </div>

        <Modal
          isOpen={this.state.modalIsOpen}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="News Modal"
        >
          {allNews}
        </Modal>
      </div>
    )
  }
}
//<button onClick={this.closeModal}>CLOSE</button>
export default News
