import mongoose = require('mongoose');
import * as express from 'express';
import * as bodyParser from 'body-parser';


import { ExchangeAutomaton } from './classes/ExchangeAutomaton';

import { AutomatonRouter } from './router';



const uri = 'mongodb://localhost:27017/cryptoExchange';
const port = 3000;

mongoose.connect(uri, err => {
  if (err) {
      throw err;
  }
  console.log('Mongo Connected!');

  const exchangeAutomaton = new ExchangeAutomaton;

    exchangeAutomaton.init()
    .then(
        result => {
            console.log(result);
            const app: express.Application = express();
            app.use(bodyParser.json());

            app.use((req, res, next) => {
                res.locals.exchangeAutomaton = exchangeAutomaton;
                next();
            });

            app.use('/', AutomatonRouter);
            app.listen(port, () => {
                console.log(`Listening at http://localhost:${port}/`);
            });
        }
    );

});




