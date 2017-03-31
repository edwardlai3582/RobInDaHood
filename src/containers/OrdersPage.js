import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import {
         askHistoricalsOrders
       } from '../actions'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/OrdersPage.css'

class OrdersPage extends Component {
  static propTypes = {
    historicalsOrders: PropTypes.array.isRequired
  }

  constructor(props) {
    super(props);
  }

  componentDidMount(){
    this.props.dispatch(askHistoricalsOrders());
  }

  render() {
    const { historicalsOrders } = this.props
    let recentOrders = historicalsOrders.map((order, i)=>{
      return (
        <div key={i}>
          {(Number(order.quantity) * Number(order.average_price)).toFixed(2)}
        </div>
      )
    })

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">Orders</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={"Recent Orders"}>
          {recentOrders}
        </SectionWrapper>
      </div>
    )
  }
}
/*


*/
const mapStateToProps = state => {
  const { ordersReducer } = state
  const { historicalsOrders } = ordersReducer || { historicalsOrders: [] }

  return { historicalsOrders }
}

export default connect(mapStateToProps)(OrdersPage)
