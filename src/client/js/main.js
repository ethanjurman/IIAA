import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import MainPage from './components/main-page';

// no need to mess with this logic unless we want to make more pages,
// or have a store component

import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

ReactDOM.render(<MainPage />, document.getElementById("main"));
