import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Modal from 'react-modal'
import { deleteToken,
         askWatchlists,
         askPositions,
         askInstrument,
         addTab, selectTab
       } from '../actions'
import Dashboard from '../components/Dashboard'
import LeftPanelItem from '../components/LeftPanelItem'
import Search from './Search'
import LeftPanelModule from './LeftPanelModule'
import RightPanel from './RightPanel'
import '../styles/DashboardPage.css'

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    padding               : '10px',
    transform             : 'translate(-50%, -50%)'
  },
  overlay :{ zIndex: 999 }
};

class DashboardPage extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    keys: PropTypes.array.isRequired,
    selectedKey: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
    watchlists: PropTypes.array.isRequired,
    positions: PropTypes.array.isRequired,
    instruments: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = { modalIsOpen: false};
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(askWatchlists());
    dispatch(askPositions());
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.watchlists.length !== this.props.watchlists.length){
      nextProps.watchlists.forEach((instrument)=>{
        this.props.dispatch(askInstrument(instrument.instrument));
      });
    }
    if(nextProps.positions.length !== this.props.positions.length){
      nextProps.positions.forEach((instrument)=>{
        this.props.dispatch(askInstrument(instrument.instrument));
      });
    }
  }

  openModal = () => {
    this.setState({modalIsOpen: true});
  }

  afterOpenModal = () => {
    // references are now sync'd and can be accessed.
    this.refs.subtitle.style.color = 'black';
    this.refs.logoutButton.style.color = 'white';
    this.refs.logoutButton.style.backgroundColor = '#40C9BD';
  }

  closeModal = () => {
    this.setState({modalIsOpen: false});
  }

  logout = () => { this.props.dispatch(deleteToken()) }

  handleaddTab = (data) => {
    const key = data.symbol;

    if(this.props.keys.indexOf(key) !== -1) {
      this.props.dispatch(selectTab(key));
      return;
    }

    //let type = (data.type==="watchlist" || data.type==="positions")? "instrument" : "others"
    let newTab = {
      key: key,
      title: data.symbol,
      instrument: data.instrument,
      type: data.type
    }

    this.props.dispatch(addTab(key, newTab));
  }

  handleaddNonStockTab = (name) => {
    const key = name;

    if(this.props.keys.indexOf(key) !== -1) {
      this.props.dispatch(selectTab(key));
      return;
    }

    //let type = (data.type==="watchlist" || data.type==="positions")? "instrument" : "others"
    let newTab = {
      key: key,
      title: name,
      instrument: {},
      type: name
    }

    this.props.dispatch(addTab(key, newTab));
  }

  render() {
    const { watchlists, positions, instruments, selectedKey } = this.props
    let watchlistsMenu = "loading watchlists...";
    let positionsMenu = "loading positions...";
    let instrumentsHasAllNeeded = true;
    for(let i=0; i< watchlists.length; i++){
      if(typeof instruments[watchlists[i].instrument] === "undefined"){
        instrumentsHasAllNeeded = false;
        break;
      }
    }

    if(instrumentsHasAllNeeded){
      let watchlistData = watchlists.filter((instrument)=>{
        for(let i=0; i< positions.length; i++){
          if((positions[i].instrument === instrument.instrument)){
            return false;
          }
        }
        return true;
      })
      .map((instrument)=>{
        return {
          instrument: instrument.instrument,
          symbol: instruments[instrument.instrument].symbol,
          type: 'watchlist'
        };
      });

      let positionsData = positions.map((instrument)=>{
        return {
          instrument: instrument.instrument,
          symbol: instruments[instrument.instrument].symbol,
          type: 'position'
        };
      });

      watchlistsMenu = (<LeftPanelModule
        moduleName="WATCHLIST"
        moduleData={watchlistData}
        selectedKey={selectedKey}
        callback={this.handleaddTab}
      />);

      positionsMenu = (<LeftPanelModule
        moduleName="POSITIONS"
        moduleData={positionsData}
        selectedKey={selectedKey}
        callback={this.handleaddTab}
      />);
    }

    return (
      <div>
        <Dashboard>
          <div className="leftPanelDiv">
            <Search className="leftPanelSearch" callback={this.handleaddTab} />
            <div className="leftPanelRest">

              <LeftPanelItem
                symbol={"PORTFOLIO"}
                id={"portfolio"}
                onClick={()=>this.handleaddNonStockTab("portfolio")}
                className={selectedKey === "portfolio"? "leftSingleDiv selectedModuleDiv" : "leftSingleDiv"}
              />

              {positionsMenu}
              {watchlistsMenu}
            </div>
            <button onClick={this.openModal} className="leftPanellogoutButton">
              LOG OUT
            </button>
          </div>
          <RightPanel />
        </Dashboard>

        <Modal
          isOpen={this.state.modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          style={customStyles}
          contentLabel="LogOut Modal"
        >
          <p ref="subtitle">Are you sure you want to log out?</p>
          <div className="logoutModalButtonsWrapper">
            <button onClick={this.closeModal}>CANCEL</button>
            <button ref="logoutButton" onClick={this.logout}>LOG OUT</button>
          </div>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer, tabsReducer, accountReducer, watchlistsReducer, positionsReducer, instrumentsReducer } = state
  const { token } = tokenReducer || { token: "" }
  const { keys, selectedKey } = tabsReducer || { keys: [], selectedKey: "noTAbKey" }
  const { accountNumber } = accountReducer || { accountNumber: "" }
  const { watchlists } = watchlistsReducer || { watchlists: []}
  const { positions } = positionsReducer || { positions: []}
  const { instruments } = instrumentsReducer || { instruments: {}}

  return { token, keys, selectedKey, accountNumber, watchlists, positions, instruments}
}

export default connect(mapStateToProps)(DashboardPage)
