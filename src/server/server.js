import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import path from 'path';

import schema from './data/schema';
import config from './config';

import removeOldOrderJob from './removeOldOrdersJob'

const app = express();

const server = new ApolloServer({schema});

server.applyMiddleware({app});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(config.GRAPHQL_PORT, () => console.log(
  `GraphiQL is now running on http://localhost:${config.GRAPHQL_PORT}/graphiql`
));

app.get('*', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

