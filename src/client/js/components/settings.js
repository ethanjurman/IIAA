// settings dialog
import React, { Component } from 'react';
import { Dialog, Checkbox } from 'material-ui';

export class Settings extends Component {

  handleClose() {
    this.props.onClose();
  }

  render() {
    const feeds = this.props.feeds.map((feed)=>{
      return (
        <Checkbox
          key={feed.name}
          label={feed.name}
          onCheck={this.props.toggleFeed.bind(null, feed)}
          defaultChecked={this.props.disabledFeeds.indexOf(feed.name) < 0}
        />
      );
    });
    const dialog = (
      <Dialog
        actions={[]}
        modal={false}
        open={this.props.show}
        onRequestClose={this.handleClose.bind(this)}>
        {feeds}
      </Dialog>);
    return (dialog);
  }
}

export default Settings;
