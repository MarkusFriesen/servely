import express from 'express';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import Mongoose from 'mongoose'

import schema from './data/schema';
import config from './config';



const graphQLServer = express();

graphQLServer.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
graphQLServer.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }));

graphQLServer.listen(config.GRAPHQL_PORT, () => console.log(
  `GraphiQL is now running on http://localhost:${config.GRAPHQL_PORT}/graphiql`
));

mongoose.connect(config.MONGO_DB)
mongoose.connection.on('open', () => {
  console.log('MongoDB connected.')
})