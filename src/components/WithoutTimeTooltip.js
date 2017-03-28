import React, { Component, PropTypes } from 'react'

class WithoutTimeTooltip extends Component {
  static propTypes = {
    type: PropTypes.string,
    payload: PropTypes.array,
    label: PropTypes.string,
  }

  render() {
    const { active } = this.props;

    if (active) {
      const { payload, label } = this.props;
      let date = new Date(label);
      let dateLabel = (date.getMonth()+1)+"/"+date.getDate()+"/"+date.getFullYear();

      return (
        <div>
          <div>{dateLabel}</div>
          <div style={{color:"teal"}}>{payload[0].value}</div>
        </div>
      );
    }

    return null;
  }
}

export default WithoutTimeTooltip
