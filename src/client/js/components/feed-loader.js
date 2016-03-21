import parser from 'rss-parser';

export function loadFeed(feed, callback) {
  let feedUrl = feed.rss;
  if (window.location.href != "http://localhost:3000/") {
    feedUrl = `http://www.se.rit.edu/~ehj2229/loadXML.php?url=${feed.rss}`;
  }
  parser.parseURL(feedUrl, (error, result) => {
    result.feed.entries.map((entry) => {
      callback({source:feed.name, entry:entry});
    })
  })
}
