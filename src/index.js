import React from 'react';
import ReactDOM from 'react-dom';
import 'es6-shim';
import { Provider } from 'mobx-react';
import App from './App';
import store from './store';

document.title = 'Data Comparison Tool'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);