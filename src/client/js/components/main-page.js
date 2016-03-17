// main-page.js
import React, { Component } from 'react';
import { Card, CardHeader, FlatButton, IconButton, FontIcon } from 'material-ui';
import { loadFeed } from './feed-loader';
import FavoriteIcon from 'material-ui/lib/svg-icons/action/favorite';
import FavoriteBorderIcon from 'material-ui/lib/svg-icons/action/favorite-border';
import ArrowRight from 'material-ui/lib/svg-icons/hardware/keyboard-arrow-right';

const paperStyle = {
  width: 'calc(100% - 10px)',
  margin: '5px 10px 5px 10px',
  padding: '10px'
}

const feeds = [
  'http://espn.go.com/espn/rss/news'
];

export default class MainPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      feeds: [],
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
    let favorite = false;
    if (this.state.favorites.find((feed)=>{
      return feed.title == entry.title
    })){ this.toggleFavorites.bind(this, entry); }
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
        { feedRender }
      </div>
    );
  }
}
