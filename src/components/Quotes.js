import React, { PropTypes } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import '../styles/Quotes.css'

const Quotes = ({ quotes }) => {
  return (
    <div className="quotesWrapper">
      <LineChart width={600} height={400} data={quotes.historicals} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <Line type="monotone" dataKey="high_price" stroke="#8884d8" />
        <XAxis dataKey="begins_at" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
      </LineChart>
    </div>
  )
}


Quotes.propTypes = {
  quotes: PropTypes.object.isRequired
}

export default Quotes
