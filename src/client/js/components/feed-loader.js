import parser from 'rss-parser';

export function loadFeed(feedUrl, callback) {
  if (window.location.href != "http://localhost:3000/") {
    feedUrl = `http://www.se.rit.edu/~ehj2229/loadXML.php?url=${feedUrl}`;
  }
  parser.parseURL(feedUrl, (error, result) => {
    result.feed.entries.map((entry) => {
      callback(entry);
    })
  })
}
