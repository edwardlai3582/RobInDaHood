import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { askToken, resetTokenError } from '../actions'
import Input from '../components/Input'
import '../styles/LoginPage.css'

class LoginPage extends Component {
  static propTypes = {
    error: PropTypes.string.isRequired,
    token: PropTypes.string.isRequired,
    isAskingToken: PropTypes.bool.isRequired,
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
    const { isAskingToken, error } = this.props

    return (
      <div className="loginWrapper">
        <div className="loginLogo" />
        <h1 className="loginTitle">ROBINDAHOOD</h1>
        <div className="loginError">{error}</div>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" focus={true} label="USERNAME" value={this.state.username} message={this.state.unMessage} onChange={this.handleUsernameChange}/>
          <Input type="password" focus={false} label="PASSWORD" value={this.state.password} message={this.state.pwMessage} onChange={this.handlePasswordChange}/>
          <input className="loginSubmit" type="submit" value={isAskingToken?"LOADING...":"LOG IN"} disabled={isAskingToken}/>
        </form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { tokenReducer } = state

  const {
    isAskingToken,
    error,
    token
  } = tokenReducer || {
    isAskingToken: false,
    error:"",
    token: ""
  }

  return {
    isAskingToken,
    error,
    token
  }
}

export default connect(mapStateToProps)(LoginPage)
