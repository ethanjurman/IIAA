// settings dialog
import React, { Component } from 'react';
import { Dialog, RaisedButton, TextField, CardText } from 'material-ui';

export class Account extends Component {

  constructor(props) {
    super(props);
    this.state = {
      topText: "Currently Not Logged In"
    }
  }

  handleClose() {
    this.props.onClose();
    this.setState( { username: "", password: ""} );
  }

  checkLogIn() {
    const { accounts, setUsername } = this.props;
    if ((accounts.users.indexOf(this.state.username)) == (accounts.passwords.indexOf(this.state.password)) &&
        (accounts.users.indexOf(this.state.username) >= 0)) {
          setUsername(this.state.username);
          this.handleClose();
          this.setState({topText: `logged in as ${this.state.username}`});
    } else {
      this.setState({topText: "Username or Password is incorrect"});
    }
  }

  makeAccount() {
    const { accounts, addAccount } = this.props;
    if ((accounts.users.indexOf(this.state.username) >= 0)) {
      this.setState({topText: "Username Already Exists"});
    } else {
      addAccount(this.state.username, this.state.password);
      this.setState({topText: `logged in as ${this.state.username}`});
      this.handleClose();
    }
  }

  updateUsername(event) {
    this.setState({ username: event.target.value });
  }

  updatePassword(event) {
    this.setState({ password: event.target.value });
  }

  render() {
    const dialog = (
      <Dialog
        actions={[]}
        modal={false}
        open={this.props.show}
        onRequestClose={this.handleClose.bind(this)}>
        <CardText> {this.state.topText} </CardText>
        <TextField
          hintText="username"
          onBlur={this.updateUsername.bind(this)}
        /> <br/>
        <TextField
          hintText="password"
          type="password"
          onBlur={this.updatePassword.bind(this)}
        /> <br/>
        <RaisedButton
          label="Log In"
          onClick={this.checkLogIn.bind(this)} />
        <RaisedButton style={{marginLeft:'15px'}}
          label="Make Account"
          onClick={this.makeAccount.bind(this)} />
      </Dialog>);
    return (dialog);
  }
}

export default Account;
