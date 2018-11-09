

import { ExchangeAutomaton } from '../classes/ExchangeAutomaton';

import { Request, Response } from 'express';

export async function getState(req: Request, res: Response) {
    const automaton: ExchangeAutomaton = res.locals.exchangeAutomaton;
    res.json(automaton.getState());
}

export async function setMinAmount(req: Request, res: Response) {
    const automaton: ExchangeAutomaton = res.locals.exchangeAutomaton;

    const minAmount: number = req.body.amount;
    // const response = await automaton.setMinAmount(minAmount);
    // res.end(response);
    res.end();
}
