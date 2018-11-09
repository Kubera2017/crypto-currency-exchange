

import { ExchangeAutomaton, Payment, PaymentRequest } from '../classes/ExchangeAutomaton';

import { Request, Response, NextFunction } from 'express';

export async function getState(req: Request, res: Response) {
    try {
        const automaton: ExchangeAutomaton = res.locals.exchangeAutomaton;
        res.json(automaton.getState());
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end(err.message);
    }

}

export async function withdraw(req: Request, res: Response) {
    console.log(req.body);
    try {
        const automaton: ExchangeAutomaton = res.locals.exchangeAutomaton;
        const payment: Payment = res.locals.payment;
        const result = await automaton.withdraw(payment);
        res.json(result);
    } catch (err) {
        console.log(err);
        res.status(500);
        res.end(err.message);
    }
}

export async function check(req: Request, res: Response, next: NextFunction) {
    try {
        const request: PaymentRequest = req.body;
        const payment = new Payment(request);
        console.log(payment);
        res.locals.payment = payment;
        next();
    } catch (err) {
        console.log(err);
        res.status(400);
        res.json({status: 'error', errors: [{message: 'btc address error'}]});
    }
}
