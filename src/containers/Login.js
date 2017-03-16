import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { askToken } from '../actions'


class App extends Component {
  static propTypes = {
    token: PropTypes.string.isRequired,
    isAsking: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {username: "", password:""};
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    const { dispatch } = this.props
    //dispatch(fetchPostsIfNeeded(selectedReddit))
  }

  componentWillReceiveProps(nextProps) {
    /*
    if (nextProps.selectedReddit !== this.props.selectedReddit) {
      const { dispatch, selectedReddit } = nextProps
      dispatch(fetchPostsIfNeeded(selectedReddit))
    }
    */
  }
  handleUsernameChange= event =>{
    this.setState({username: event.target.value});
  }
  handlePasswordChange= event =>{
    this.setState({password: event.target.value});
  }

  handleSubmit= event => {
    event.preventDefault();
    console.log(this.state.username+", "+ this.state.password);
    this.props.dispatch(askToken(this.state.username, this.state.password));
  }

  render() {
    //const { token } = this.props
    //const isEmpty = posts.length === 0
    return (
      <div>
        <form onSubmit={this.handleSubmit}>
          <label>
            username:
            <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
          </label>
          <label>
            password:
            <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer } = state

  const {
    isAsking,
    token
  } = token || {
    isAsking: false,
    token: ""
  }

  return {
    isAsking,
    token
  }
}

export default connect(mapStateToProps)(App)
