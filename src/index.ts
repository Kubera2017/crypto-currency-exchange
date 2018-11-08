import mongoose = require('mongoose');
import * as express from 'express';
import * as bodyParser from 'body-parser';


import { ExchangeAutomaton } from './classes/ExchangeAutomaton';

import { AutomatonController } from './controllers/automaton.controller';



let uri = 'mongodb://localhost:27017/cryptoExchange';

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
            const port = 3000;


            app.use((req, res, next) => {
                res.locals.exchangeAutomaton = exchangeAutomaton;
                next();
            });

            app.use('/', AutomatonController);
            app.listen(port, () => {
                // Success callback
                console.log(`Listening at http://localhost:${port}/`);
                });
            // exchangeAutomaton.setMinAmount(300).then(res => {
            //     console.log(res);
            // });
        }
    );

});




