import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { deleteToken } from '../actions'


class Dashboard extends Component {
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
    //const { dispatch } = this.props
    //dispatch(fetchPostsIfNeeded(selectedReddit))
  }

  logout = () => { this.props.dispatch(deleteToken()) }

  render() {
    const { token } = this.props
    //const isEmpty = posts.length === 0
    return (
      <div>
        <p>{token}</p>
        <button onClick={this.logout}>
          logout
        </button>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer } = state

  const {
    isAsking,
    token
  } = tokenReducer || {
    isAsking: false,
    token: ""
  }

  return {
    isAsking,
    token
  }
}

export default connect(mapStateToProps)(Dashboard)
