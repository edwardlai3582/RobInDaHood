import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import db from '../db';
import LoginPage from './LoginPage'
import DashboardPage from './DashboardPage'
import '../styles/App.css'

class App extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    //this.getAllInstruments("https://api.robinhood.com/instruments/")
  }

  getAllInstruments = (link) => {
    fetch(link, {
      method: 'GET',
      headers: new Headers({
        'Accept': 'application/json'
      })
    })
    .then(response => response.json())
    .then(jsonResult => {
      //console.log(jsonResult);
      db.table('instruments').bulkAdd(jsonResult.results);

      if(jsonResult.next){
        this.getAllInstruments(jsonResult.next)
      }
    })
    .catch(function(reason) {
      console.log(reason);
    });
  }

  render() {
    const { token, accountNumber } = this.props
    let whatToDisplay = (token === "" || accountNumber === "" )? <LoginPage /> : <DashboardPage />

    return (
      <div>
        { whatToDisplay }
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer, accountReducer } = state
  const { token } = tokenReducer || { token: "" }
  const { accountNumber } = accountReducer || { accountNumber: "" }

  return { token, accountNumber }
}

export default connect(mapStateToProps)(App)
