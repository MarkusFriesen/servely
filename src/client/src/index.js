import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import { HashRouter as Router } from 'react-router-dom'
import { Provider } from "mobx-react"
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import Store from "./stores/Store"
import { ThemeProvider } from '@rmwc/theme';

const client = new ApolloClient();

const stores = {
  store: Store
}

ReactDOM.render(  
  <ThemeProvider options = {
    {
      primary: '#795548',
      secondary: '#486c79',
      background: '#fff'
    }
  } >
    <ApolloProvider client={client}>
      <Provider {...stores}>
      <Router>
        <App />
      </Router>
      </Provider>
    </ApolloProvider>
  </ThemeProvider>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();
