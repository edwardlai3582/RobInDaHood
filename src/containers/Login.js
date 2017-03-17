import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { askToken, resetTokenError } from '../actions'
import Input from '../components/Input'
import '../styles/Login.css'

class Login extends Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    isAsking: PropTypes.bool.isRequired,
    dispatch: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      unMessage: "",
      pwMessage: ""};
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
    this.setState({username: event.target.value, unMessage:""});
  }
  handlePasswordChange = event => {
    this.setState({password: event.target.value, pwMessage:""});
  }

  handleSubmit = event => {
    event.preventDefault();
    if((this.state.username==="")||(this.state.password==="")){
      if(this.state.username===""){this.setState({unMessage: "This field may not be blank."});}
      if(this.state.password===""){this.setState({pwMessage: "This field may not be blank."});}
      return;
    }
    console.log(this.state.username+", "+ this.state.password);
    this.props.dispatch(askToken(this.state.username, this.state.password));
  }

  render() {
    const { isAsking, error } = this.props
    //const isEmpty = posts.length === 0
    return (
      <div className="loginWrapper">
        <h1 className="loginTitle">ROBINDAHOOD</h1>
        <div className="loginError">{error}</div>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" focus={true} label="USERNAME" value={this.state.username} message={this.state.unMessage} onChange={this.handleUsernameChange}/>
          <Input type="password" focus={false} label="PASSWORD" value={this.state.password} message={this.state.pwMessage} onChange={this.handlePasswordChange}/>
          <input className="loginSubmit" type="submit" value={isAsking?"LOADING...":"LOG IN"} disabled={isAsking}/>
        </form>
      </div>
    )
  }
}

/*
<label>
  username:
  <input type="text" value={this.state.username} onChange={this.handleUsernameChange} />
</label>
<label>
  password:
  <input type="text" value={this.state.password} onChange={this.handlePasswordChange} />
</label>
*/

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
