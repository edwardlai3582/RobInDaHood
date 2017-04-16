import React, { PropTypes } from 'react'
import '../styles/News.css'

const NewsCard = ({ url, title, published_at, openUrlInBrowser }) => (
  <div className="eachNews" >
    <div className="newsLink" >
      <a href={url} onClick={openUrlInBrowser} >
        {title}
      </a>
    </div>
    <div className="dateDiv">{published_at}</div>
  </div>
)

NewsCard.propTypes = {
  url: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  published_at: PropTypes.string.isRequired,
  openUrlInBrowser: PropTypes.func.isRequired
}

export default NewsCard
