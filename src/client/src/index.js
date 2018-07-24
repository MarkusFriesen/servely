import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import {
  HashRouter as Router
} from 'react-router-dom'
import { Provider } from "mobx-react"

import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";

import Store from "./stores/Store"

const client = new ApolloClient();

const stores = {
  store: Store
}

ReactDOM.render(
  <ApolloProvider client={client}>
    <Provider {...stores}>
    <Router>
      <App />
    </Router>
    </Provider>
  </ApolloProvider>, document.getElementById('root'));
registerServiceWorker();
