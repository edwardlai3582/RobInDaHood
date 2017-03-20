import React, { PropTypes } from 'react'

const Statistics = ({ fundamental }) => {
  return (
    <section>
      { fundamental.open }
    </section>
  )
}


Statistics.propTypes = {
  fundamental: PropTypes.object.isRequired
}

export default Statistics
