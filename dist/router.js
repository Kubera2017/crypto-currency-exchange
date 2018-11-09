"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var ExchangeAutomaton = require("./controllers/automaton.controller");
var router = express_1.Router();
router.get('/', ExchangeAutomaton.getState);
router.post('/withdraw', [ExchangeAutomaton.check, ExchangeAutomaton.withdraw]);
exports.AutomatonRouter = router;
