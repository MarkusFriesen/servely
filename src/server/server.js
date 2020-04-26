import express from 'express';
import {ApolloServer} from 'apollo-server-express';
import path from 'path';
import low from 'lowdb';
import FileAsync from 'lowdb/adapters/FileAsync';

import {startCronjob} from './removeOldOrdersJob'
import {getSchema} from './data/schema';
import config from './config';

import "core-js/stable";
import "regenerator-runtime/runtime";

const adapter = new FileAsync(config.LOWDB_PATH)
low(adapter).then(db => {
  console.info("Initialized Database")
  db.defaults({orders: [], dishes: [], dishExtras: [], dishTypes: []}).write().then(() => {
    console.info("Seeded Database")
    const app = express();
    const server = new ApolloServer({schema: getSchema(db)});
    server.applyMiddleware({app});

    startCronjob(db)

    app.use(express.static(path.join(__dirname, 'public')));

    app.listen(config.GRAPHQL_PORT, () => console.log(
      `GraphiQL is now running on http://localhost:${config.GRAPHQL_PORT}/graphiql`
    ));

    app.get('*', function (req, res) {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  })
})