import { Router, Request, Response } from 'express';

const router: Router = Router();

import { ExchangeAutomaton } from '../classes/ExchangeAutomaton';


router.get('/', (req: Request, res: Response) => {
    const automaton: ExchangeAutomaton = res.locals.exchangeAutomaton;
    res.end(automaton.available.toString());
});

router.post('/set-min-amount', (req: Request, res: Response) => {
    const automaton: ExchangeAutomaton = res.locals.exchangeAutomaton;

    const minAmount: number = req.body.amount;
    automaton.setMinAmount(minAmount)
    .then(() => {
        res.end(automaton.available.toString());
    });
});


export const AutomatonController: Router = router;
