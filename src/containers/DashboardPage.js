import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { deleteToken, askAccount } from '../actions'
import Dashboard from '../components/Dashboard'

class DashboardPage extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    isAsking: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.logout = this.logout.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props
    dispatch(askAccount());
  }

  logout = () => { this.props.dispatch(deleteToken()) }

  render() {
    //const { token } = this.props
    //const isEmpty = posts.length === 0
    return (
      <div>
        <Dashboard>
          <div>left</div>
          <div>right</div>
        </Dashboard>
      </div>
    )
  }
}
/*
<button onClick={this.logout}>
  logout
</button>
*/
const mapStateToProps = state => {
  const { accountReducer } = state
  const { isAsking, token } = accountReducer || { isAsking: false, token: "" }

  return { isAsking, token }
}

export default connect(mapStateToProps)(DashboardPage)
