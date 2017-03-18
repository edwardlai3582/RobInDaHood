import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { deleteToken, askAccount } from '../actions'
import Dashboard from '../components/Dashboard'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class DashboardPage extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    isAsking: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false};
    this.logout = this.logout.bind(this);

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }
  openModal() {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = 'black';
    this.refs.logoutButton.style.color = '#40C9BD';
  }

  closeModal() {
    this.setState({modalIsOpen: false});
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(askAccount());
  }

  logout = () => { this.props.dispatch(deleteToken()) }

  render() {
    //const { token } = this.props
    //const isEmpty = posts.length === 0
    //this.logout
    return (
      <div>
        <Dashboard>
          <div>
            <button onClick={this.openModal}>
              logout
            </button>
          </div>
          <div>right</div>
        </Dashboard>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="Example Modal"
        >

          <p ref="subtitle">Are you sure you want to log out?</p>
          <button onClick={this.closeModal}>CANCEL</button>
          <button ref="logoutButton" onClick={this.logout}>LOG OUT</button>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer } = state
  const { isAsking, token } = tokenReducer || { isAsking: false, token: "" }

  return { isAsking, token }
}

export default connect(mapStateToProps)(DashboardPage)
