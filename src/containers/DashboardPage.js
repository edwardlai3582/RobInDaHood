import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { deleteToken, askAccount, askWatchlists, askInstrument } from '../actions'
import Dashboard from '../components/Dashboard'
import Module from '../components/Module'
import RightPanel from './RightPanel'

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
    accountNumber: PropTypes.string.isRequired,
    watchlists: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false};
    this.logout = this.logout.bind(this);

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.addTab = this.addTab.bind(this);
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
    dispatch(askWatchlists());
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.watchlists.length !== this.props.watchlists.length){
      nextProps.watchlists.forEach((instrument)=>{
        this.props.dispatch(askInstrument(instrument.instrument));
      });
    }
  }

  logout = () => { this.props.dispatch(deleteToken()) }

  addTab = (data) => {
    console.log(data);
  }

  render() {
    const { watchlists, instruments } = this.props
    let watchlistData = watchlists.map((instrument)=>{
      return {
        url: instrument.instrument,
        symbol: instruments[instrument.instrument].symbol,
        type: 'watchlist'
      };
    });

    return (
      <div>
        <Dashboard>
          <div>
            <button onClick={this.openModal}>
              logout
            </button>
            <Module moduleName="WATCHLIST" moduleData={watchlistData} callback={this.addTab} />
          </div>
          <RightPanel />
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
  const { tokenReducer, accountReducer, watchlistsReducer, instrumentsReducer } = state
  const { token } = tokenReducer || { token: "" }
  const { accountNumber } = accountReducer || { account: "" }
  const { watchlists } = watchlistsReducer || { watchlists: []}
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { token, accountNumber, watchlists, instruments}
}

export default connect(mapStateToProps)(DashboardPage)
