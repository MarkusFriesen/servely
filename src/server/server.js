import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import Mongoose from 'mongoose'
import cors from 'cors';
import path from 'path';

import schema from './data/schema';
import config from './config';

import removeOldOrderJob from './removeOldOrdersJob'

const graphQLServer = express();
graphQLServer.use(express.static(path.join(__dirname, 'public')));

graphQLServer.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

graphQLServer.use('/graphql', cors(), bodyParser.json(), graphqlExpress({
  schema
}));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(config.GRAPHQL_PORT, () => console.log(
  `GraphiQL is now running on http://localhost:${config.GRAPHQL_PORT}/graphiql`
));

Mongoose.connect(config.MONGO_DB, { useNewUrlParser: true })
Mongoose.Promise = global.Promise

Mongoose.connection.on('open', () => {
  console.log('MongoDB connected.')
})