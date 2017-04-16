import React, { Component, PropTypes } from 'react'
import { connect } from 'react-redux'
import { askToken, resetTokenError } from '../actions'
import Input from '../components/Input'
import '../styles/LoginPage.css'

class LoginPage extends Component {
  static propTypes = {
    tokenError: PropTypes.string.isRequired,
    isAskingToken: PropTypes.bool.isRequired,
    accountError: PropTypes.string.isRequired,
    isAskingAccount: PropTypes.bool.isRequired,
    needMFA: PropTypes.bool.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      mfa: "",
      unMessage: "",
      pwMessage: "",
      mfaMessage:""
    };
  }

  componentDidMount() {
    this.props.onResetTokenError();
  }

  handleUsernameChange = event => {
    this.setState({username: event.target.value, unMessage:""});
  }

  handlePasswordChange = event => {
    this.setState({password: event.target.value, pwMessage:""});
  }

  handleMFAChange = event => {
    this.setState({mfa: event.target.value, mfaMessage:""});
  }

  handleSubmit = event => {
    event.preventDefault();
    if((this.state.username === "") || (this.state.password === "")){
      if(this.state.username === "") { this.setState({unMessage: "This field may not be blank."}); }
      if(this.state.password === "") { this.setState({pwMessage: "This field may not be blank."}); }
      return;
    }
    if(this.props.needMFA && this.state.mfa === ""){
      this.setState({mfaMessage: "This field may not be blank."});
      return;
    }

    this.props.onFetchToken(this.state.username, this.state.password, this.state.mfa)
  }

  render() {
    const { isAskingToken, tokenError, needMFA, isAskingAccount, accountError } = this.props
    const isAsking = isAskingToken || isAskingAccount;
    const Errors = tokenError || accountError;

    return (
      <div className="loginWrapper">
        <div className="loginLogo"></div>
        <h1 className="loginTitle"> ROBINDAHOOD </h1>
        <div className="loginError"> {Errors} </div>
        <form onSubmit={this.handleSubmit}>
          <Input type="text" focus={true} label="USERNAME" value={this.state.username} message={this.state.unMessage} onChange={this.handleUsernameChange}/>
          <Input type="password" focus={false} label="PASSWORD" value={this.state.password} message={this.state.pwMessage} onChange={this.handlePasswordChange}/>
          {(needMFA)? (
            <Input type="password" focus={false} label="MFA" value={this.state.mfa} message={this.state.mfaMessage} onChange={this.handleMFAChange}/>
          ) : null}
          <input className="loginSubmit" type="submit" value={isAsking?"LOADING...":"LOG IN"} disabled={isAskingToken}/>
        </form>
      </div>
    )
  }
}

const mapStateToProps = ({ tokenReducer, accountReducer }) => {
  const {
    isAskingToken,
    tokenError,
    needMFA
  } = tokenReducer;
  const {
    isAskingAccount,
    accountError
  } = accountReducer;

  return {
    isAskingToken,
    tokenError,
    needMFA,
    isAskingAccount,
    accountError
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onFetchToken: (username, password, mfa) => {
    dispatch(askToken(username, password, mfa));
  },
  onResetTokenError: () => {
    dispatch(resetTokenError());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage)
