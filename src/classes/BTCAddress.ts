import * as validator from 'wallet-address-validator';

export class BTCAddress {
    address: string;

    constructor(address: string) {
        let valid = validator.validate(address, 'BTC');
        if (valid) {
            this.address = address;
        } else {
            throw new Error('Address INVALID');
        }
    }
}
