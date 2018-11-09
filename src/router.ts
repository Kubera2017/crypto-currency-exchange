import { Router } from 'express';

import * as ExchangeAutomaton from './controllers/automaton.controller';

const router: Router = Router();

router.get('/', ExchangeAutomaton.getState);
router.post('/set-min-amount', ExchangeAutomaton.setMinAmount);

export const AutomatonRouter: Router = router;
