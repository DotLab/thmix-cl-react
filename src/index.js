import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import './atomic.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

import io from 'socket.io-client';

// @ts-ignore
window.recaptchaOptions = {
  useRecaptchaNet: true,
  removeOnUnmount: true,
};

const env = process.env.NODE_ENV;
let socket;
if (env === 'development') {
  const loc = window.location;
  socket = io(loc.protocol + '//' + loc.hostname + ':6003');
} else {
  socket = io();
}

ReactDOM.render(<BrowserRouter>
  <App socket={socket} env={env}/>
</BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
