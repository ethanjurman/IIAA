// main-page.js
import React, { Component } from 'react';
import { Paper, Card, FloatingActionButton, CardHeader, FlatButton, IconButton, FontIcon } from 'material-ui';
import { loadFeed } from './feed-loader';
import FavoriteIcon from 'material-ui/lib/svg-icons/action/favorite';
import FavoriteBorderIcon from 'material-ui/lib/svg-icons/action/favorite-border';
import ArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';
import SettingsIcon from 'material-ui/lib/svg-icons/action/settings';

const paperStyle = {
  width: 'calc(100% - 10px)',
  margin: '5px 10px 5px 10px',
  padding: '10px'
}

const feeds = [
  'http://espn.go.com/espn/rss/news',
  'http://rss.cnn.com/rss/edition_world.rss'
]

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
      disabled: [],
      favorites: [],
      maxFeeds: 0
    }
  }

  componentDidMount() {
    this.loadMultipleFeeds.bind(this)();
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
    feeds.forEach( (feed) => {
      loadFeed(feed, this.addFeed.bind(this));
    });
  }

  addFeed(entry) {
    if (this.state.feeds.find((feed)=>{
      return feed.title == entry.title
    })){ return; }
    this.setState({
      feeds: this.state.feeds.concat(entry).sort(this.compareDates)
    });
  }

  compareDates(entry1, entry2){
    return new Date(entry2.pubDate) - new Date(entry1.pubDate);
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
    if (JSON.parse(window.localStorage["lastVisit"])[1]) {
      lastVisit = (<div style={{margin:'10px', marginRight:'auto', marginLeft:'auto', color:'gray', fontSize:'0.8em'}}>
        Your last visit was on { JSON.parse(window.localStorage["lastVisit"])[1]}
      </div>);
    }

    const feedRender = this.state.feeds
      .filter((ele, i) => i < this.state.maxFeeds )
      .map((entry) => {
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
        <FloatingActionButton
          mini={true}
          style={{ zIndex:'5', position:'fixed', right:'10px'}}>
          <SettingsIcon />
        </FloatingActionButton>
        { lastVisit }
        { feedRender }
      </div>
    );
  }
}
