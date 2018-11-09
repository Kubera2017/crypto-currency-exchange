import mongoose = require('mongoose');
import * as express from 'express';
import * as bodyParser from 'body-parser';

import { ExchangeAutomaton } from './classes/ExchangeAutomaton';

import { AutomatonRouter } from './router';


const uri = 'mongodb://localhost:27017/cryptoExchange';
const port = 3000;

async function init(dbErr) {
    if (dbErr) {
        throw dbErr;
    }
    console.log('Mongo Connected!');

    const exchangeAutomaton = new ExchangeAutomaton;

    const initResult = await exchangeAutomaton.init();
    console.log(initResult);

    const app: express.Application = express();
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use((req, res, next) => {
        res.locals.exchangeAutomaton = exchangeAutomaton;
        next();
    });

    app.use('/', AutomatonRouter);

    await app.listen(port);
    console.log(`Listening at http://localhost:${port}/`);
}

mongoose.connect(uri, init);
