import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { askToken, resetTokenError } from '../actions'

class Login extends Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
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
    this.props.dispatch(resetTokenError())
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
  handleUsernameChange = event => {
    this.setState({username: event.target.value});
  }
  handlePasswordChange = event => {
    this.setState({password: event.target.value});
  }

  handleSubmit = event => {
    event.preventDefault();
    console.log(this.state.username+", "+ this.state.password);
    this.props.dispatch(askToken(this.state.username, this.state.password));
  }

  render() {
    const { isAsking, error } = this.props
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
          <input type="submit" value={isAsking?"loging":"submitt"} />
        </form>
        {error}
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer } = state

  const {
    isAsking,
    error,
    token
  } = tokenReducer || {
    isAsking: false,
    error:"",
    token: ""
  }

  return {
    isAsking,
    error,
    token
  }
}

export default connect(mapStateToProps)(Login)
