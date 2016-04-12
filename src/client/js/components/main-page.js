// main-page.js
import React, { Component } from 'react';
import { Paper, Card, FloatingActionButton, CardHeader, FlatButton, IconButton, FontIcon } from 'material-ui';
import { loadFeed } from './feed-loader';
import { Settings } from './settings';
import { Account } from './account';
import { loadAccountData, saveAccountData } from './account-loader';
import FavoriteIcon from 'material-ui/lib/svg-icons/action/favorite';
import FavoriteBorderIcon from 'material-ui/lib/svg-icons/action/favorite-border';
import ArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings';
import AccountIcon from 'material-ui/lib/svg-icons/social/person';

const paperStyle = {
  width: 'calc(100% - 10px)',
  margin: '5px 10px 5px 10px',
  padding: '10px'
}

const RSSFeeds = [
  { name:'ESPN News', rss:'http://espn.go.com/espn/rss/news' },
  { name:'CNN World News', rss:'http://rss.cnn.com/rss/edition_world.rss' },
  { name:'CNN Top News', rss:'http://rss.cnn.com/rss/edition.rss' },
  { name:'CNN Technology', rss:'http://rss.cnn.com/rss/edition_technology.rss'},
]

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
      disabledFeeds: ['CNN World News', 'CNN Top News', 'CNN Technology'],
      favorites: [],
      showSettings: false,
      showAccount: false,
      maxFeeds: 0,
      accounts: {},
      username: ''
    }
  }

  componentDidMount() {
    this.loadMultipleFeeds.bind(this)();
    loadAccountData(this.loadData.bind(this));
    setInterval(this.loadMultipleFeeds.bind(this), 10*1000);
    window.addEventListener('scroll', this.handleScroll.bind(this));

    for (let i=0; i < 10; i++){
      setTimeout(()=>{
        this.setState({maxFeeds: i})
      }, i * 200);
    }

    window.localStorage["lastVisit"] = window.localStorage["lastVisit"] || '[]';
    let lastVisit = JSON.parse(window.localStorage["lastVisit"]);
    lastVisit.unshift(this.getDateString());
    window.localStorage["lastVisit"] = JSON.stringify(lastVisit);
  }

  addAccount(username, password) {
    const { accounts } = this.state;
    accounts.users.push(username);
    accounts.passwords.push(password);
    this.setState({ accounts });
    this.setUsername(username);
    console.log(this.state.accounts);
  }

  updateAccount() {
    const { accounts, username, favorites, disabledFeeds } = this.state;
    const userIndex = accounts.users.indexOf(username);
    accounts.favs[userIndex] = favorites;
    accounts.disabled[userIndex] = disabledFeeds;
    this.setState({ accounts });
    saveAccountData(accounts);
  }

  setUsername(username) {
    const { accounts } = this.state;
    this.setState(({ username }));
    const userIndex = accounts.users.indexOf(username);
    this.setState({disabledFeeds: accounts.disabled[userIndex] || []});
    this.setState({favorites: accounts.favs[userIndex] || []});
  }

  loadData(accountData) {
    const { users, passwords, favs, disabled } = accountData;
    const accounts = {users, passwords, favs, disabled }
    this.setState({ accounts });
  }

  getDateString(){
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth()+1;
    let yyyy = today.getFullYear();
    if( dd<10 ){ dd='0'+dd }
    if( mm<10 ){ mm='0'+mm }
    return `${dd}-${mm}-${yyyy} ${today.toTimeString().split(" ")[0]}`;
  }

  loadMultipleFeeds(){
    RSSFeeds
      .filter(feed => this.state.disabledFeeds.indexOf(feed.name) == -1 )
      .forEach( (feed) => {
      loadFeed(feed, this.addFeed.bind(this));
    });
  }

  addFeed(entry) {
    if (this.state.feeds.find((feed)=>{
      return feed.entry.title == entry.entry.title
    })){ return; }
    this.setState({
      feeds: this.state.feeds.concat(entry).sort(this.compareDates)
    });
  }

  compareDates(entry1, entry2){
    return new Date(entry2.entry.pubDate) - new Date(entry1.entry.pubDate);
  }

  toggleFavorites(entry) {
    const {favorites} = this.state;

    if (favorites.find((feed)=>{
      return feed.title == entry.title
    })){
      // remove favorite
      favorites.splice(favorites.indexOf(entry),1);
      this.setState({ favorites })
      return;
    }
    // add favorites
    this.setState({
      favorites: favorites.concat(entry)
    });
    this.updateAccount();
  }

  toggleFeed(feed) {
    if (this.state.disabledFeeds.indexOf(feed.name) == -1) {
      this.setState({
        disabledFeeds: this.state.disabledFeeds.concat(feed.name)
      });
    } else {
      let disabledFeeds = this.state.disabledFeeds;
      disabledFeeds.splice(disabledFeeds.indexOf(feed.name), 1);
      this.setState({
        disabledFeeds
      });
      this.loadMultipleFeeds.bind(this)();
    }
  }

  toggleShowSettings() {
    this.setState({ showSettings: !this.state.showSettings });
    this.updateAccount();
  }

  toggleShowAccount() {
    this.setState({ showAccount: !this.state.showAccount });
    this.updateAccount();
  }

  handleScroll(event){
    // buffer of 50px
    if ((window.innerHeight + window.scrollY + 150) >= document.body.offsetHeight) {
        // you're at the bottom of the page
        this.setState({ maxFeeds: this.state.maxFeeds + 1});
    }
  }

  render() {

    if (this.state.feeds < 1) {
      return (<span> loading... </span>);
    }

    let lastVisit = '';
    if (JSON.parse(window.localStorage["lastVisit"])[1] ) {
      lastVisit = (<div style={{margin:'10px', marginRight:'auto', marginLeft:'auto', color:'gray', fontSize:'0.8em'}}>
        Your last visit was on { JSON.parse(window.localStorage["lastVisit"])[1]}
      </div>);
    }

    const feedRender = this.state.feeds
      .filter(feed => this.state.disabledFeeds.indexOf(feed.source) == -1 )
      .filter((ele, i) => i < this.state.maxFeeds )
      .map((feed) => {
        const { entry } = feed;
        return (
          <Card className={'move-in'} style={paperStyle} key={entry.title}>
            <CardHeader title={entry.title} subtitle={entry.pubDate}/>
            <IconButton onClick={this.toggleFavorites.bind(this, entry)}>
              { this.state.favorites.find((f)=>{
                return f.title == entry.title
              }) ? <FavoriteIcon color="red" /> : <FavoriteBorderIcon color="red"/>}
            </IconButton>
            <FlatButton
              style={{float:'right'}}
              label="Full Article"
              labelPosition="before"
              secondary={true}
              linkButton={true}
              href={entry.link}
              icon={<ArrowRight/>} />
          </Card>);
      });

    return (
      <div style={{minWidth:'250px'}}>
        <Settings
          feeds={RSSFeeds}
          toggleFeed={this.toggleFeed.bind(this)}
          disabledFeeds={this.state.disabledFeeds}
          show={this.state.showSettings}
          onClose={this.toggleShowSettings.bind(this)}/>
        <Account
          accounts={this.state.accounts}
          setUsername={this.setUsername.bind(this)}
          addAccount={this.addAccount.bind(this)}
          show={this.state.showAccount}
          onClose={this.toggleShowAccount.bind(this)}/>

        <FloatingActionButton
          onClick={this.toggleShowSettings.bind(this)}
          mini={true}
          style={{ zIndex:'5', position:'fixed', right:'60px'}}>
          <SettingsIcon />
        </FloatingActionButton>
        <FloatingActionButton
          onClick={this.toggleShowAccount.bind(this)}
          mini={true}
          style={{ zIndex:'5', position:'fixed', right:'10px'}}>
          <AccountIcon />
        </FloatingActionButton>
        { lastVisit }
        { feedRender }
      </div>
    );
  }
}
