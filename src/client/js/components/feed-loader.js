import parser from 'rss-parser';

export function loadFeed(feedUrl, callback) {
  parser.parseURL(feedUrl, (error, result) => {
    result.feed.entries.map((entry) => {
      callback(entry);
    })
  })
}
