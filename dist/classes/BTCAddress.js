"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var validator = require("wallet-address-validator");
var BTCAddress = /** @class */ (function () {
    function BTCAddress(address) {
        var valid = validator.validate(address, 'BTC');
        if (valid) {
            this.address = address;
        }
        else {
            throw new Error('Address INVALID');
        }
    }
    return BTCAddress;
}());
exports.BTCAddress = BTCAddress;
