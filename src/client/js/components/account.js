// settings dialog
import React, { Component } from 'react';
import { Dialog, RaisedButton, TextField } from 'material-ui';

export class Account extends Component {
  handleClose() {
    this.props.onClose();
  }

  render() {
    const dialog = (
      <Dialog
        actions={[]}
        modal={false}
        open={this.props.show}
        onRequestClose={this.handleClose.bind(this)}>
        <TextField
          hintText="username"
        /> <br/>
        <TextField
          hintText="password"
          type="password"
        /> <br/>
        <RaisedButton label="Log In" /> <RaisedButton label="Make Account" />
      </Dialog>);
    return (dialog);
  }
}

export default Account;
