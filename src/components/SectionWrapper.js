import React, { PropTypes } from 'react'
import '../styles/SectionWrapper.css'

const SectionWrapper = ({ SectionTitle, children }) => {
  return (
    <section className="SectionWrapper">
      <h3 className="sectionH3">{SectionTitle}</h3>
      <div className="sectionChildrenWrapper">{children}</div>
    </section>
  )
}


SectionWrapper.propTypes = {
  SectionTitle: PropTypes.string.isRequired
}

export default SectionWrapper
