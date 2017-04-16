import React, { PropTypes } from 'react'
import '../styles/Statistics.css'

const StatisticsCard = ({ type, num }) => (
  <div className="statisticsDiv">
    <div className="statisticsNum"> {num} </div>
    <div className="statisticsType"> {type} </div>
  </div>
)

StatisticsCard.propTypes = {
  type: PropTypes.string.isRequired,
  num: PropTypes.string.isRequired
}

export default StatisticsCard
