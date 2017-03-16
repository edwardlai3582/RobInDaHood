import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import Login from './Login'
import Dashboard from './Dashboard'

class First extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  componentDidMount() {
    //const { dispatch } = this.props
  }

  componentWillReceiveProps(nextProps) {
    /*
    if (nextProps.selectedReddit !== this.props.selectedReddit) {
      const { dispatch, selectedReddit } = nextProps
      dispatch(fetchPostsIfNeeded(selectedReddit))
    }
    */
  }

  render() {
    const { token } = this.props
    //const isEmpty = posts.length === 0
    return (
      <div>
        {token? <Dashboard />: <Login />}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer } = state

  const {
    token
  } = tokenReducer || {
    token: ""
  }

  return {
    token
  }
}

export default connect(mapStateToProps)(First)
