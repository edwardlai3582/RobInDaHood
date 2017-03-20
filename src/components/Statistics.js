import React, { PropTypes } from 'react'

const Statistics = ({ fundamental }) => {
  return (
    <section>
      { fundamental.open }
    </section>
  )
}


Statistics.propTypes = {
  fundamentals: PropTypes.object.isRequired
}

export default Statistics
