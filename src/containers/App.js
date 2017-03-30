import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import LoginPage from './LoginPage'
import DashboardPage from './DashboardPage'
import '../styles/App.css'

class App extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    accountNumber: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  render() {
    const { token, accountNumber } = this.props
    let whatToDisplay = (token === "" || accountNumber === "" )? <LoginPage /> : <DashboardPage />

    return (
      <div className={(token === "" || accountNumber === "" )? "elephantprint" : ""} >
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
