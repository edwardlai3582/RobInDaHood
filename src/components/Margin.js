import React, { Component, PropTypes } from 'react'
import SectionWrapper from './SectionWrapper'
import '../styles/Margin.css'

class Margin extends Component {
  static propTypes = {
    ownInstrument: PropTypes.object.isRequired,
    buyingPower: PropTypes.number.isRequired,
  }

  render() {
    const { ownInstrument, buyingPower } = this.props;

    return (
      <SectionWrapper SectionTitle={"Margin Requirements"}>
        <div className="marginEach">
          <div className="marginEachTitle"> Initial Requirement </div>
          <div className="marginEachValue"> {`${Number(ownInstrument.margin_initial_ratio)*100}%`} </div>
        </div>
        <div className="marginEach">
          <div className="marginEachTitle"> Maintenance Requirement </div>
          <div className="marginEachValue"> {`${Number(ownInstrument.maintenance_ratio)*100}%`} </div>
        </div>
        <div className="marginEach">
          <div className="marginEachTitle"> {`Buying Power for ${ownInstrument.symbol}`}  </div>
          <div className="marginEachValue"> {`$${(buyingPower <= 0)? 0 : buyingPower.toFixed(2)}`} </div>
        </div>
      </SectionWrapper>
    )
  }
}


export default Margin
