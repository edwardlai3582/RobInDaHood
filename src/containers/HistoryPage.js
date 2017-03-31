import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import {
         askHistoricalsOrders
       } from '../actions'
import SectionWrapper from '../components/SectionWrapper'
import '../styles/HistoryPage.css'

const capFirst = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

const printDate = (dateString) => {
  let newsDate = new Date(dateString);
  return `${newsDate.getMonth()+1}/${newsDate.getDate()}/${newsDate.getFullYear()}`
}

const customStyles = {
  content : {
    top                   : '50px',
    backgroundColor       : 'teal',
    textAlign             : 'left',
    padding               : '10px'
  },
  overlay :{ zIndex: 999 }
};

class HistoryPage extends Component {
  static propTypes = {
    historicalsOrders: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);
    this.state = {
      modalIsOpen: false,
      selectedOrder: null
    };
  }

  componentDidMount(){
    this.props.dispatch(askHistoricalsOrders());
  }

  openModal = (order) => {
    this.setState({
      modalIsOpen: true,
      selectedOrder: order
    });
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  afterOpenModal = () => {

  }

  render() {
    const { historicalsOrders, instruments } = this.props
    let recentOrders = historicalsOrders.map((order, i)=>{
      return (
        <div key={i} className="orderWrapper" onClick={()=> this.openModal(order)} >
          <div>
            {instruments[order.instrument].symbol+": "+capFirst(order.type)+" "+capFirst(order.side)}
            <div className="orderHisDate">
              {printDate(order.updated_at)}
            </div>
          </div>
          <div>
            {(order.state === "filled")?
              "$"+(Number(order.quantity) * Number(order.average_price)).toFixed(2) : capFirst(order.state)}
          </div>
        </div>
      )
    })

    return (
      <div className="instrumentWrapper">
        <div className="instrumentFake"></div>
        <header>
          <div>
            <h1 className="instrumentH1">History</h1>
          </div>
        </header>

        <SectionWrapper SectionTitle={"Recent Orders"}>
          {recentOrders}
        </SectionWrapper>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Order Modal"
        >
          {(this.state.selectedOrder)? (
            <div>
              <header style={{backgroundColor: "teal"}} >
                <h6>
                  {capFirst(this.state.selectedOrder.type)+" "+capFirst(this.state.selectedOrder.side)}
                </h6>
                <h2>
                  {instruments[this.state.selectedOrder.instrument].name}
                </h2>
              </header>
              <section style={{backgroundColor: "white", color: "black"}} >
                <div>{this.state.selectedOrder.state}</div>
                <div>{this.state.selectedOrder.time_in_force}</div>
                <div>{printDate(this.state.selectedOrder.updated_at)}</div>
                <div>{this.state.selectedOrder.type}</div>
                <div>{this.state.selectedOrder.quantity}</div>
              </section>
            </div>
          ) : "" }
        </Modal>
      </div>
    )
  }
}
/*


*/
const mapStateToProps = state => {
  const { ordersReducer, instrumentsReducer } = state
  const { historicalsOrders } = ordersReducer || { historicalsOrders: [] }
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { historicalsOrders, instruments }
}

export default connect(mapStateToProps)(HistoryPage)
