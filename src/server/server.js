import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import Mongoose from 'mongoose'
import path from 'path';

import resolvers from './data/resolvers';
import typeDefs from './data/schema';
import config from './config';

import removeOldOrderJob from './removeOldOrdersJob'

const app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.listen(config.GRAPHQL_PORT, () => console.log(
  `Server is now running on http://localhost:${config.GRAPHQL_PORT}`
));

const server = new ApolloServer({ typeDefs, resolvers });
server.applyMiddleware({ app })

Mongoose.connect(config.MONGO_DB, { useNewUrlParser: true })
Mongoose.Promise = global.Promise

Mongoose.connection.on('open', () => {
  console.log('MongoDB connected.')
})