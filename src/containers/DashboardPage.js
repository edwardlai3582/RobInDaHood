import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { deleteToken,
         askAccount,
         askWatchlists,
         askInstrument,
         addTab,
       } from '../actions'
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
    tabs: PropTypes.array.isRequired,
    selectedTab: PropTypes.string.isRequired,
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
    this.handleaddTab = this.handleaddTab.bind(this);
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

  handleaddTab = (data) => {
    console.log(data);
    ////////////
    // key must be unique
    const key = 'newTab_' + Date.now();
    let newTab = {
      key:key,
      title: data.symbol
    }/*(<Tab key={key} title='untitled'>
                    <div>
                      <h1>{data.symbol}</h1>
                    </div>
                  </Tab>);*/
    let newTabs = this.props.tabs.concat([newTab]);

    this.props.dispatch(addTab(key, newTabs));
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
            <Module moduleName="WATCHLIST" moduleData={watchlistData} callback={this.handleaddTab} />
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
  const { tokenReducer, tabsReducer, accountReducer, watchlistsReducer, instrumentsReducer } = state
  const { token } = tokenReducer || { token: "" }
  const { tabs, selectedTab } = tabsReducer || { tabs: [], selectedTab: "" }
  const { accountNumber } = accountReducer || { account: "" }
  const { watchlists } = watchlistsReducer || { watchlists: []}
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { token, tabs, selectedTab, accountNumber, watchlists, instruments}
}

export default connect(mapStateToProps)(DashboardPage)
