import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';

import './atomic.css';

import App from './App';
import * as serviceWorker from './serviceWorker';

import Api from './Api';
import ApiContext from './ApiContext';

window.recaptchaOptions = {
  useRecaptchaNet: true,
  removeOnUnmount: true,
};

const api = new Api();

ReactDOM.render(<BrowserRouter>
  <ApiContext.Provider value={api}>
    <App api={api}/>
  </ApiContext.Provider>
</BrowserRouter>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
