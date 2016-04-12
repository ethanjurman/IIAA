let localAccountData = '{ "users": [], "passwords": [], "favs":[], "disabled":[] }';

export function loadAccountData(callback) {
  if (window.location.href != "http://localhost:3000/") {
    const request = new XMLHttpRequest();
    request.open('GET', 'http://www.se.rit.edu/~ehj2229/loadXML.php?url=preferences.json', true);

    request.onload = () => {
      if (request.status >= 200 && request.status < 400) {
        callback(JSON.parse(request.responseText));
      }
    };

    request.send();
  } else {
    callback(JSON.parse(localAccountData));
  }
}

export function saveAccountData(accountData) {
  if (window.location.href != "http://localhost:3000/") {
    const request = new XMLHttpRequest();
    request.open('POST', 'http://www.se.rit.edu/~ehj2229/saveJSON.php', true);
    request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    request.send(accountData);
  } else {
    localAccountData = accountData;
    console.log(localAccountData);
  }
}
