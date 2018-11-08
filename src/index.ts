import * as mongoose from 'mongoose';

import { ExchangeAutomaton } from './classes/ExchangeAutomaton';


let uri = 'mongodb://localhost:27017/cryptoExchange';
mongoose.connect(uri, (err) => {
  if (err) {
    console.log(err.message);
    console.log(err);
  } else {
    console.log('Connected to MongoDb');
  }
});


const exchangeAutomaton = new ExchangeAutomaton;

exchangeAutomaton.init()
.then(
    result => {
        console.log(result);
        exchangeAutomaton.setMinAmount(300).then(res => {
            console.log(res);
        });
    }
);
