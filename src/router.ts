import { Router } from 'express';

import * as ExchangeAutomaton from './controllers/automaton.controller';

const router: Router = Router();

router.get('/', ExchangeAutomaton.getState);
router.post('/withdraw', [ExchangeAutomaton.check, ExchangeAutomaton.withdraw]);

export const AutomatonRouter: Router = router;
