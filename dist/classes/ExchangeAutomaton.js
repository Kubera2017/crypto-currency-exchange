"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var state_1 = require("../shared/state");
var mongoose_1 = require("mongoose");
var BTCAddress_1 = require("./BTCAddress");
var Payment = /** @class */ (function () {
    function Payment(request) {
        this.amount = request.amount;
        this.currency = request.currency;
        this.to = new BTCAddress_1.BTCAddress(request.to);
    }
    return Payment;
}());
exports.Payment = Payment;
var exchangeAutomatonSchema = new mongoose_1.Schema({
    currencyName: {
        type: String,
        required: true
    },
    payment: {
        minAmount: {
            type: Number,
            required: true
        },
        maxAmount: {
            type: Number,
            required: true
        }
    },
    rate: {
        value: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Number,
            required: true
        }
    },
    available: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
});
var exchangeAutomaton = mongoose_1.model('ExchangeAutomaton', exchangeAutomatonSchema);
var ExchangeAutomaton = /** @class */ (function () {
    function ExchangeAutomaton() {
    }
    ExchangeAutomaton.prototype.init = function () {
        return __awaiter(this, void 0, void 0, function () {
            var newState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, exchangeAutomaton.create(state_1.state)];
                    case 1:
                        newState = _a.sent();
                        this.state = newState;
                        return [2 /*return*/, this.getState()];
                }
            });
        });
    };
    ExchangeAutomaton.prototype.getState = function () {
        return this.state;
    };
    ExchangeAutomaton.prototype.withdraw = function (payment) {
        return __awaiter(this, void 0, void 0, function () {
            var demand, errors, newState;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        demand = payment.amount;
                        if (payment.currency === 'usd') {
                            demand = payment.amount / this.state.rate.value;
                        }
                        console.log(demand);
                        console.log(payment);
                        errors = [];
                        if (demand < this.state.payment.minAmount) {
                            errors.push({ message: 'minAmount error' });
                        }
                        if (demand > this.state.payment.maxAmount) {
                            errors.push({ message: 'maxAmount error' });
                        }
                        if (demand > this.state.available) {
                            errors.push({ message: 'available error' });
                        }
                        if (!(errors.length !== 0)) return [3 /*break*/, 1];
                        return [2 /*return*/, { status: 'error', errors: errors }];
                    case 1: return [4 /*yield*/, exchangeAutomaton.findByIdAndUpdate(this.state._id, {
                            $set: { 'available': (this.state.available - demand) }
                        }, { new: true })];
                    case 2:
                        newState = _a.sent();
                        this.state = newState;
                        return [2 /*return*/, { status: 'ok' }];
                }
            });
        });
    };
    return ExchangeAutomaton;
}());
exports.ExchangeAutomaton = ExchangeAutomaton;
