import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ClientContext from './ClientContext';
import * as serviceWorker from './serviceWorker';

import './style/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <ClientContext>
      <App />
    </ClientContext>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
