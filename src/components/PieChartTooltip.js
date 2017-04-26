import React, { Component, PropTypes } from 'react'

class PieChartTooltip extends Component {
  static propTypes = {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string,
  }

  render() {
    const { active, payload } = this.props;

    if (active) {
      let { name, quantity, last_trade_price, value, total} = payload[0];

      return (
        <div>
          <div style={{marginBottom: "2px", color:"teal", fontWeight:"bold"}}>
            {name}
          </div>
          {(quantity)? (
            <div> {`${quantity} X $${last_trade_price.toFixed(2)}`} </div>
          ) : null}

          <div style={{borderTop: "1px solid black", paddingTop: "2px", marginTop: "2px"}}>
            {(total)? `$${value.toFixed(2)} (${(value/total*100).toFixed(2)}%)` : `$${value.toFixed(2)}` }
          </div>
        </div>
      );
    }

    return null;
  }
}

export default PieChartTooltip
