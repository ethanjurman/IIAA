export function loadAccounts(callback) {
  if (window.location.href != "http://localhost:3000/") {
    //`http://www.se.rit.edu/~ehj2229/loadAccounts.php`;
  } else {
    callback(
      {name:'ethanjurman', password:'1234', disabled: ['CNN World News'], favorites: []}
    );
  }
}
